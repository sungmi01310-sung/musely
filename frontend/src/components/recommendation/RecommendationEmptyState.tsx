"use client";

import { motion } from "motion/react";
import { labelOf } from "@/lib/profile/options";
import { ActionButton, type StateAction } from "./RecommendationErrorState";

type RecommendationEmptyStateProps = {
  /** 후보를 걸러낸 조건 (기피 성분 코드 등) */
  blockedBy?: string[];
  primary: StateAction;
  secondary: StateAction;
};

/**
 * 조건에 맞는 제품이 없을 때.
 * 기피 성분 조건은 완화하지 않으며, 조건을 바꿀지는 사용자가 결정합니다.
 */
export function RecommendationEmptyState({ blockedBy = [], primary, secondary }: RecommendationEmptyStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="rec-empty-title"
      className="relative overflow-hidden rounded-[2rem] bg-lavender/70 px-6 py-16 text-center sm:px-12 sm:py-20"
    >
      {/* 비어 있는 액자 — 빈 상태를 차분하게 표현 */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-rose/50 blur-3xl" />
      <div aria-hidden className="mx-auto flex h-28 w-24 items-end justify-center rounded-t-full border border-charcoal/15 bg-ivory/60">
        <span className="mb-5 font-serif text-3xl italic text-subtle">∅</span>
      </div>

      <p className="eyebrow relative mt-8 text-subtle">No match, yet</p>
      <h2 id="rec-empty-title" className="relative mt-4 text-[1.6rem] leading-[1.3] font-light tracking-[-0.04em] text-balance sm:text-[2rem]">
        조건에 맞는 제품을 찾지 못했어요.
      </h2>
      <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted text-balance">
        설정한 기피 성분과 피부 조건을 모두 충족하는 제품이 현재 검색 범위에 없어요.
      </p>

      {blockedBy.length > 0 && (
        <div className="relative mx-auto mt-8 max-w-md">
          <p className="text-[12px] text-subtle">적용된 기피 성분 — 이 조건은 그대로 지켰어요</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
            {blockedBy.map((v) => (
              <li key={v} className="rounded-full border border-charcoal/15 bg-ivory/80 px-3 py-1 text-[13px] text-charcoal-soft">
                {labelOf(v)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ActionButton action={primary} variant="primary" />
        <ActionButton action={secondary} variant="secondary" />
      </div>
    </motion.section>
  );
}
