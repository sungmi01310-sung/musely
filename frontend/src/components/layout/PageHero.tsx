import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  /** 큰 영문 세리프 타이틀 */
  en: string;
  /** 한글 타이틀 (h1) */
  title: string;
  description: ReactNode;
  /** 오른쪽(데스크톱) 보조 영역 */
  aside?: ReactNode;
  className?: string;
};

/** 히스토리 · 설정 등 내부 페이지 공통 헤드라인 */
export function PageHero({ en, title, description, aside, className }: PageHeroProps) {
  return (
    <div className={cn("relative grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-8">
        <p aria-hidden className="display text-[3.1rem] italic text-charcoal sm:text-[5rem] lg:text-[6rem]">
          {en}
        </p>
        <h1 className="mt-5 text-[1.45rem] font-light tracking-[-0.035em] sm:text-[1.8rem]">
          <span className="sr-only">{en} — </span>
          {title}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{description}</p>
      </div>
      {aside && <div className="lg:col-span-4 lg:justify-self-end">{aside}</div>}
    </div>
  );
}
