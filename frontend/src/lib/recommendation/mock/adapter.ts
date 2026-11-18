/* ──────────────────────────────────────────────────────────────
   ⚠️ Mock 추천 어댑터 — 실제 서버/AI를 호출하지 않습니다.
   ──────────────────────────────────────────────────────────────
   - Job/결과는 이 브라우저 localStorage("musely:mock:...")에만 저장
   - Job 상태와 steps는 생성 시각 기준 경과 시간으로 "시뮬레이션"한 값
     (실제 진행률이 아니므로 progress(%)는 제공하지 않음)
   - 시나리오(정상/결과 없음/실패/지연/네트워크/타임아웃)는 scenarios.ts
   ────────────────────────────────────────────────────────────── */

import type { BeautyProfile } from "@/types/beauty-profile";
import type {
  RecommendationJobResponse,
  RecommendationJobStatus,
  RecommendationResult,
  RecommendationTrack,
} from "@/types/recommendation";
import { getMyBeautyProfile } from "@/lib/api/profile";
import { mockDelay, readMockDataScenario } from "@/lib/dev/mock-data-scenario";
import { toRecommendationHistory } from "../history";
import type { RecommendationAdapter } from "../adapter";
import { RecommendationError } from "../errors";
import { RECOMMENDATION_STEPS } from "../steps";
import { buildMockResult, trackFromProfile } from "./engine";
import { SCENARIO_TIMING, readMockScenario, type MockScenario } from "./scenarios";

const JOBS_KEY = "musely:mock:recommendation-jobs";
export const RESULTS_KEY = "musely:mock:recommendations";
const MAX_STORED = 20;

type MockJob = {
  jobId: string;
  createdAt: number;
  scenario: MockScenario;
  track: RecommendationTrack;
  recommendationId: string;
};

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export function readMap<T>(key: string): Record<string, T> {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, T>) : {};
  } catch {
    return {};
  }
}

export function writeEntry<T>(key: string, id: string, value: T) {
  const map = readMap<T>(key);
  map[id] = value;
  // 오래된 항목 정리 (삽입 순서 기준)
  const ids = Object.keys(map);
  for (const old of ids.slice(0, Math.max(0, ids.length - MAX_STORED))) delete map[old];
  window.localStorage.setItem(key, JSON.stringify(map));
}

const randomId = (prefix: string) =>
  `${prefix}_mock_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** 경과 시간 → 시뮬레이션 상태 */
function simulate(job: MockJob): RecommendationJobResponse {
  const { pendingMs, stepMs, failAtStep } = SCENARIO_TIMING[job.scenario];
  const elapsed = Date.now() - job.createdAt;
  if (elapsed < pendingMs) {
    return {
      jobId: job.jobId,
      status: "PENDING",
      steps: RECOMMENDATION_STEPS.map((s) => ({ key: s.key, status: "PENDING" })),
    };
  }
  const index = Math.floor((elapsed - pendingMs) / stepMs); // 진행 중인 단계
  const failed = failAtStep !== undefined && index >= failAtStep;
  const current = failed ? failAtStep : index;
  const steps = RECOMMENDATION_STEPS.map((s, i) => ({
    key: s.key,
    status: (i < current ? "DONE" : i === current ? (failed ? "FAILED" : "RUNNING") : "PENDING") as RecommendationJobStatus,
  }));

  if (failed) {
    return {
      jobId: job.jobId,
      status: "FAILED",
      steps,
      error: { code: "SERVER_ERROR", message: "[mock] 성분 조합 검수 중 추천 서버 오류" },
    };
  }
  if (index >= RECOMMENDATION_STEPS.length) {
    return {
      jobId: job.jobId,
      status: "DONE",
      recommendationId: job.recommendationId,
      steps: steps.map((s) => ({ ...s, status: "DONE" })),
    };
  }
  return { jobId: job.jobId, status: "RUNNING", steps };
}

export const mockRecommendationAdapter: RecommendationAdapter = {
  source: "mock",
  pollTimeoutMs: 20_000,
  supportsCancel: false,

  async createJob(request, signal) {
    const scenario = readMockScenario();
    await wait(450, signal);
    if (scenario === "network") throw new RecommendationError("NETWORK_ERROR", "[mock] 네트워크 오류 시나리오");

    const saved = await getMyBeautyProfile();
    if (!saved?.profile.skinType) throw new RecommendationError("PROFILE_REQUIRED");
    const profile: BeautyProfile = saved.profile;
    // "둘 다"를 요청했어도 향 취향이 비어 있으면 화장품만 추천
    const track: RecommendationTrack =
      request.track === "both" && trackFromProfile(profile) === "cosmetic" ? "cosmetic" : request.track;

    const job: MockJob = {
      jobId: randomId("job"),
      createdAt: Date.now(),
      scenario,
      track,
      recommendationId: randomId("rec"),
    };
    // 결과는 생성 시점에 미리 만들어 두고, DONE이 된 뒤에만 ID를 공개
    const result = buildMockResult({
      id: job.recommendationId,
      jobId: job.jobId,
      profile,
      track,
      forceEmpty: scenario === "empty",
    });
    writeEntry(RESULTS_KEY, result.id, result);
    writeEntry(JOBS_KEY, job.jobId, job);
    return { jobId: job.jobId };
  },

  async getJob(jobId, signal) {
    await wait(120, signal);
    const job = readMap<MockJob>(JOBS_KEY)[jobId];
    if (!job) throw new RecommendationError("INVALID_JOB");
    return simulate(job);
  },

  async getRecommendation(id, signal) {
    await wait(350, signal);
    const result = readMap<RecommendationResult>(RESULTS_KEY)[id];
    if (!result) throw new RecommendationError("NOT_FOUND");
    return result;
  },

  async listHistory(signal) {
    await mockDelay(signal);
    const scenario = readMockDataScenario();
    if (scenario === "error") throw new RecommendationError("SERVER_ERROR", "[mock] 히스토리 조회 실패 시나리오");
    if (scenario === "empty") return [];
    return Object.values(readMap<RecommendationResult>(RESULTS_KEY))
      .map(toRecommendationHistory)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async submitFeedback() {
    await wait(600);
    // 서버로 전송하지 않음 — 저장 완료로 가장하지 않도록 persisted: false
    return { persisted: false, source: "mock" };
  },
};
