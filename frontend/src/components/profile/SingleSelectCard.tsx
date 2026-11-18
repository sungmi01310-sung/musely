"use client";

import type { Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  en?: string;
  description?: string;
  swatch?: string;
};

type SingleSelectCardProps<V extends string> = {
  name: string;
  options: readonly SelectOption<V>[];
  value: V | "" | null;
  onChange: (value: V) => void;
  /** 선택된 카드를 다시 누르면 해제 (선택 항목일 때) */
  onClear?: () => void;
  onBlur?: () => void;
  /** 검증 실패 시 포커스를 받을 첫 번째 radio */
  inputRef?: Ref<HTMLInputElement>;
  columns?: 2 | 4;
  invalid?: boolean;
  describedBy?: string;
};

/**
 * 단일 선택 카드 — 네이티브 radio 기반
 * (Tab으로 그룹 진입, ←/→/↑/↓로 이동, Space로 선택)
 */
export function SingleSelectCard<V extends string>({
  name,
  options,
  value,
  onChange,
  onClear,
  onBlur,
  inputRef,
  columns = 2,
  invalid,
  describedBy,
}: SingleSelectCardProps<V>) {
  return (
    <div className={cn("grid grid-cols-2 gap-2.5 sm:gap-3", columns === 4 && "lg:grid-cols-4")}>
      {options.map((option, i) => {
        const checked = value === option.value;
        return (
          <label key={option.value} className="group relative block cursor-pointer">
            <input
              ref={i === 0 ? inputRef : undefined}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              onClick={() => {
                if (checked && onClear) onClear();
              }}
              onBlur={onBlur}
              aria-describedby={describedBy}
              className="peer sr-only"
            />
            <span
              className={cn(
                "relative flex h-full min-h-[104px] flex-col justify-between rounded-2xl border p-4 transition-[background-color,border-color,color,transform] duration-300 ease-editorial sm:min-h-[112px] sm:p-5",
                "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal",
                checked
                  ? "border-charcoal bg-charcoal text-ivory"
                  : cn(
                      "bg-white/60 hover:-translate-y-0.5 hover:border-charcoal/40 hover:bg-white",
                      invalid ? "border-rose-ink/60" : "border-line-strong",
                    ),
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-2">
                  {option.swatch && (
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full ring-1 ring-black/5"
                      style={{ backgroundColor: option.swatch }}
                    />
                  )}
                  {option.en && (
                    <span
                      className={cn(
                        "font-serif text-[15px] italic transition-colors",
                        checked ? "text-ivory/70" : "text-subtle",
                      )}
                    >
                      {option.en}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border transition-all duration-300",
                    checked ? "scale-100 border-ivory bg-ivory text-charcoal" : "scale-90 border-charcoal/20 text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
              </span>
              <span className="mt-4 block">
                <span className="block text-[17px] font-medium tracking-[-0.02em]">{option.label}</span>
                {option.description && (
                  <span
                    className={cn(
                      "mt-1 block text-[12.5px] leading-snug transition-colors",
                      checked ? "text-ivory/75" : "text-muted",
                    )}
                  >
                    {option.description}
                  </span>
                )}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
