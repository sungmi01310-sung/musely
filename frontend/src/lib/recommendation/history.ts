import type {
  RecommendationHistory,
  RecommendationHistoryTrack,
  RecommendationResult,
} from "@/types/recommendation";
import { historyTrackOf } from "@/types/recommendation";
import { labelOf } from "@/lib/profile/options";

/** 히스토리 필터 — UI 라벨과 값 */
export const HISTORY_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "COSMETIC", label: "스킨케어" },
  { value: "FRAGRANCE", label: "향수" },
  { value: "BOTH", label: "둘 다" },
] as const;

export type HistoryFilterValue = (typeof HISTORY_FILTERS)[number]["value"];

export function isHistoryFilter(v: unknown): v is HistoryFilterValue {
  return HISTORY_FILTERS.some((f) => f.value === v);
}

/** 카드 배지용 라벨 */
export const HISTORY_TRACK_LABEL: Record<RecommendationHistoryTrack, string> = {
  COSMETIC: "화장품",
  FRAGRANCE: "향수",
  BOTH: "화장품 + 향수",
};

/**
 * 결과 상세 → 히스토리 요약 (Mock 및 서버 응답 정규화용)
 * 유형은 "실제로 담긴 제품" 기준 — 둘 다 요청했어도 향수가 0개면 화장품으로 표시
 */
export function toRecommendationHistory(r: RecommendationResult): RecommendationHistory {
  const cosmeticCount = r.cosmetics.length;
  const fragranceCount = r.fragrances.length;
  const track: RecommendationHistoryTrack =
    cosmeticCount && fragranceCount
      ? "BOTH"
      : cosmeticCount
        ? "COSMETIC"
        : fragranceCount
          ? "FRAGRANCE"
          : historyTrackOf(r.track);
  return {
    id: r.id,
    recommendationId: r.id,
    track,
    summary: r.summary,
    itemCount: cosmeticCount + fragranceCount,
    createdAt: r.createdAt,
    cosmeticCount,
    fragranceCount,
    thumbnailUrls: [...r.cosmetics, ...r.fragrances]
      .map((p) => p.imageUrl)
      .filter((u): u is string => !!u)
      .slice(0, 3),
    tags: [r.profile.skinType, ...r.profile.concerns.slice(0, 2), ...r.profile.preferredScentFamilies.slice(0, 1)]
      .filter(Boolean)
      .map(labelOf),
    sample: r.meta.sample,
  };
}
