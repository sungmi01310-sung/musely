import type { RecommendationStepKey } from "@/types/recommendation";

/** 진행 화면 4단계 — key는 서버 응답(steps[].key)과 동일 */
export const RECOMMENDATION_STEPS = [
  { key: "PROFILE_ANALYSIS", label: "프로필 분석", en: "Reading your profile" },
  { key: "PRODUCT_MATCHING", label: "조건에 맞는 제품 찾기", en: "Matching products" },
  { key: "INGREDIENT_CHECK", label: "성분 조합 검수", en: "Checking ingredients" },
  { key: "REASON_WRITING", label: "추천 이유 작성", en: "Writing the reasons" },
] as const satisfies readonly { key: RecommendationStepKey; label: string; en: string }[];

/** 진행 화면 안내 — 실제 처리 시간은 서버 상황에 따라 달라질 수 있음 */
export const EXPECTED_DURATION_TEXT = "보통 5~10초 정도 걸려요";
/** 이 시간이 지나면 "조금 더 걸리고 있어요" 안내 */
export const SLOW_NOTICE_AFTER_MS = 12_000;
/** 폴링 간격 */
export const POLL_INTERVAL_MS = 1_000;
