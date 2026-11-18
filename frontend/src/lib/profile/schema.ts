import { z } from "zod";
import type { BeautyProfile } from "@/types/beauty-profile";
import {
  ACTIVE_VALUES,
  CONCERN_VALUES,
  OCCASION_VALUES,
  SCENT_VALUES,
  SKIN_TYPE_VALUES,
} from "./options";
import { AVOID_MAX_COUNT, INGREDIENT_MAX_LENGTH, ingredientKey, normalizeIngredientName } from "./ingredients";

/* ──────────────────────────────────────────────────────────────
   뷰티 프로필 검증 스키마 (React Hook Form + Zod)
   STEP 1(피부)과 STEP 2(향)를 각각 정의하고, 저장 시 전체를 검증합니다.
   ────────────────────────────────────────────────────────────── */

const skinTypeSet = new Set<string>(SKIN_TYPE_VALUES);

export const skinStepSchema = z.object({
  // 폼 초기값은 "" (미선택) — 저장 시에는 유효한 코드만 허용
  skinType: z.string().refine((v) => skinTypeSet.has(v), "피부 타입을 하나 선택해 주세요."),
  concerns: z.array(z.enum(CONCERN_VALUES)),
  avoidIngredients: z
    .array(z.string().transform(normalizeIngredientName).pipe(z.string().min(1).max(INGREDIENT_MAX_LENGTH)))
    .max(AVOID_MAX_COUNT, `기피 성분은 최대 ${AVOID_MAX_COUNT}개까지 등록할 수 있어요.`)
    .refine(
      (list) => new Set(list.map(ingredientKey)).size === list.length,
      "중복된 기피 성분이 있어요.",
    ),
  currentActives: z.array(z.enum(ACTIVE_VALUES)),
});

export const fragranceStepSchema = z.object({
  preferredScentFamilies: z.array(z.enum(SCENT_VALUES)),
  occasion: z.enum(OCCASION_VALUES).nullable(),
});

export const beautyProfileSchema = skinStepSchema.extend(fragranceStepSchema.shape);

/** 폼에서 다루는 값 (입력 타입) */
export type BeautyProfileFormValues = z.input<typeof beautyProfileSchema>;
/** 검증을 통과한 값 (출력 타입) */
export type BeautyProfileParsed = z.output<typeof beautyProfileSchema>;

/** 단계별 필드 — "다음" 버튼에서 해당 단계만 trigger() 할 때 사용 */
export const SKIN_STEP_FIELDS = Object.keys(skinStepSchema.shape) as (keyof BeautyProfileFormValues)[];
export const FRAGRANCE_STEP_FIELDS = Object.keys(fragranceStepSchema.shape) as (keyof BeautyProfileFormValues)[];

export const EMPTY_FORM_VALUES: BeautyProfileFormValues = {
  skinType: "",
  concerns: [],
  avoidIngredients: [],
  currentActives: [],
  preferredScentFamilies: [],
  occasion: null,
};

/** 검증된 폼 값 → API 전송용 BeautyProfile */
export function toBeautyProfile(values: BeautyProfileParsed): BeautyProfile {
  return {
    skinType: values.skinType,
    concerns: [...values.concerns],
    avoidIngredients: [...values.avoidIngredients],
    currentActives: [...values.currentActives],
    preferredScentFamilies: [...values.preferredScentFamilies],
    occasion: values.occasion,
  };
}

/* ── 외부 데이터(임시 저장본 · API 응답) 정리 ─────────────────── */

const pick = <T extends string>(allowed: readonly T[], input: unknown): T[] => {
  if (!Array.isArray(input)) return [];
  const set = new Set<string>(allowed);
  return [...new Set(input.filter((v): v is T => typeof v === "string" && set.has(v)))];
};

/**
 * localStorage 등 신뢰할 수 없는 데이터를 폼 값으로 안전하게 변환.
 * 알 수 없는 코드/잘못된 타입은 버리고 나머지는 살립니다.
 */
export function sanitizeProfileValues(raw: unknown): BeautyProfileFormValues {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const avoid = Array.isArray(r.avoidIngredients)
    ? r.avoidIngredients
        .filter((v): v is string => typeof v === "string")
        .map(normalizeIngredientName)
        .filter((v) => v.length > 0 && v.length <= INGREDIENT_MAX_LENGTH)
    : [];
  const seen = new Set<string>();
  return {
    skinType: typeof r.skinType === "string" && skinTypeSet.has(r.skinType) ? r.skinType : "",
    concerns: pick(CONCERN_VALUES, r.concerns),
    avoidIngredients: avoid
      .filter((v) => {
        const k = ingredientKey(v);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, AVOID_MAX_COUNT),
    currentActives: pick(ACTIVE_VALUES, r.currentActives),
    preferredScentFamilies: pick(SCENT_VALUES, r.preferredScentFamilies),
    occasion:
      typeof r.occasion === "string" && (OCCASION_VALUES as readonly string[]).includes(r.occasion)
        ? (r.occasion as BeautyProfileFormValues["occasion"])
        : null,
  };
}
