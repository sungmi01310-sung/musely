import { z } from "zod";

/* ──────────────────────────────────────────────────────────────
   인증 폼 검증 스키마 (React Hook Form + Zod)
   - 추후 NestJS DTO(class-validator) 규칙과 동일하게 유지할 것
   ────────────────────────────────────────────────────────────── */

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

const emailField = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요.")
  .pipe(z.email("올바른 이메일 형식이 아니에요. 예) hello@musely.com"));

/* 로그인 ─────────────────────────────────────────────────────── */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export type LoginValues = z.infer<typeof loginSchema>;

/* 회원가입 ───────────────────────────────────────────────────── */

const passwordFields = z.object({
  password: z
    .string()
    .min(1, "비밀번호를 입력해 주세요.")
    .min(PASSWORD_MIN, `비밀번호는 ${PASSWORD_MIN}자 이상이어야 해요.`)
    .max(PASSWORD_MAX, `비밀번호는 ${PASSWORD_MAX}자 이하로 입력해 주세요.`),
  passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해 주세요."),
});

export const signupSchema = z
  .object({
    email: emailField,
    ...passwordFields.shape,
    agreeTerms: z.boolean().refine((v) => v, "서비스 이용약관에 동의해 주세요."),
    agreePrivacy: z.boolean().refine((v) => v, "개인정보 처리방침에 동의해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않아요.",
    // 약관 미동의 등 다른 필드 오류가 있어도 비밀번호 일치 여부는 항상 검사
    when: (payload) => passwordFields.safeParse(payload.value).success,
  });

export type SignupValues = z.infer<typeof signupSchema>;

/* 비밀번호 재설정 ────────────────────────────────────────────── */

export const resetPasswordSchema = z.object({ email: emailField });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/* 비밀번호 강도 (안내용 — 검증 조건은 8자 이상만) ────────────── */

export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_MIN) score++;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score++;
  return Math.max(1, score) as 1 | 2 | 3;
}
