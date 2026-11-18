"use client";

import type { Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SelectOption } from "./SingleSelectCard";

type MultiSelectChipProps = {
  name: string;
  options: readonly SelectOption[];
  /** 선택된 값 전체 — 옵션에 없는 값(예: 직접 입력 성분)도 보존됩니다 */
  value: string[];
  onChange: (next: string[]) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  /** chip: 알약형 / card: 설명과 컬러 스와치가 있는 카드형 */
  variant?: "chip" | "card";
  invalid?: boolean;
  describedBy?: string;
};

/** 다중 선택 — 네이티브 checkbox 기반 (Tab 이동, Space 토글) */
export function MultiSelectChip({
  name,
  options,
  value,
  onChange,
  onBlur,
  inputRef,
  variant = "chip",
  invalid,
  describedBy,
}: MultiSelectChipProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    onChange(checked ? [...value, optionValue] : value.filter((v) => v !== optionValue));
  };

  return (
    <div
      className={cn(
        variant === "chip" ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3",
      )}
    >
      {options.map((option, i) => {
        const checked = value.includes(option.value);
        const input = (
          <input
            ref={i === 0 ? inputRef : undefined}
            type="checkbox"
            name={name}
            value={option.value}
            checked={checked}
            onChange={(e) => toggle(option.value, e.target.checked)}
            onBlur={onBlur}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className="peer sr-only"
          />
        );
        const focusRing =
          "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal";

        if (variant === "chip") {
          return (
            <label key={option.value} className="cursor-pointer">
              {input}
              <span
                className={cn(
                  "inline-flex h-11 items-center rounded-full border pl-4 pr-4 text-[14px] transition-[background-color,border-color,color,padding] duration-300 ease-editorial",
                  focusRing,
                  checked
                    ? "border-charcoal bg-charcoal pl-3 text-ivory"
                    : "border-line-strong bg-white/60 text-charcoal-soft hover:border-charcoal/45 hover:bg-white hover:text-charcoal",
                )}
              >
                {/* 체크 아이콘이 폭을 열며 부드럽게 등장 */}
                <span
                  aria-hidden
                  className={cn(
                    "grid transition-[grid-template-columns,opacity] duration-300 ease-editorial",
                    checked ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden">
                    <Check className="mr-1.5 size-3.5" strokeWidth={2.25} />
                  </span>
                </span>
                {option.label}
              </span>
            </label>
          );
        }

        return (
          <label key={option.value} className="group cursor-pointer">
            {input}
            <span
              className={cn(
                "relative flex h-full min-h-[118px] flex-col justify-between rounded-2xl border p-4 transition-[background-color,border-color,color,transform] duration-300 ease-editorial",
                focusRing,
                checked
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line-strong bg-white/60 hover:-translate-y-0.5 hover:border-charcoal/40 hover:bg-white",
              )}
            >
              <span className="flex items-start justify-between">
                <span
                  aria-hidden
                  className={cn(
                    "size-7 rounded-full ring-1 transition-transform duration-500 ease-editorial",
                    checked ? "scale-110 ring-ivory/40" : "ring-black/5 group-hover:scale-110",
                  )}
                  style={{ backgroundColor: option.swatch }}
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border transition-all duration-300",
                    checked ? "border-ivory bg-ivory text-charcoal" : "border-charcoal/20 text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
              </span>
              <span className="mt-4 block">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[16px] font-medium tracking-[-0.02em]">{option.label}</span>
                  {option.en && (
                    <span className={cn("font-serif text-[14px] italic", checked ? "text-ivory/60" : "text-subtle")}>
                      {option.en}
                    </span>
                  )}
                </span>
                {option.description && (
                  <span className={cn("mt-1 block text-[12.5px] leading-snug", checked ? "text-ivory/75" : "text-muted")}>
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
