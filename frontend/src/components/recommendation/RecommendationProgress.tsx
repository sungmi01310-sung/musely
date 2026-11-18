"use client";

import { AnimatePresence, motion } from "motion/react";
import { Clock, Hourglass } from "lucide-react";
import { cn } from "@/lib/cn";
import { EXPECTED_DURATION_TEXT, RECOMMENDATION_STEPS } from "@/lib/recommendation/steps";
import type { RecommendationJobStatus } from "@/types/recommendation";
import { Button } from "@/components/ui/Button";
import { ProgressStep } from "./ProgressStep";

/** 레이어가 겹쳐지는 추상 그래픽 — "뷰티 레이어"를 찾는 과정을 은유 */
export function AuraOrb({ className, paused }: { className?: string; paused?: boolean }) {
  const loop = (duration: number) => ({ duration, repeat: paused ? 0 : Infinity, ease: "linear" as const });
  return (
    <div className={cn("relative size-44 sm:size-52", className)} aria-hidden>
      <motion.div
        className="absolute -inset-2 rounded-full bg-[conic-gradient(from_90deg,#dccfe0,#c9a9b6,#a4a998,#e8d6cf,#dccfe0)] blur-xl"
        animate={{ rotate: 360 }}
        transition={loop(14)}
      />
      <motion.div
        className="absolute inset-[12%] rounded-[46%_54%_52%_48%/52%_44%_56%_48%] bg-gradient-to-br from-lavender-deep via-ivory/80 to-rose shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]"
        animate={{ rotate: -360 }}
        transition={loop(22)}
      />
      <motion.div
        className="absolute inset-[24%] rounded-[58%_42%_46%_54%/46%_56%_44%_54%] border border-white/80 bg-gradient-to-tr from-sage/60 via-ivory/60 to-rose-deep/50 backdrop-blur"
        animate={{ rotate: 360, scale: paused ? 1 : [1, 1.05, 1] }}
        transition={{ rotate: loop(18), scale: { duration: 4, repeat: paused ? 0 : Infinity, ease: "easeInOut" } }}
      />
      <div className="absolute inset-[38%] rounded-full bg-ivory/90 shadow-[0_8px_30px_-8px_rgba(37,35,32,0.25)]" />
      <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-charcoal">
        m
      </span>
    </div>
  );
}

type RecommendationProgressProps = {
  /** RECOMMENDATION_STEPS 순서의 단계 상태 */
  statuses: RecommendationJobStatus[];
  /** 서버가 실제 진행률을 줄 때만 */
  progress?: number;
  /** 예상 시간을 넘겼을 때 */
  slow?: boolean;
  /** 취소(폴링 중단 + 이탈) */
  onCancel: () => void;
  /** 서버 Job 취소 지원 여부 — 안내 문구에 사용 */
  supportsCancel: boolean;
};

export function RecommendationProgress({ statuses, progress, slow, onCancel, supportsCancel }: RecommendationProgressProps) {
  const runningIndex = statuses.findIndex((s) => s === "RUNNING");
  const doneCount = statuses.filter((s) => s === "DONE").length;
  const current = runningIndex >= 0 ? RECOMMENDATION_STEPS[runningIndex] : null;
  const hasProgress = typeof progress === "number" && Number.isFinite(progress);

  return (
    <div className="flex w-full max-w-[540px] flex-col items-center text-center">
      <AuraOrb />

      <p className="eyebrow mt-10 text-subtle">Curating · 매칭 중</p>
      <h1 className="mt-5 text-[1.9rem] leading-[1.25] font-light tracking-[-0.04em] text-balance sm:text-[2.5rem]">
        당신을 위한 <span className="font-serif text-[1.1em] italic">조합</span>을 찾고 있어요.
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted text-balance">
        피부 성분부터 향 취향까지, 하나씩 꼼꼼하게 살펴보고 있어요.
      </p>

      <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-subtle">
        <Clock className="size-3.5" strokeWidth={1.5} aria-hidden />
        {EXPECTED_DURATION_TEXT} · 상황에 따라 달라질 수 있어요
      </p>

      <AnimatePresence initial={false}>
        {slow && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lavender px-3.5 py-1.5 text-[12.5px] text-charcoal-soft"
          >
            <Hourglass className="size-3.5 text-sage-deep" strokeWidth={1.5} aria-hidden />
            평소보다 조금 더 걸리고 있어요. 계속 확인하고 있어요.
          </motion.p>
        )}
      </AnimatePresence>

      {/* 실제 진행률은 API가 제공할 때만 표시 */}
      {hasProgress && (
        <div className="mt-8 w-full max-w-sm">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="추천 진행률"
            className="h-1 overflow-hidden rounded-full bg-line"
          >
            <motion.div className="h-full rounded-full bg-charcoal" animate={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-right text-[12px] tabular-nums text-muted">{Math.round(progress)}%</p>
        </div>
      )}

      <ol
        aria-label="추천 진행 단계"
        className="mt-10 w-full divide-y divide-line/80 rounded-[1.75rem] border border-white/80 bg-white/45 px-6 py-2 text-left shadow-[0_30px_80px_-50px_rgba(37,35,32,0.45)] backdrop-blur-xl sm:px-8"
      >
        {RECOMMENDATION_STEPS.map((step, i) => (
          <ProgressStep key={step.key} index={i} label={step.label} en={step.en} status={statuses[i] ?? "PENDING"} />
        ))}
      </ol>
      <p className="sr-only" role="status" aria-live="polite">
        {current ? `${doneCount + 1}단계 ${current.label} 진행 중` : doneCount === statuses.length ? "모든 단계 완료" : "추천 준비 중"}
      </p>

      <Button variant="ghost" size="md" onClick={onCancel} className="mt-8 text-muted hover:text-charcoal">
        취소하고 돌아가기
      </Button>
      <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-subtle">
        {supportsCancel
          ? "취소하면 추천 요청도 함께 중단돼요."
          : "이 화면의 진행 확인을 멈추고 추천 선택 화면으로 돌아가요."}
      </p>
    </div>
  );
}
