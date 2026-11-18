import { AVOID_INGREDIENTS, type AvoidPreset } from "./options";

/* ──────────────────────────────────────────────────────────────
   기피 성분 정규화
   기피 성분은 추천 결과에서 "하드 필터"로 쓰이므로
   - 공백/대소문자만 다른 중복을 막고
   - 기본 항목과 같은 의미의 입력(예: "에탄올")은 기본 항목 코드로 합칩니다.
   ────────────────────────────────────────────────────────────── */

export const INGREDIENT_MAX_LENGTH = 40;
export const AVOID_MAX_COUNT = 30;

/** 앞뒤 공백 제거 + 연속 공백 1칸으로 */
export function normalizeIngredientName(raw: string): string {
  return raw.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** 중복 비교용 키 — 공백 · 하이픈 · 대소문자 무시 */
export function ingredientKey(value: string): string {
  return normalizeIngredientName(value).toLowerCase().replace(/[\s\-_]/g, "");
}

const presetLookup = new Map<string, AvoidPreset>();
for (const preset of AVOID_INGREDIENTS) {
  for (const word of [preset.value, preset.label, ...preset.aliases]) {
    presetLookup.set(ingredientKey(word), preset.value);
  }
}

/** 입력이 기본 항목(또는 그 동의어)과 같으면 해당 코드 반환 */
export function matchPresetIngredient(name: string): AvoidPreset | null {
  return presetLookup.get(ingredientKey(name)) ?? null;
}

export function isPresetIngredient(value: string): value is AvoidPreset {
  return AVOID_INGREDIENTS.some((p) => p.value === value);
}

export type AddIngredientResult =
  | { status: "added"; value: string; list: string[] }
  | { status: "preset"; value: AvoidPreset; list: string[] }
  | { status: "duplicate"; value: string; list: string[] }
  | { status: "empty" | "too_long" | "limit"; list: string[] };

/** 성분 하나를 목록에 추가 — 결과 상태를 함께 반환해 UI 안내에 사용 */
export function addIngredient(list: string[], raw: string): AddIngredientResult {
  const name = normalizeIngredientName(raw);
  if (!name) return { status: "empty", list };
  if (name.length > INGREDIENT_MAX_LENGTH) return { status: "too_long", list };

  const preset = matchPresetIngredient(name);
  const value = preset ?? name;
  const key = ingredientKey(value);

  if (list.some((v) => ingredientKey(v) === key)) return { status: "duplicate", value, list };
  if (list.length >= AVOID_MAX_COUNT) return { status: "limit", list };

  const next = [...list, value];
  return preset ? { status: "preset", value: preset, list: next } : { status: "added", value, list: next };
}
