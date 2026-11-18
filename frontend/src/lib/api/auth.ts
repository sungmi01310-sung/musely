/* ──────────────────────────────────────────────────────────────
   인증 API 클라이언트
   ──────────────────────────────────────────────────────────────
   ⚠️ 아직 NestJS 인증 API가 없습니다 (STEP 06~08에서 구현 예정).
   그래서 아래 함수들은 성공을 흉내 내지 않고, 항상
   AuthApiNotConnectedError를 던집니다. 토큰도 만들지 않습니다.

   연동 시 교체 예정:
     POST /auth/login           → { user } + httpOnly 쿠키(access/refresh JWT)
     POST /auth/signup          → { user } + httpOnly 쿠키
     POST /auth/password/reset  → 204
   ────────────────────────────────────────────────────────────── */

import type { LoginValues, ResetPasswordValues, SignupValues } from "@/lib/validation/auth";

export type LoginRequest = LoginValues;
export type SignupRequest = Omit<SignupValues, "passwordConfirm">;
export type ResetPasswordRequest = ResetPasswordValues;

export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

export class AuthApiNotConnectedError extends Error {
  readonly code = "AUTH_API_NOT_CONNECTED";
  constructor() {
    super("인증 서버가 아직 연결되지 않았습니다.");
    this.name = "AuthApiNotConnectedError";
  }
}

export function isAuthApiNotConnected(error: unknown): error is AuthApiNotConnectedError {
  return error instanceof AuthApiNotConnectedError;
}

/**
 * 연동 전에도 제출 중(로딩) 상태와 중복 클릭 방지가 동작하는지
 * 확인할 수 있도록 짧은 네트워크 지연만 재현합니다. 연동 시 제거하세요.
 */
const simulateLatency = () => new Promise((resolve) => setTimeout(resolve, 700));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(_body: LoginRequest): Promise<AuthUser> {
  await simulateLatency();
  throw new AuthApiNotConnectedError();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signup(_body: SignupRequest): Promise<AuthUser> {
  await simulateLatency();
  throw new AuthApiNotConnectedError();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requestPasswordReset(_body: ResetPasswordRequest): Promise<void> {
  await simulateLatency();
  throw new AuthApiNotConnectedError();
}
