"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FlaskConical, Play, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { isMockRecommendation } from "@/lib/recommendation/adapter";
import {
  MOCK_SCENARIOS,
  readMockScenario,
  subscribeMockScenario,
  writeMockScenario,
} from "@/lib/recommendation/mock/scenarios";

/**
 * 개발용 Mock 시나리오 전환 패널 (Mock 어댑터일 때만 렌더링)
 * 실제 API 어댑터로 바꾸면 자동으로 사라집니다.
 */
export function MockScenarioSwitcher() {
  const scenario = useSyncExternalStore(subscribeMockScenario, readMockScenario, () => null);
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

  if (!isMockRecommendation || !scenario) return null;
  const current = MOCK_SCENARIOS.find((s) => s.value === scenario)!;

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
            className="mb-3 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-line bg-ivory/95 p-4 shadow-[0_24px_60px_-24px_rgba(37,35,32,0.45)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium">Mock 추천 시나리오</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-subtle">
                  개발용 패널 · 실제 AI 서버가 아닌 시뮬레이션이에요. 새 추천 요청부터 적용돼요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="-m-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-charcoal/5"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <fieldset className="mt-3">
              <legend className="sr-only">시나리오 선택</legend>
              <div className="flex flex-col gap-1">
                {MOCK_SCENARIOS.map((s) => (
                  <label
                    key={s.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2 transition-colors has-focus-visible:outline has-focus-visible:outline-charcoal",
                      s.value === scenario ? "bg-lavender" : "hover:bg-charcoal/[0.04]",
                    )}
                  >
                    <input
                      type="radio"
                      name="mock-scenario"
                      value={s.value}
                      checked={s.value === scenario}
                      onChange={() => writeMockScenario(s.value)}
                      className="mt-1 accent-charcoal"
                    />
                    <span>
                      <span className="block text-[13px] text-charcoal">{s.label}</span>
                      <span className="block text-[11.5px] text-subtle">{s.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Link
              href={routes.recommendationStart}
              onClick={() => setOpen(false)}
              className="mt-3 flex h-10 items-center justify-center gap-1.5 rounded-full bg-charcoal text-[13px] text-ivory transition-opacity hover:opacity-90"
            >
              <Play className="size-3.5" strokeWidth={1.75} aria-hidden />이 시나리오로 새 추천 실행
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-9 items-center gap-2 rounded-full border sm:h-10 border-charcoal/10 bg-ivory/90 pl-3 pr-4 text-[12px] text-charcoal-soft shadow-[0_10px_30px_-12px_rgba(37,35,32,0.35)] backdrop-blur-xl transition-colors hover:bg-white"
      >
        <FlaskConical className="size-3.5 text-sage-deep" strokeWidth={1.75} aria-hidden />
        <span className="font-medium">Mock</span>
        <span className="hidden text-subtle sm:inline">· {current.label}</span>
      </button>
    </div>
  );
}
