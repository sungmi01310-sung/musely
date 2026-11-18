import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export const metadata: Metadata = {
  title: "로그인",
  description: "musely에 로그인하고 저장된 피부 · 향 프로필과 추천 히스토리를 확인하세요.",
};

export default function LoginPage() {
  return (
    <>
      <p className="eyebrow text-subtle">Welcome back</p>
      <h1 className="mt-4 text-[2rem] leading-tight font-light tracking-[-0.04em] sm:text-[2.4rem]">
        다시 만나서 <span className="font-serif text-[1.1em] italic">반가워요</span>
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        로그인하고 저장된 피부 · 향 프로필과 추천 히스토리를 이어서 확인하세요.
      </p>

      <LoginForm className="mt-10" />

      <div className="my-8 flex items-center gap-4 text-[12px] text-subtle" role="separator">
        <span className="h-px flex-1 bg-line" />
        또는
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialLoginButton provider="kakao" />
        <SocialLoginButton provider="google" />
      </div>

      <p className="mt-10 text-center text-[14px] text-muted">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="link-underline ml-1 font-medium text-charcoal">
          회원가입
        </Link>
      </p>
    </>
  );
}
