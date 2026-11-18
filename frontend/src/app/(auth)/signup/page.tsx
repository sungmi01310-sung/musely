import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export const metadata: Metadata = {
  title: "회원가입",
  description: "musely 계정을 만들고 나만의 피부 · 향 프로필로 AI 맞춤 추천을 시작하세요.",
};

const journey = ["계정 만들기", "피부 프로필", "향 프로필"];

export default function SignupPage() {
  return (
    <>
      {/* 가입 이후 흐름 안내 */}
      <ol aria-label="가입 진행 단계" className="mb-8 grid grid-cols-3 gap-2">
        {journey.map((label, i) => (
          <li key={label} aria-current={i === 0 ? "step" : undefined}>
            <span className={`block h-0.5 rounded-full ${i === 0 ? "bg-charcoal" : "bg-line-strong"}`} />
            <span className={`mt-2 block text-[11px] ${i === 0 ? "font-medium text-charcoal" : "text-subtle"}`}>
              <span className="font-serif italic">0{i + 1}</span> {label}
            </span>
          </li>
        ))}
      </ol>

      <p className="eyebrow text-subtle">Create account</p>
      <h1 className="mt-4 text-[2rem] leading-tight font-light tracking-[-0.04em] sm:text-[2.4rem]">
        나만의 <span className="font-serif text-[1.1em] italic">beauty</span> 프로필,
        <br />
        지금 시작해요
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        가입을 마치면 바로 피부 프로필 작성으로 이어져요. 3분이면 충분합니다.
      </p>

      <SignupForm className="mt-10" />

      <div className="my-8 flex items-center gap-4 text-[12px] text-subtle" role="separator">
        <span className="h-px flex-1 bg-line" />
        간편 가입
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialLoginButton provider="kakao" />
        <SocialLoginButton provider="google" />
      </div>

      <p className="mt-10 text-center text-[14px] text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="link-underline ml-1 font-medium text-charcoal">
          로그인
        </Link>
      </p>
    </>
  );
}
