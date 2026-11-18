/* ──────────────────────────────────────────────────────────────
   ⚠️ 가상의 샘플 카탈로그 (Mock 전용)
   브랜드 · 제품 · 성분표는 모두 화면 개발을 위해 만든 가상 데이터입니다.
   실제 제품 정보나 검증된 성분 데이터가 아니며, 화면에 항상 "샘플"로 표시됩니다.
   ────────────────────────────────────────────────────────────── */

import type { FragranceNotes } from "@/types/recommendation";

/** 샘플 성분표의 한 줄 */
export type SampleIngredient = {
  /** 표시명 */
  name: string;
  /** 기피 성분 프리셋 코드와 연결 (예: 알코올 → "alcohol") */
  avoidCode?: "alcohol" | "fragrance" | "paraben" | "essential_oil";
  /** 사용 중 성분(액티브) 코드와 연결 — 성분 조합 검수용 */
  activeCode?: "retinol" | "vitamin_c" | "aha_bha" | "niacinamide";
};

export type SampleCosmetic = {
  itemId: string;
  brand: string;
  name: string;
  category: string;
  imageUrl: string;
  /** 성분표 전체(샘플) */
  ingredients: SampleIngredient[];
  /** 카드에 보여줄 주요 성분 */
  keyIngredients: string[];
  /** 잘 맞는 피부 타입 코드 */
  skinTypes: string[];
  /** 관련 고민 코드 */
  concerns: string[];
};

export type SampleFragrance = {
  itemId: string;
  brand: string;
  name: string;
  concentration: string;
  imageUrl: string;
  /** 대표 향 계열 */
  family: string;
  /** 함께 매칭되는 계열 */
  families: string[];
  occasions: string[];
  notes: FragranceNotes;
  ingredients: SampleIngredient[];
};

const ALCOHOL: SampleIngredient = { name: "변성알코올", avoidCode: "alcohol" };
const PARFUM: SampleIngredient = { name: "향료", avoidCode: "fragrance" };

export const SAMPLE_COSMETICS: SampleCosmetic[] = [
  {
    itemId: "sample-cos-01",
    brand: "Atelier Calme",
    name: "카밍 배리어 세럼",
    category: "세럼",
    imageUrl: "/images/serum-marble.jpg",
    ingredients: [{ name: "판테놀" }, { name: "세라마이드 NP" }, { name: "마데카소사이드" }, { name: "글리세린" }],
    keyIngredients: ["판테놀", "세라마이드 NP", "마데카소사이드"],
    skinTypes: ["sensitive", "dry", "combination"],
    concerns: ["redness", "dryness", "acne", "flaking"],
  },
  {
    itemId: "sample-cos-02",
    brand: "Maison Lune",
    name: "클래리파잉 BHA 토너",
    category: "토너",
    imageUrl: "/images/dropper-shadow.jpg",
    ingredients: [
      { name: "살리실산(BHA)", activeCode: "aha_bha" },
      { name: "나이아신아마이드", activeCode: "niacinamide" },
      { name: "녹차추출물" },
      ALCOHOL,
    ],
    keyIngredients: ["살리실산(BHA)", "나이아신아마이드", "녹차추출물"],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "blackheads", "pores"],
  },
  {
    itemId: "sample-cos-03",
    brand: "Noir Botanique",
    name: "레티날 나이트 크림",
    category: "크림",
    imageUrl: "/images/cream-texture.jpg",
    ingredients: [
      { name: "레티날", activeCode: "retinol" },
      { name: "스쿠알란" },
      { name: "펩타이드" },
      PARFUM,
    ],
    keyIngredients: ["레티날", "스쿠알란", "펩타이드"],
    skinTypes: ["dry", "combination", "oily"],
    concerns: ["wrinkles", "pigmentation", "pores"],
  },
  {
    itemId: "sample-cos-04",
    brand: "Herbe & Sel",
    name: "그린 밸런싱 세럼",
    category: "세럼",
    imageUrl: "/images/serum-botanical.jpg",
    ingredients: [
      { name: "나이아신아마이드", activeCode: "niacinamide" },
      { name: "병풀추출물" },
      { name: "히알루론산" },
      { name: "라벤더 오일", avoidCode: "essential_oil" },
    ],
    keyIngredients: ["나이아신아마이드", "병풀추출물", "히알루론산"],
    skinTypes: ["oily", "combination"],
    concerns: ["pores", "acne", "redness", "blackheads"],
  },
  {
    itemId: "sample-cos-05",
    brand: "Studio Pâle",
    name: "비타 C 브라이트닝 앰플",
    category: "앰플",
    imageUrl: "/images/guasha-serum.jpg",
    ingredients: [
      { name: "아스코빅애씨드", activeCode: "vitamin_c" },
      { name: "토코페롤" },
      { name: "페룰릭애씨드" },
      { name: "부틸렌글라이콜" },
    ],
    keyIngredients: ["아스코빅애씨드", "토코페롤", "페룰릭애씨드"],
    skinTypes: ["dry", "oily", "combination"],
    concerns: ["pigmentation", "wrinkles"],
  },
  {
    itemId: "sample-cos-06",
    brand: "Atelier Calme",
    name: "세라마이드 리페어 밤",
    category: "밤",
    imageUrl: "/images/balm-light.jpg",
    ingredients: [{ name: "세라마이드 NP" }, { name: "시어버터" }, { name: "콜레스테롤" }, { name: "베타글루칸" }],
    keyIngredients: ["세라마이드 NP", "시어버터", "베타글루칸"],
    skinTypes: ["dry", "sensitive"],
    concerns: ["dryness", "flaking", "redness", "wrinkles"],
  },
  {
    itemId: "sample-cos-07",
    brand: "Maison Lune",
    name: "젠틀 PHA 엑스폴리에이팅 패드",
    category: "패드",
    imageUrl: "/images/oil-drop.jpg",
    ingredients: [
      { name: "글루코노락톤(PHA)", activeCode: "aha_bha" },
      { name: "판테놀" },
      { name: "메틸파라벤", avoidCode: "paraben" },
    ],
    keyIngredients: ["글루코노락톤(PHA)", "판테놀"],
    skinTypes: ["combination", "oily", "dry"],
    concerns: ["flaking", "pores", "blackheads"],
  },
];

export const SAMPLE_FRAGRANCES: SampleFragrance[] = [
  {
    itemId: "sample-fra-01",
    brand: "Maison Lune",
    name: "우드 앤 리넨",
    concentration: "오 드 퍼퓸",
    imageUrl: "/images/fragrance-clear.jpg",
    family: "woody",
    families: ["woody", "musk"],
    occasions: ["daily", "office"],
    notes: { top: ["베르가못", "카다멈"], heart: ["아이리스", "시더우드"], base: ["샌달우드", "화이트 머스크"] },
    ingredients: [ALCOHOL, PARFUM],
  },
  {
    itemId: "sample-fra-02",
    brand: "Atelier Calme",
    name: "소프트 머스크",
    concentration: "퍼퓸 오일 · 무알코올",
    imageUrl: "/images/oil-drop.jpg",
    family: "musk",
    families: ["musk", "floral"],
    occasions: ["daily", "date"],
    notes: { top: ["페어"], heart: ["화이트 머스크", "오리스"], base: ["앰브레트", "캐시미어 우드"] },
    ingredients: [{ name: "호호바씨오일" }, PARFUM],
  },
  {
    itemId: "sample-fra-03",
    brand: "Noir Botanique",
    name: "로즈 앰버",
    concentration: "오 드 퍼퓸",
    imageUrl: "/images/fragrance-amber.jpg",
    family: "floral",
    families: ["floral", "spicy"],
    occasions: ["date", "special"],
    notes: { top: ["핑크 페퍼"], heart: ["로즈", "피오니"], base: ["앰버", "바닐라"] },
    ingredients: [ALCOHOL, PARFUM],
  },
  {
    itemId: "sample-fra-04",
    brand: "Ondine",
    name: "시 솔트 네롤리",
    concentration: "오 드 코롱",
    imageUrl: "/images/fragrance-clear.jpg",
    family: "aquatic",
    families: ["aquatic", "citrus"],
    occasions: ["daily", "office"],
    notes: { top: ["네롤리", "레몬"], heart: ["씨 솔트", "로즈마리"], base: ["드리프트우드"] },
    ingredients: [ALCOHOL, PARFUM, { name: "레몬 오일", avoidCode: "essential_oil" }],
  },
  {
    itemId: "sample-fra-05",
    brand: "Herbe & Sel",
    name: "피그 리프",
    concentration: "솔리드 퍼퓸 · 무알코올",
    imageUrl: "/images/balm-light.jpg",
    family: "fruity",
    families: ["fruity", "citrus"],
    occasions: ["daily", "date"],
    notes: { top: ["피그 리프", "만다린"], heart: ["블랙커런트"], base: ["코코넛 밀크"] },
    ingredients: [{ name: "밀랍" }, PARFUM],
  },
  {
    itemId: "sample-fra-06",
    brand: "Studio Pâle",
    name: "스파이스 티",
    concentration: "오 드 퍼퓸",
    imageUrl: "/images/candle-mood.jpg",
    family: "spicy",
    families: ["spicy", "woody"],
    occasions: ["office", "special"],
    notes: { top: ["카다멈", "핑크 페퍼"], heart: ["블랙티", "시나몬"], base: ["통카빈", "베티버"] },
    ingredients: [ALCOHOL, PARFUM],
  },
];
