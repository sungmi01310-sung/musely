/* ──────────────────────────────────────────────────────────────
   사용자 · 설정 타입 — NestJS(Prisma User 모델) DTO 기준
     GET    /api/users/me                 → UserSettings
     PATCH  /api/users/me                 → UserSettings   (body: UpdateUserRequest)
     PATCH  /api/users/me/password        → 204            (body: ChangePasswordRequest)
     GET    /api/users/me/notifications   → NotificationPreferences
     PUT    /api/users/me/notifications   → NotificationPreferences
     DELETE /api/users/me                 → 204
     POST   /auth/logout                  → 204 (httpOnly 쿠키 제거)
   ────────────────────────────────────────────────────────────── */

export interface UserSettings {
  id: string;
  email: string;
  name: string | null;
  createdAt: string; // ISO 8601
}

export type UpdateUserRequest = {
  name: string | null;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type NotificationKey = "recommendation" | "service" | "marketing";

export type NotificationPreferences = Record<NotificationKey, boolean>;
