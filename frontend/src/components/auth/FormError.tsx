"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/cn";

/* ──────────────────────────────────────────────────────────────
   FormError — 입력 필드 하단 오류 메시지 (부드럽게 펼쳐짐)
   ────────────────────────────────────────────────────────────── */

type FormErrorProps = {
  id?: string;
  message?: string;
  className?: string;
};

export function FormError({ id, message, className }: FormErrorProps) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn("overflow-hidden", className)}
        >
          <span className="flex items-start gap-1.5 pt-2 text-[13px] leading-snug text-rose-ink">
            <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {message}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────────
   FormAlert — 폼 전체에 대한 안내/오류 (서버 응답 등)
   ────────────────────────────────────────────────────────────── */

type FormAlertProps = {
  variant?: "info" | "error";
  title?: string;
  children?: ReactNode;
  show: boolean;
  className?: string;
};

export function FormAlert({ variant = "error", title, children, show, className }: FormAlertProps) {
  const Icon = variant === "info" ? Info : CircleAlert;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="alert"
          role={variant === "error" ? "alert" : "status"}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn("overflow-hidden", className)}
        >
          <div
            className={cn(
              "flex gap-3 rounded-xl border px-4 py-3.5 text-[13px] leading-relaxed",
              variant === "info"
                ? "border-lavender-deep bg-lavender/70 text-charcoal-soft"
                : "border-rose bg-rose/25 text-charcoal-soft",
            )}
          >
            <Icon
              className={cn("mt-0.5 size-4 shrink-0", variant === "info" ? "text-sage-deep" : "text-rose-ink")}
              strokeWidth={1.75}
              aria-hidden
            />
            <div>
              {title && <p className="font-medium text-charcoal">{title}</p>}
              {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
