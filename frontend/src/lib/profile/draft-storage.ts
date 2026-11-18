import { sanitizeProfileValues, type BeautyProfileFormValues } from "./schema";

/* ──────────────────────────────────────────────────────────────
   임시 저장(Draft) — "입력 중"인 값을 새로고침에도 유지하기 위한 저장소
   ──────────────────────────────────────────────────────────────
   ⚠️ 이것은 "저장된 프로필"이 아닙니다.
     - Draft  : 이 브라우저의 localStorage, 입력 도중 자동 저장, 저장 완료 시 삭제
     - Profile: 서버(현재는 Mock, src/lib/api/profile.ts)에 저장되는 확정본
   ────────────────────────────────────────────────────────────── */

const DRAFT_KEY = "musely:draft:beauty-profile";
const DRAFT_VERSION = 1;
/** 오래된 임시 저장본은 자동 폐기 */
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredDraft = {
  version: number;
  updatedAt: number;
  values: BeautyProfileFormValues;
};

export type ProfileDraft = { values: BeautyProfileFormValues; updatedAt: number };

export function readDraft(): ProfileDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (parsed.version !== DRAFT_VERSION || typeof parsed.updatedAt !== "number") return clearAndNull();
    if (Date.now() - parsed.updatedAt > DRAFT_TTL_MS) return clearAndNull();
    return { values: sanitizeProfileValues(parsed.values), updatedAt: parsed.updatedAt };
  } catch {
    return null; // 저장소 접근 불가(프라이빗 모드 등) → 임시 저장 없이 동작
  }
}

export function writeDraft(values: BeautyProfileFormValues): number | null {
  try {
    const updatedAt = Date.now();
    const data: StoredDraft = { version: DRAFT_VERSION, updatedAt, values };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    return updatedAt;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

function clearAndNull() {
  clearDraft();
  return null;
}

/** 아무것도 입력하지 않은 상태인지 (빈 값은 임시 저장하지 않음) */
export function isEmptyDraft(v: BeautyProfileFormValues): boolean {
  return (
    !v.skinType &&
    v.concerns.length === 0 &&
    v.avoidIngredients.length === 0 &&
    v.currentActives.length === 0 &&
    v.preferredScentFamilies.length === 0 &&
    v.occasion === null
  );
}
