/* ──────────────────────────────────────────────────────────────
   뷰티 프로필 API 클라이언트 — ⚠️ 현재 MOCK 구현
   ──────────────────────────────────────────────────────────────
   NestJS API가 아직 없으므로(STEP 06~08), 저장 결과를 이 브라우저의
   localStorage("musely:mock:...")에만 보관합니다. 서버로 전송되지 않습니다.
   모든 응답에 source: "mock" 이 붙어 실제 데이터와 구분됩니다.

   연동 시 교체 예정 (로그인 필요, httpOnly 쿠키 JWT):
     GET /me/beauty-profile  → 200 SavedBeautyProfile | 404
     PUT /me/beauty-profile  → 200 SavedBeautyProfile   (body: BeautyProfile)
   ────────────────────────────────────────────────────────────── */

import type { BeautyProfile } from "@/types/beauty-profile";
import { sanitizeProfileValues } from "@/lib/profile/schema";

export type ProfileDataSource = "mock" | "api";

export type SavedBeautyProfile = {
  profile: BeautyProfile;
  savedAt: string; // ISO 8601
  source: ProfileDataSource;
};

export const PROFILE_API_SOURCE: ProfileDataSource = "mock";

const MOCK_STORAGE_KEY = "musely:mock:beauty-profile";
const mockLatency = () => new Promise((resolve) => setTimeout(resolve, 600));

/** 저장된 내 프로필 조회 (수정 모드에서 기존 데이터 불러오기) */
export async function getMyBeautyProfile(): Promise<SavedBeautyProfile | null> {
  await mockLatency();
  try {
    const raw = window.localStorage.getItem(MOCK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedBeautyProfile>;
    const values = sanitizeProfileValues(parsed.profile);
    if (!values.skinType || typeof parsed.savedAt !== "string") return null;
    return { profile: { ...values }, savedAt: parsed.savedAt, source: "mock" };
  } catch {
    return null;
  }
}

/** 내 프로필 저장(생성/수정 공통 — PUT 시맨틱) */
export async function saveMyBeautyProfile(profile: BeautyProfile): Promise<SavedBeautyProfile> {
  await mockLatency();
  const saved: SavedBeautyProfile = { profile, savedAt: new Date().toISOString(), source: "mock" };
  try {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(saved));
  } catch {
    throw new Error("브라우저 저장소를 사용할 수 없어 저장하지 못했어요.");
  }
  return saved;
}
