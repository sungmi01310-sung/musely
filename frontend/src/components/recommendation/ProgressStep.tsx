"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RecommendationJobStatus } from "@/types/recommendation";

type ProgressStepProps = {
  index: number;
  label: string;
  en: string;
  status: RecommendationJobStatus;
  /** 작은 목록(실패 화면 등)용 */
  compact?: boolean;
};

const STATUS_TEXT: Record<RecommendationJobStatus, string> = {
  PENDING: "대기",
  RUNNING: "진행 중",
  DONE: "완료",
  FAILED: "실패",
};

/** 상태 아이콘 — 대기(옅은 원) · 진행(회전하는 호 + 숨쉬는 점) · 완료(체크) · 실패(X) */
function StepIcon({ status, compact }: { status: RecommendationJobStatus; compact?: boolean }) {
  const size = compact ? "size-6" : "size-8";
  return (
    <span className={cn("relative flex shrink-0 items-center justify-center", size)} aria-hidden>
      <AnimatePresence mode="popLayout" initial={false}>
        {status === "PENDING" && (
          <motion.span
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full border border-line-strong/70"
          />
        )}
        {status === "RUNNING" && (
          <motion.span key="running" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <span className="absolute inset-0 rounded-full border border-rose/70" />
            <motion.span
              className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-charcoal"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-[30%] rounded-full bg-rose-deep"
              animate={{ scale: [0.75, 1.1, 0.75], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.span>
        )}
        {status === "DONE" && (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-charcoal text-ivory"
          >
            <Check className={compact ? "size-3" : "size-3.5"} strokeWidth={2.25} />
          </motion.span>
        )}
        {status === "FAILED" && (
          <motion.span
            key="failed"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-rose-ink text-ivory"
          >
            <X className={compact ? "size-3" : "size-3.5"} strokeWidth={2.25} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** 추천 진행 단계 한 줄 */
export function ProgressStep({ index, label, en, status, compact }: ProgressStepProps) {
  return (
    <li
      className={cn("flex items-center gap-4", compact ? "py-2" : "py-3.5")}
      aria-current={status === "RUNNING" ? "step" : undefined}
    >
      <StepIcon status={status} compact={compact} />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium tracking-[-0.02em] transition-colors duration-500",
            compact ? "text-[14px]" : "text-[15.5px]",
            status === "PENDING" && "text-subtle",
            status === "RUNNING" && "text-charcoal",
            status === "DONE" && "text-charcoal-soft",
            status === "FAILED" && "text-rose-ink",
          )}
        >
          <span className="sr-only">{index + 1}단계, </span>
          {label}
        </p>
        {!compact && (
          <p className={cn("mt-0.5 font-serif text-[13px] italic", status === "PENDING" ? "text-subtle/70" : "text-muted")}>
            {en}
          </p>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 text-[12px]",
          status === "RUNNING" ? "text-rose-ink" : status === "FAILED" ? "text-rose-ink" : "text-subtle",
        )}
      >
        {STATUS_TEXT[status]}
      </span>
    </li>
  );
}
