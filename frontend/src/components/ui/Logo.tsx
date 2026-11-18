import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** 링크 없이 마크만 렌더링 */
  asText?: boolean;
};

/** musely 워드마크 — 세리프 소문자 + 작은 달빛(초승달) 모노그램 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5", className)}>
      {/* 초승달 — 'muse(뮤즈)'의 밤과 영감을 상징 */}
      <path
        d="M15.5 3.2A9.2 9.2 0 1 0 20.8 16 7.4 7.4 0 0 1 15.5 3.2Z"
        fill="currentColor"
      />
      <circle cx="18.6" cy="5.4" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, asText }: LogoProps) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2 text-charcoal", className)}>
      <LogoMark />
      <span className="font-serif text-[1.65rem] leading-none font-medium tracking-[-0.04em]">
        musely
      </span>
    </span>
  );
  if (asText) return inner;
  return (
    <Link href="/" aria-label="musely 홈" className="inline-flex">
      {inner}
    </Link>
  );
}
