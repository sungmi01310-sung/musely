/* ──────────────────────────────────────────────────────────────
   ⚠️ 개발용 샘플 히스토리 — 화면 확인을 위해 가상의 추천 기록을 만듭니다.
   생성된 기록은 이 브라우저 localStorage에만 저장되며 "샘플"로 표시됩니다.
   ────────────────────────────────────────────────────────────── */

import type { BeautyProfile } from "@/types/beauty-profile";
import type { RecommendationResult, RecommendationTrack } from "@/types/recommendation";
import { buildMockResult } from "./engine";
import { RESULTS_KEY, readMap, writeEntry } from "./adapter";

const DAY = 86_400_000;

const SEEDS: { daysAgo: number; track: RecommendationTrack; profile: BeautyProfile }[] = [
  {
    daysAgo: 2,
    track: "both",
    profile: { skinType: "combination", concerns: ["acne", "pores"], avoidIngredients: ["paraben"], currentActives: ["niacinamide"], preferredScentFamilies: ["woody", "musk"], occasion: "office" },
  },
  {
    daysAgo: 9,
    track: "fragrance",
    profile: { skinType: "dry", concerns: [], avoidIngredients: [], currentActives: [], preferredScentFamilies: ["citrus", "aquatic"], occasion: "daily" },
  },
  {
    daysAgo: 24,
    track: "cosmetic",
    profile: { skinType: "sensitive", concerns: ["redness", "dryness"], avoidIngredients: ["fragrance", "alcohol"], currentActives: ["retinol"], preferredScentFamilies: [], occasion: null },
  },
  {
    daysAgo: 41,
    track: "both",
    profile: { skinType: "oily", concerns: ["blackheads", "pores"], avoidIngredients: ["essential_oil"], currentActives: ["aha_bha", "vitamin_c"], preferredScentFamilies: ["floral", "spicy"], occasion: "date" },
  },
];

/** 샘플 추천 기록 4건 생성 */
export function seedMockHistory(): number {
  SEEDS.forEach((seed, i) => {
    const id = `rec_sample_${i + 1}`;
    const result: RecommendationResult = {
      ...buildMockResult({ id, jobId: `job_sample_${i + 1}`, profile: seed.profile, track: seed.track }),
      createdAt: new Date(Date.now() - seed.daysAgo * DAY).toISOString(),
    };
    writeEntry(RESULTS_KEY, id, result);
  });
  return SEEDS.length;
}

/** 이 브라우저의 Mock 추천 기록 모두 삭제 */
export function clearMockHistory() {
  try {
    window.localStorage.removeItem(RESULTS_KEY);
    window.localStorage.removeItem("musely:mock:recommendation-jobs");
  } catch {
    /* noop */
  }
}

export function listMockResults(): RecommendationResult[] {
  return Object.values(readMap<RecommendationResult>(RESULTS_KEY));
}
