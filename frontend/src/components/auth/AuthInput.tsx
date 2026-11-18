"use client";

import { useId, type ComponentProps, type ReactNode, type Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { FormError } from "./FormError";

export type AuthInputProps = Omit<ComponentProps<"input">, "size"> & {
  label: string;
  /** 라벨 오른쪽에 놓을 보조 액션 (예: 비밀번호 찾기) */
  labelAction?: ReactNode;
  /** 오류가 없을 때 필드 하단에 보이는 안내 문구 */
  hint?: ReactNode;
  error?: string;
  /** 검증을 통과했을 때 체크 아이콘 표시 */
  valid?: boolean;
  /** 입력창 오른쪽 끝에 들어갈 요소 (예: 비밀번호 표시 버튼) */
  trailing?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function AuthInput({
  label,
  labelAction,
  hint,
  error,
  valid,
  trailing,
  id,
  className,
  ref,
  ...inputProps
}: AuthInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="mb-2 flex min-h-5 items-end justify-between gap-3">
        <label htmlFor={inputId} className="text-[13px] font-medium text-charcoal-soft">
          {label}
        </label>
        {labelAction}
      </div>

      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white/60 transition-[border-color,background-color,box-shadow] duration-300 ease-editorial",
          "focus-within:bg-white",
          error
            ? "border-rose-ink/70 focus-within:border-rose-ink focus-within:ring-4 focus-within:ring-rose/30"
            : "border-line-strong hover:border-charcoal/35 focus-within:border-charcoal focus-within:ring-4 focus-within:ring-lavender",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          // 16px 이상 — iOS 사파리 입력 시 자동 확대 방지
          className="h-14 w-full min-w-0 rounded-xl bg-transparent px-4 text-base text-charcoal placeholder:text-subtle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          {...inputProps}
        />
        {valid && !error && (
          <Check className="mr-3 size-4 shrink-0 text-sage-deep" strokeWidth={2} aria-hidden />
        )}
        {trailing}
      </div>

      {hint && !error && (
        <div id={hintId} className="pt-2 text-[12px] leading-relaxed text-muted">
          {hint}
        </div>
      )}
      <FormError id={errorId} message={error} />
    </div>
  );
}
