/* ──────────────────────────────────────────────────────────────
   BeautyProfile — 프론트엔드 ↔ NestJS 공용 데이터 구조
   ──────────────────────────────────────────────────────────────
   - 모든 값은 "API 값(영문 코드)"으로 저장/전송합니다.
     화면용 한글 라벨은 src/lib/profile/options.ts 에서만 매핑합니다.
   - NestJS에서는 같은 필드로 DTO(class-validator)를 만들면 됩니다.
       class BeautyProfileDto {
         @IsIn(SKIN_TYPE_VALUES) skinType: string;
         @IsArray() @IsIn(CONCERN_VALUES, { each: true }) concerns: string[];
         @IsArray() @IsString({ each: true }) @MaxLength(40, { each: true }) avoidIngredients: string[];
         @IsArray() @IsIn(ACTIVE_VALUES, { each: true }) currentActives: string[];
         @IsArray() @IsIn(SCENT_VALUES, { each: true }) preferredScentFamilies: string[];
         @IsOptional() @IsIn(OCCASION_VALUES) occasion: string | null;
       }
   ────────────────────────────────────────────────────────────── */

export interface BeautyProfile {
  /** "dry" | "oily" | "combination" | "sensitive" — 필수 */
  skinType: string;
  /** 피부 고민 코드 목록 (예: "acne", "pores") */
  concerns: string[];
  /**
   * 기피 성분 — 추천 필터링(하드 제외)에 사용되는 핵심 데이터.
   * - 기본 항목은 코드("alcohol", "fragrance", "paraben", "essential_oil")
   * - 직접 입력한 성분은 정규화된 이름 그대로 (예: "실리콘", "PEG-40")
   */
  avoidIngredients: string[];
  /** 현재 사용 중인 액티브 성분 코드 — 성분 조합 주의사항 안내에 사용 */
  currentActives: string[];
  /** 선호 향 계열 코드 — 향 단계를 건너뛰면 [] */
  preferredScentFamilies: string[];
  /** 주 사용 상황 코드 — 선택 안 함/건너뛰기 시 null */
  occasion: string | null;
}

export const EMPTY_BEAUTY_PROFILE: BeautyProfile = {
  skinType: "",
  concerns: [],
  avoidIngredients: [],
  currentActives: [],
  preferredScentFamilies: [],
  occasion: null,
};
