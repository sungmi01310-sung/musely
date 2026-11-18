/* ──────────────────────────────────────────────────────────────
   추천(Recommendation) — 프론트엔드 ↔ 백엔드 공용 응답 타입
   ──────────────────────────────────────────────────────────────
   API 계약 (STEP 04 요청서 기준, 실제 호출은 STEP 08~09)
     POST /api/recommendations                 → 202 { jobId }
     GET  /api/recommendations/jobs/{jobId}    → 200 RecommendationJobResponse | 404
     GET  /api/recommendations/{id}            → 200 RecommendationResult | 404
     POST /api/feedback                        → 200 (피드백 저장)

   필드 이름은 기존 backend 저장소(Desktop/backend)의 ai-core 연동 DTO와 맞췄습니다.
     - track: "cosmetic" | "fragrance" | "both"     (RecommendationRequest.track)
     - 후보: itemId / brand / name / category / score / notes{family, top, heart, base}  (AiCandidate)
     - 주의: pair / pairLabels / severity / message / source / confidence             (AiCaution)
     - 결과: summary / relaxationLevel / blockedBy                                     (AiResult)
   NestJS로 옮길 때 이 파일을 그대로 DTO의 기준으로 삼으면 됩니다.
   ────────────────────────────────────────────────────────────── */

import type { BeautyProfile } from "./beauty-profile";

/* ── Job ──────────────────────────────────────────────────────── */

export type RecommendationJobStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED";

/** 추천 범위 */
export type RecommendationTrack = "cosmetic" | "fragrance" | "both";

/** 진행 화면의 4단계 */
export type RecommendationStepKey =
  | "PROFILE_ANALYSIS" // 프로필 분석
  | "PRODUCT_MATCHING" // 조건에 맞는 제품 찾기
  | "INGREDIENT_CHECK" // 성분 조합 검수
  | "REASON_WRITING"; // 추천 이유 작성

export type RecommendationJobStep = {
  key: RecommendationStepKey;
  status: RecommendationJobStatus;
};

export type RecommendationErrorCode =
  | "NETWORK_ERROR" // 요청 자체가 실패 (오프라인 · DNS · CORS 등)
  | "SERVER_ERROR" // 추천 서버/AI 처리 실패 (5xx, Job FAILED)
  | "TIMEOUT" // 클라이언트 대기 한도 초과
  | "INVALID_JOB" // 존재하지 않거나 내 것이 아닌 Job ID
  | "NOT_FOUND" // 존재하지 않는(삭제된) 추천 결과
  | "PROFILE_REQUIRED" // 저장된 뷰티 프로필 없음
  | "UNKNOWN";

export type RecommendationJobError = {
  code: RecommendationErrorCode | (string & {});
  message?: string;
};

export type CreateRecommendationRequest = {
  track: RecommendationTrack;
  /** 서버에 저장된 프로필 ID — 로그인 연동 후 사용 (Mock에서는 브라우저 저장본 사용) */
  profileId?: string;
};

/** 202 Accepted */
export type CreateRecommendationResponse = {
  jobId: string;
};

export type RecommendationJobResponse = {
  jobId: string;
  status: RecommendationJobStatus;
  /** DONE일 때만 */
  recommendationId?: string;
  /** 단계별 상태 — 서버가 제공할 때만 (없으면 화면은 단계 구분 없이 진행 중으로 표시) */
  steps?: RecommendationJobStep[];
  /** 0~100 — 서버가 실제 값을 줄 때만 퍼센트를 표시 */
  progress?: number;
  /** FAILED일 때 */
  error?: RecommendationJobError;
};

/* ── Result ───────────────────────────────────────────────────── */

export type FragranceNotes = {
  top: string[];
  heart: string[];
  base: string[];
};

export type CosmeticRecommendation = {
  itemId: string;
  brand: string;
  name: string;
  /** 카테고리 표시명 (예: "세럼") */
  category: string;
  imageUrl?: string;
  /** 주요 성분 표시명 */
  keyIngredients: string[];
  /** 대표 추천 이유 (AiCandidate.note) */
  reason: string;
  /** 보조 근거 */
  reasonDetails?: string[];
  /** 0~100 — API가 제공할 때만 표시 */
  score?: number;
};

export type FragranceRecommendation = {
  itemId: string;
  brand: string;
  name: string;
  /** 향 계열 코드 (예: "woody") */
  family: string;
  /** 부향률/형태 (예: "오 드 퍼퓸", "퍼퓸 오일") */
  concentration?: string;
  imageUrl?: string;
  notes: FragranceNotes;
  reason: string;
  score?: number;
};

export type IngredientCautionSeverity = "LOW" | "MEDIUM" | "HIGH";

export type IngredientCaution = {
  id: string;
  /** 관련 성분 코드 (예: ["retinol", "aha_bha"]) */
  pair?: string[];
  /** 관련 성분 표시명 (예: ["레티놀", "AHA/BHA"]) */
  pairLabels?: string[];
  title?: string;
  message: string;
  /** 주의 등급 — API가 제공할 때만 표시 */
  severity?: IngredientCautionSeverity;
  /** 근거 출처 */
  source?: string;
  /** 근거 확신도 — API가 제공할 때만 표시 */
  confidence?: string;
};

export type RecommendationDataSource = "mock" | "api";

export type RecommendationResult = {
  id: string;
  jobId: string;
  track: RecommendationTrack;
  createdAt: string; // ISO 8601
  /** 추천 요약 문구 */
  summary: string;
  /** 추천에 사용된 프로필 스냅샷 (히스토리에서도 당시 조건을 보여주기 위함) */
  profile: BeautyProfile;
  cosmetics: CosmeticRecommendation[];
  fragrances: FragranceRecommendation[];
  cautions: IngredientCaution[];
  /**
   * 조건 완화 단계 (ai-core) — 0이면 완화 없음.
   * ⚠️ 기피 성분(avoidIngredients)은 어떤 단계에서도 완화하면 안 됩니다(하드 필터).
   */
  relaxationLevel?: number;
  /** 결과가 비었을 때 후보를 걸러낸 조건 (예: ["alcohol", "fragrance"]) */
  blockedBy?: string[];
  meta: {
    source: RecommendationDataSource;
    /** 가상의 샘플 제품/분석인지 여부 */
    sample: boolean;
  };
};

/* ── Feedback ─────────────────────────────────────────────────── */

export type RecommendationFeedbackSentiment = "LIKE" | "DISLIKE";

export type RecommendationFeedbackRequest = {
  recommendationId: string;
  sentiment: RecommendationFeedbackSentiment;
  comment?: string;
};

export type RecommendationFeedbackResponse = {
  /** 서버(DB)에 실제로 저장되었는지 — Mock은 항상 false */
  persisted: boolean;
  source: RecommendationDataSource;
};
