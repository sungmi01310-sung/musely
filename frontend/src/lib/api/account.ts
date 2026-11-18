/* ──────────────────────────────────────────────────────────────
   계정 · 설정 API 클라이언트 — ⚠️ 아직 NestJS 미연결
   ──────────────────────────────────────────────────────────────
   - 조회: 개발 환경(next dev)에서만 "개발용 샘플 계정"을 돌려줍니다.
           프로덕션 빌드에서는 로그인 기능이 없으므로 null(로그인 전)입니다.
   - 변경(이름 · 비밀번호 · 탈퇴 · 로그아웃): 성공을 흉내 내지 않고
           항상 AuthApiNotConnectedError를 던집니다.
   엔드포인트 계약은 src/types/user.ts 주석 참고.
   ────────────────────────────────────────────────────────────── */

import type { ChangePasswordRequest, NotificationPreferences, UpdateUserRequest, UserSettings } from "@/types/user";
import { AuthApiNotConnectedError } from "@/lib/api/auth";
import { getMyBeautyProfile, type SavedBeautyProfile } from "@/lib/api/profile";
import { mockDelay, readMockDataScenario } from "@/lib/dev/mock-data-scenario";

export type AccountDataSource = "mock" | "api";

export type MeResult =
  | { status: "signed-in"; user: UserSettings; source: AccountDataSource }
  /** 로그인 기능 미연결 또는 로그아웃 상태 */
  | { status: "signed-out" };

export class AccountApiError extends Error {
  constructor(message = "계정 정보를 불러오지 못했어요.") {
    super(message);
    this.name = "AccountApiError";
  }
}

/** 개발 환경 전용 샘플 계정 — 실제 사용자 정보가 아님 */
const DEV_SAMPLE_USER: UserSettings = {
  id: "usr_dev_sample",
  email: "sample.user@musely.dev",
  name: "샘플 사용자",
  createdAt: "2026-09-01T09:00:00.000Z",
};

export const isDevSampleAccountEnabled = process.env.NODE_ENV === "development";

export async function getMe(signal?: AbortSignal): Promise<MeResult> {
  await mockDelay(signal, 400);
  if (readMockDataScenario() === "error") throw new AccountApiError("[mock] 계정 조회 실패 시나리오");
  if (!isDevSampleAccountEnabled) return { status: "signed-out" };
  return { status: "signed-in", user: DEV_SAMPLE_USER, source: "mock" };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateMe(_body: UpdateUserRequest): Promise<UserSettings> {
  await mockDelay(undefined, 700);
  throw new AuthApiNotConnectedError();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function changePassword(_body: ChangePasswordRequest): Promise<void> {
  await mockDelay(undefined, 700);
  throw new AuthApiNotConnectedError();
}

export async function logout(): Promise<void> {
  await mockDelay(undefined, 500);
  throw new AuthApiNotConnectedError();
}

export async function deleteAccount(): Promise<void> {
  await mockDelay(undefined, 800);
  throw new AuthApiNotConnectedError();
}

/** 설정 화면의 뷰티 프로필 (Mock 저장본) — "프로필 미등록" 시나리오 반영 */
export async function getBeautyProfileForSettings(): Promise<SavedBeautyProfile | null> {
  if (readMockDataScenario() === "no-profile") {
    await mockDelay(undefined, 300);
    return null;
  }
  return getMyBeautyProfile();
}

/* ── 알림 설정 — 서버 연동 전: 이 브라우저에만 기억 (발송 기능 없음) ── */

const NOTIFICATION_KEY = "musely:local:notification-preferences";

export const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  recommendation: true,
  service: true,
  marketing: false,
};

export function readLocalNotificationPreferences(): NotificationPreferences {
  try {
    const raw = window.localStorage.getItem(NOTIFICATION_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<NotificationPreferences>) : {};
    return {
      recommendation: typeof parsed.recommendation === "boolean" ? parsed.recommendation : DEFAULT_NOTIFICATIONS.recommendation,
      service: typeof parsed.service === "boolean" ? parsed.service : DEFAULT_NOTIFICATIONS.service,
      marketing: typeof parsed.marketing === "boolean" ? parsed.marketing : DEFAULT_NOTIFICATIONS.marketing,
    };
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function writeLocalNotificationPreferences(prefs: NotificationPreferences) {
  try {
    window.localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(prefs));
  } catch {
    /* noop */
  }
}
