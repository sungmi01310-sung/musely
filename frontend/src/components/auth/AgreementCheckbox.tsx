"use client";

import { useId, type ComponentProps, type Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type AgreementCheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
  /** [필수] / [선택] 표기 (undefined면 표기 없음) */
  necessity?: "required" | "optional";
  /** 약관 전문 링크 (새 탭) */
  href?: string;
  /** '전체 동의' 행 강조 */
  emphasis?: boolean;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

/** 약관 동의 체크박스 — 44px 터치 영역, 키보드 포커스 표시 */
export function AgreementCheckbox({
  label,
  necessity,
  href,
  emphasis,
  invalid,
  id,
  className,
  ref,
  ...inputProps
}: AgreementCheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <label htmlFor={inputId} className="flex min-h-11 flex-1 cursor-pointer items-center gap-3">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={invalid || undefined}
          className="peer sr-only"
          {...inputProps}
        />
        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md border bg-white text-transparent transition-colors duration-200",
            "peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-ivory",
            "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal",
            invalid ? "border-rose-ink" : "border-line-strong",
          )}
        >
          <Check className="size-3.5" strokeWidth={2.25} />
        </span>
        <span className={cn("text-[14px]", emphasis ? "font-semibold text-charcoal" : "text-charcoal-soft")}>
          {necessity && (
            <span className={cn("mr-1", necessity === "required" ? "text-rose-ink" : "text-subtle")}>
              [{necessity === "required" ? "필수" : "선택"}]
            </span>
          )}
          {label}
        </span>
      </label>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center px-1 text-[13px] text-muted underline underline-offset-4 hover:text-charcoal"
        >
          보기<span className="sr-only"> ({label}, 새 탭에서 열림)</span>
        </a>
      )}
    </div>
  );
}
