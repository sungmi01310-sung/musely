/* ──────────────────────────────────────────────────────────────
   뷰티 프로필 선택지 — API 값(value)과 화면 라벨(label) 분리
   value는 서버/DB/AI에 그대로 전달되므로 변경 시 백엔드와 함께 수정하세요.
   ────────────────────────────────────────────────────────────── */

export type Option<V extends string = string> = {
  value: V;
  label: string;
  /** 영문 보조 표기 (에디토리얼 타이포용) */
  en?: string;
  description?: string;
};

/* 피부 타입 — 단일 선택, 필수 */
export const SKIN_TYPES = [
  { value: "dry", label: "건성", en: "Dry", description: "세안 후 당기고 각질이 쉽게 일어나요" },
  { value: "oily", label: "지성", en: "Oily", description: "유분이 많고 오후면 번들거려요" },
  { value: "combination", label: "복합성", en: "Combination", description: "T존은 번들, 볼은 건조한 편이에요" },
  { value: "sensitive", label: "민감성", en: "Sensitive", description: "쉽게 붉어지고 자극에 예민해요" },
] as const satisfies readonly Option[];

/* 피부 고민 — 다중 선택 */
export const CONCERNS = [
  { value: "acne", label: "트러블" },
  { value: "pores", label: "모공" },
  { value: "flaking", label: "각질" },
  { value: "redness", label: "홍조" },
  { value: "wrinkles", label: "주름" },
  { value: "pigmentation", label: "색소침착" },
  { value: "blackheads", label: "블랙헤드" },
  { value: "dryness", label: "건조함" },
] as const satisfies readonly Option[];

/* 피하고 싶은 성분 — 기본 항목 (+ 직접 입력) */
export const AVOID_INGREDIENTS = [
  { value: "alcohol", label: "알코올", aliases: ["알콜", "에탄올", "ethanol", "alcohol denat", "변성알코올"] },
  { value: "fragrance", label: "향료", aliases: ["인공향료", "합성향료", "parfum", "perfume"] },
  { value: "paraben", label: "파라벤", aliases: ["parabens", "파라벤류"] },
  { value: "essential_oil", label: "에센셜오일", aliases: ["essential oil", "에센셜 오일", "정유"] },
] as const satisfies readonly (Option & { aliases: readonly string[] })[];

/* 현재 사용 중인 성분 — 다중 선택 */
export const CURRENT_ACTIVES = [
  { value: "retinol", label: "레티놀" },
  { value: "vitamin_c", label: "비타민 C" },
  { value: "aha_bha", label: "AHA/BHA" },
  { value: "niacinamide", label: "나이아신아마이드" },
] as const satisfies readonly Option[];

/* 선호하는 향 계열 — 다중 선택 */
export const SCENT_FAMILIES = [
  { value: "woody", label: "우디", en: "Woody", description: "따뜻하고 차분한 나무 향", swatch: "#9C8B76" },
  { value: "floral", label: "플로럴", en: "Floral", description: "부드럽고 화사한 꽃 향", swatch: "#D8C5CE" },
  { value: "citrus", label: "시트러스", en: "Citrus", description: "산뜻하고 상쾌한 과일 향", swatch: "#E3D3A4" },
  { value: "musk", label: "머스크", en: "Musk", description: "포근하고 은은한 향", swatch: "#E6DDE8" },
  { value: "spicy", label: "스파이시", en: "Spicy", description: "따뜻하고 관능적인 향신료 향", swatch: "#B98B72" },
  { value: "fruity", label: "프루티", en: "Fruity", description: "달콤하고 생기 있는 과일 향", swatch: "#E2B6B0" },
  { value: "aquatic", label: "아쿠아틱", en: "Aquatic", description: "맑고 시원한 물결 같은 향", swatch: "#B9CBD3" },
] as const satisfies readonly (Option & { swatch: string })[];

/* 주로 사용하는 상황 — 단일 선택 (선택 사항) */
export const OCCASIONS = [
  { value: "daily", label: "데일리", en: "Daily", description: "매일 부담 없이" },
  { value: "office", label: "오피스", en: "Office", description: "단정하고 은은하게" },
  { value: "date", label: "데이트", en: "Date", description: "가까이에서 느껴지게" },
  { value: "special", label: "특별한 날", en: "Special", description: "기억에 남는 한 장면" },
] as const satisfies readonly Option[];

/* ── 타입 & 값 목록 ───────────────────────────────────────────── */

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as unknown as readonly [T[number]["value"], ...T[number]["value"][]];

export const SKIN_TYPE_VALUES = values(SKIN_TYPES);
export const CONCERN_VALUES = values(CONCERNS);
export const AVOID_PRESET_VALUES = values(AVOID_INGREDIENTS);
export const ACTIVE_VALUES = values(CURRENT_ACTIVES);
export const SCENT_VALUES = values(SCENT_FAMILIES);
export const OCCASION_VALUES = values(OCCASIONS);

export type SkinType = (typeof SKIN_TYPE_VALUES)[number];
export type Concern = (typeof CONCERN_VALUES)[number];
export type AvoidPreset = (typeof AVOID_PRESET_VALUES)[number];
export type CurrentActive = (typeof ACTIVE_VALUES)[number];
export type ScentFamily = (typeof SCENT_VALUES)[number];
export type Occasion = (typeof OCCASION_VALUES)[number];

/* ── 코드 → 라벨 ──────────────────────────────────────────────── */

const labelMap = new Map<string, string>(
  [...SKIN_TYPES, ...CONCERNS, ...AVOID_INGREDIENTS, ...CURRENT_ACTIVES, ...SCENT_FAMILIES, ...OCCASIONS].map(
    (o) => [o.value, o.label],
  ),
);

/** API 코드를 화면 라벨로 변환 (직접 입력한 성분명은 그대로 반환) */
export function labelOf(value: string): string {
  return labelMap.get(value) ?? value;
}
