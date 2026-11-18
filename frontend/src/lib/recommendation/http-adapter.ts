/* ──────────────────────────────────────────────────────────────
   실제 API 어댑터 — ⚠️ 아직 사용하지 않음 (NEXT_PUBLIC_RECOMMENDATION_ADAPTER=api 일 때만)
   NestJS 백엔드(STEP 06~08)가 준비되면 이 구현으로 교체됩니다.
   인증은 httpOnly 쿠키(JWT) 기준 — credentials: "include"
   ────────────────────────────────────────────────────────────── */

import type {
  CreateRecommendationRequest,
  CreateRecommendationResponse,
  RecommendationJobResponse,
  RecommendationResult,
} from "@/types/recommendation";
import type { RecommendationAdapter } from "./adapter";
import { RecommendationError, toRecommendationError } from "./errors";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

async function request<T>(
  path: string,
  init: RequestInit & { notFound?: "INVALID_JOB" | "NOT_FOUND" } = {},
): Promise<T> {
  const { notFound, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...rest.headers },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw toRecommendationError(error);
  }
  if (res.status === 404 && notFound) throw new RecommendationError(notFound);
  if (res.status === 400 && path === "/api/recommendations") throw new RecommendationError("PROFILE_REQUIRED");
  if (res.status === 408 || res.status === 504) throw new RecommendationError("TIMEOUT");
  if (!res.ok) throw new RecommendationError("SERVER_ERROR", `HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** 서버 ID가 숫자(Long)여도 화면에서는 문자열로 통일 */
const asId = (value: unknown) => String(value);

export const httpRecommendationAdapter: RecommendationAdapter = {
  source: "api",
  pollTimeoutMs: 90_000,
  supportsCancel: false, // 서버에 Job 취소 API가 생기면 true + cancelJob 구현

  async createJob(body: CreateRecommendationRequest, signal) {
    const res = await request<CreateRecommendationResponse>("/api/recommendations", {
      method: "POST",
      body: JSON.stringify(body),
      signal,
    });
    return { jobId: asId(res.jobId) };
  },

  async getJob(jobId, signal) {
    const res = await request<RecommendationJobResponse>(
      `/api/recommendations/jobs/${encodeURIComponent(jobId)}`,
      { signal, notFound: "INVALID_JOB" },
    );
    return {
      ...res,
      jobId: asId(res.jobId),
      recommendationId: res.recommendationId != null ? asId(res.recommendationId) : undefined,
    };
  },

  async getRecommendation(id, signal) {
    const res = await request<RecommendationResult>(`/api/recommendations/${encodeURIComponent(id)}`, {
      signal,
      notFound: "NOT_FOUND",
    });
    return { ...res, id: asId(res.id), meta: { source: "api", sample: res.meta?.sample ?? false } };
  },

  async submitFeedback({ recommendationId, sentiment, comment }) {
    // 기존 backend의 FeedbackRequest는 rating(Integer) — 값 의미는 백엔드와 합의 필요 (임시: 좋아요 1 / 아쉬워요 0)
    await request("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ recommendationId, rating: sentiment === "LIKE" ? 1 : 0, comment }),
    });
    return { persisted: true, source: "api" };
  },
};
