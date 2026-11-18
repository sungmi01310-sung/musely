"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CloudOff, FileQuestion, SearchX, ServerCrash, TimerOff, UserRound, type LucideIcon } from "lucide-react";
import type { RecommendationErrorCode } from "@/types/recommendation";
import { ERROR_COPY } from "@/lib/recommendation/errors";
import { Button } from "@/components/ui/Button";

export type StateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
};

const ICONS: Record<RecommendationErrorCode, LucideIcon> = {
  NETWORK_ERROR: CloudOff,
  SERVER_ERROR: ServerCrash,
  TIMEOUT: TimerOff,
  INVALID_JOB: SearchX,
  NOT_FOUND: FileQuestion,
  PROFILE_REQUIRED: UserRound,
  UNKNOWN: ServerCrash,
};

const EYEBROW: Record<RecommendationErrorCode, string> = {
  NETWORK_ERROR: "Connection lost",
  SERVER_ERROR: "Something went wrong",
  TIMEOUT: "Taking too long",
  INVALID_JOB: "Request not found",
  NOT_FOUND: "Result not found",
  PROFILE_REQUIRED: "Profile needed",
  UNKNOWN: "Something went wrong",
};

export function ActionButton({ action, variant }: { action: StateAction; variant: "primary" | "secondary" }) {
  const common = { variant, size: "lg" as const, className: "w-full sm:w-auto sm:min-w-44" };
  return action.href ? (
    <Button {...common} href={action.href} arrow={variant === "primary"}>
      {action.label}
    </Button>
  ) : (
    <Button {...common} onClick={action.onClick} loading={action.loading}>
      {action.label}
    </Button>
  );
}

type RecommendationErrorStateProps = {
  code: RecommendationErrorCode;
  primary: StateAction;
  secondary?: StateAction;
  /** 실패한 단계 목록 등 보조 정보 */
  children?: ReactNode;
  /** 개발용 상세 메시지 (Mock 모드에서만 표시 권장) */
  devDetail?: string;
};

/** 추천 실패 화면 — 네트워크 · 서버 · 타임아웃 · 잘못된 Job · 없는 결과 */
export function RecommendationErrorState({ code, primary, secondary, children, devDetail }: RecommendationErrorStateProps) {
  const copy = ERROR_COPY[code];
  const Icon = ICONS[code];
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="alert"
      aria-labelledby="rec-error-title"
      className="flex w-full max-w-[540px] flex-col items-center text-center"
    >
      <span className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-rose/50 blur-xl" aria-hidden />
        <span className="relative flex size-16 items-center justify-center rounded-full border border-white/80 bg-ivory text-rose-ink shadow-[0_12px_30px_-14px_rgba(148,107,121,0.6)]">
          <Icon className="size-6" strokeWidth={1.4} aria-hidden />
        </span>
      </span>
      <p className="eyebrow mt-8 text-subtle">{EYEBROW[code]}</p>
      <h1 id="rec-error-title" className="mt-4 text-[1.75rem] leading-[1.3] font-light tracking-[-0.04em] text-balance sm:text-[2.2rem]">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted text-balance">{copy.description}</p>

      {children && <div className="mt-8 w-full">{children}</div>}

      <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <ActionButton action={primary} variant="primary" />
        {secondary && <ActionButton action={secondary} variant="secondary" />}
      </div>

      {devDetail && (
        <p className="mt-6 rounded-full bg-lavender/70 px-3 py-1 font-mono text-[11px] text-muted">
          {code} · {devDetail}
        </p>
      )}
    </motion.section>
  );
}
