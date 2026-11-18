/* ──────────────────────────────────────────────────────────────
   RecommendationAdapter — 추천 API 접근 계층
   ──────────────────────────────────────────────────────────────
   화면/훅은 이 인터페이스에만 의존합니다. 구현체 교체는 환경 변수 하나로:
     NEXT_PUBLIC_RECOMMENDATION_ADAPTER=mock   (기본값, 현재 단계)
     NEXT_PUBLIC_RECOMMENDATION_ADAPTER=api    (NestJS 연동 후, STEP 08)
     NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   ────────────────────────────────────────────────────────────── */

import type {
  CreateRecommendationRequest,
  CreateRecommendationResponse,
  RecommendationDataSource,
  RecommendationFeedbackRequest,
  RecommendationFeedbackResponse,
  RecommendationJobResponse,
  RecommendationResult,
} from "@/types/recommendation";
import { httpRecommendationAdapter } from "./http-adapter";
import { mockRecommendationAdapter } from "./mock/adapter";

export interface RecommendationAdapter {
  readonly source: RecommendationDataSource;
  /** 클라이언트가 Job 완료를 기다리는 최대 시간 — 넘으면 TIMEOUT */
  readonly pollTimeoutMs: number;
  /**
   * 서버 Job 취소 지원 여부.
   * false면 "취소"는 화면 이탈 + 폴링 중단만 의미하고, 서버 작업은 그대로 진행됩니다.
   */
  readonly supportsCancel: boolean;

  createJob(request: CreateRecommendationRequest, signal?: AbortSignal): Promise<CreateRecommendationResponse>;
  getJob(jobId: string, signal?: AbortSignal): Promise<RecommendationJobResponse>;
  getRecommendation(id: string, signal?: AbortSignal): Promise<RecommendationResult>;
  submitFeedback(request: RecommendationFeedbackRequest): Promise<RecommendationFeedbackResponse>;
  cancelJob?(jobId: string): Promise<void>;
}

export const RECOMMENDATION_ADAPTER_KIND: RecommendationDataSource =
  process.env.NEXT_PUBLIC_RECOMMENDATION_ADAPTER === "api" ? "api" : "mock";

export const recommendationAdapter: RecommendationAdapter =
  RECOMMENDATION_ADAPTER_KIND === "api" ? httpRecommendationAdapter : mockRecommendationAdapter;

export const isMockRecommendation = recommendationAdapter.source === "mock";
