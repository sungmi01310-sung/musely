"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** 확인 조건 입력 등 추가 내용 */
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** 위험한 동작(탈퇴 등) — 확인 버튼을 로즈 톤으로 */
  tone?: "default" | "danger";
  confirmDisabled?: boolean;
  loading?: boolean;
};

/**
 * 확인 모달 — 네이티브 <dialog> (포커스 트랩 · ESC 닫기 기본 제공)
 * 기본 포커스는 "취소"에 두어 실수로 확정하지 않도록 합니다.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  eyebrow,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "취소",
  tone = "default",
  confirmDisabled,
  loading,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={(e) => {
        if (loading) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !loading) onClose();
      }}
      className="m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-line bg-ivory p-0 text-charcoal backdrop:bg-charcoal/40 open:animate-[dialog-in_0.35s_var(--ease-editorial)]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className={cn("eyebrow", tone === "danger" ? "text-rose-ink" : "text-subtle")}>{eyebrow}</p>}
            <h2 id={titleId} className="mt-3 text-[1.45rem] leading-snug font-light tracking-[-0.03em]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="닫기"
            className="-mr-2 -mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-40"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        {description && (
          <div id={descId} className="mt-3 text-[14px] leading-relaxed text-muted">
            {description}
          </div>
        )}
        {children && <div className="mt-6">{children}</div>}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onClose} disabled={loading} className="sm:min-w-28">
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={confirmDisabled}
            loading={loading}
            className={cn(
              "sm:min-w-32",
              tone === "danger" && "bg-rose-ink before:bg-rose-deep hover:text-ivory",
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
