"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type NotificationToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** 토글 스위치 한 줄 — role="switch" (Space/Enter로 전환) */
export function NotificationToggle({ label, description, checked, onChange, disabled }: NotificationToggleProps) {
  const labelId = useId();
  const descId = useId();
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <div className="min-w-0">
        <p id={labelId} className="text-[15px] font-medium tracking-[-0.02em]">
          {label}
        </p>
        <p id={descId} className="mt-1 text-[13px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full p-1 transition-colors duration-500 ease-editorial disabled:opacity-40",
          checked ? "bg-charcoal" : "bg-line-strong",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-6 rounded-full bg-ivory shadow-[0_2px_6px_rgba(37,35,32,0.25)] transition-transform duration-500 ease-editorial",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
