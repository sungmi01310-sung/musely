import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Provider = "kakao" | "google";

const providers: Record<Provider, { label: string; logo: ReactNode }> = {
  kakao: {
    label: "카카오",
    logo: (
      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
        <path
          fill="#191600"
          d="M12 3.6c-5.08 0-9.2 3.2-9.2 7.15 0 2.55 1.7 4.78 4.28 6.05l-.9 3.3a.35.35 0 0 0 .53.38l3.92-2.6c.45.05.9.08 1.37.08 5.08 0 9.2-3.2 9.2-7.21S17.08 3.6 12 3.6Z"
        />
      </svg>
    ),
  },
  google: {
    label: "Google",
    logo: (
      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
        <path fill="#4285F4" d="M22.6 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.94a5.08 5.08 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.3-4.74 3.3-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
      </svg>
    ),
  },
};

type SocialLoginButtonProps = {
  provider: Provider;
  /** OAuth 연동 전까지 false — 클릭할 수 없고 '준비 중'으로 표시 */
  available?: boolean;
  className?: string;
};

/**
 * 소셜 로그인 버튼.
 * OAuth가 아직 구현되지 않았으므로 기본값은 비활성(준비 중)입니다.
 * 연동 시 available을 켜고 /auth/{provider} 리다이렉트를 연결하세요.
 */
export function SocialLoginButton({ provider, available = false, className }: SocialLoginButtonProps) {
  const { label, logo } = providers[provider];
  return (
    <button
      type="button"
      disabled={!available}
      aria-label={available ? `${label}로 계속하기` : `${label} 로그인 (준비 중)`}
      title={available ? undefined : "소셜 로그인은 준비 중이에요"}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-line-strong bg-white/50 text-sm font-medium text-charcoal transition-colors duration-300",
        "enabled:hover:border-charcoal enabled:hover:bg-white",
        "disabled:cursor-not-allowed disabled:text-charcoal/50",
        className,
      )}
    >
      <span className={cn(!available && "opacity-50")}>{logo}</span>
      {label}
      {!available && (
        <span className="rounded-full bg-charcoal/[0.06] px-2 py-0.5 text-[11px] font-normal text-muted">
          준비 중
        </span>
      )}
    </button>
  );
}
