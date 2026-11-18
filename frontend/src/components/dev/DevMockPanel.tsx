"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FlaskConical, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type DevMockOption = { value: string; label: string; description: string };

type DevMockPanelProps = {
  title: string;
  note: string;
  options: readonly DevMockOption[];
  /** null이면 렌더링하지 않음 (하이드레이션 전) */
  value: string | null;
  onChange: (value: string) => void;
  /** 패널 하단 추가 액션 */
  actions?: (close: () => void) => ReactNode;
};

/**
 * 개발용 Mock 상태 전환 패널 (우측 하단 플로팅)
 * 실제 사용자 화면이 아니라 화면 상태 확인용 — 실제 API 연결 시 렌더링하지 않도록 상위에서 제어합니다.
 */
export function DevMockPanel({ title, note, options, value, onChange, actions }: DevMockPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!value) return null;
  const current = options.find((o) => o.value === value) ?? options[0];
  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="fixed bottom-4 right-4 z-[55] flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 max-h-[calc(100dvh-6rem)] w-[min(320px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-ivory/95 p-4 shadow-[0_24px_60px_-24px_rgba(37,35,32,0.45)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium">{title}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-subtle">{note}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="-m-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-charcoal/5"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <fieldset className="mt-3">
              <legend className="sr-only">{title}</legend>
              <div className="flex flex-col gap-1">
                {options.map((o) => (
                  <label
                    key={o.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2 transition-colors has-focus-visible:outline has-focus-visible:outline-charcoal",
                      o.value === value ? "bg-lavender" : "hover:bg-charcoal/[0.04]",
                    )}
                  >
                    <input
                      type="radio"
                      name={panelId}
                      value={o.value}
                      checked={o.value === value}
                      onChange={() => onChange(o.value)}
                      className="mt-1 accent-charcoal"
                    />
                    <span>
                      <span className="block text-[13px] text-charcoal">{o.label}</span>
                      <span className="block text-[11.5px] text-subtle">{o.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {actions && <div className="mt-3 flex flex-col gap-2">{actions(close)}</div>}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-charcoal/10 bg-ivory/90 pl-3 pr-4 text-[12px] text-charcoal-soft shadow-[0_10px_30px_-12px_rgba(37,35,32,0.35)] backdrop-blur-xl transition-colors hover:bg-white sm:h-10"
      >
        <FlaskConical className="size-3.5 text-sage-deep" strokeWidth={1.75} aria-hidden />
        <span className="font-medium">Mock</span>
        <span className="hidden text-subtle sm:inline">· {current.label}</span>
      </button>
    </div>
  );
}

/** 패널 안 액션 버튼 스타일 */
export function DevPanelAction({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center gap-1.5 rounded-full text-[13px] transition-opacity hover:opacity-90",
        primary ? "bg-charcoal text-ivory" : "border border-charcoal/15 text-charcoal",
      )}
    >
      {children}
    </button>
  );
}
