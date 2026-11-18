"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FormError } from "@/components/auth/FormError";

type ProfileSectionProps = {
  index: string;
  title: string;
  en?: string;
  description?: ReactNode;
  /** "필수" | "선택" 등 */
  badge?: "required" | "optional";
  /** 제목 오른쪽 보조 정보 (예: "2개 선택") */
  meta?: ReactNode;
  error?: string;
  className?: string;
  children: (ids: { describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

/**
 * 프로필 입력 섹션 — <fieldset>/<legend>로 묶어 스크린리더가
 * "피부 타입, 필수, 그룹"처럼 읽을 수 있게 합니다.
 */
export function ProfileSection({
  index,
  title,
  en,
  description,
  badge,
  meta,
  error,
  className,
  children,
}: ProfileSectionProps) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;
  const errorId = `${id}-error`;
  const describedBy = [descId, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset aria-describedby={describedBy} className={cn("min-w-0 scroll-mt-28", className)}>
      <legend className="float-left w-full">
        <span className="flex items-baseline justify-between gap-4">
          <span className="flex items-baseline gap-3">
            <span className="font-serif text-[15px] italic text-subtle" aria-hidden>
              {index}
            </span>
            <span className="text-[1.2rem] font-medium tracking-[-0.025em] sm:text-[1.3rem]">{title}</span>
            {en && (
              <span className="hidden font-serif text-[15px] italic text-subtle sm:inline" aria-hidden>
                {en}
              </span>
            )}
            {badge && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                  badge === "required" ? "bg-rose/40 text-rose-ink" : "bg-charcoal/[0.06] text-muted",
                )}
              >
                {badge === "required" ? "필수" : "선택"}
              </span>
            )}
          </span>
          {meta && <span className="shrink-0 text-[12px] text-subtle">{meta}</span>}
        </span>
      </legend>

      <div className="clear-both pt-2">
        {description && (
          <p id={descId} className="pl-8 text-[14px] leading-relaxed text-muted">
            {description}
          </p>
        )}
        <div className="mt-5">{children({ describedBy, invalid: !!error })}</div>
        <FormError id={errorId} message={error} />
      </div>
    </fieldset>
  );
}
