"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { requestPasswordReset, isAuthApiNotConnected } from "@/lib/api/auth";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation/auth";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "./AuthInput";
import { FormAlert } from "./FormError";

type ForgotPasswordDialogProps = {
  open: boolean;
  defaultEmail?: string;
  onClose: () => void;
};

/** 비밀번호 재설정 메일 요청 — 네이티브 <dialog>(포커스 트랩, ESC 닫기 기본 제공) */
export function ForgotPasswordDialog({ open, defaultEmail = "", onClose }: ForgotPasswordDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      reset({ email: defaultEmail });
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, defaultEmail, reset]);

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await requestPasswordReset(values);
    } catch (error) {
      setError("root.server", {
        type: isAuthApiNotConnected(error) ? "not-connected" : "unknown",
        message: isAuthApiNotConnected(error)
          ? "재설정 메일 발송은 인증 서버 연결 후 제공될 예정이에요. 지금은 메일이 발송되지 않습니다."
          : "일시적인 문제로 요청하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  const serverError = errors.root?.server;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="reset-title"
      aria-describedby="reset-desc"
      onClose={onClose}
      onClick={(e) => {
        // 바깥(백드롭) 클릭 시 닫기
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto h-fit w-[calc(100%-2.5rem)] max-w-md rounded-2xl border border-line bg-ivory p-0 text-charcoal backdrop:bg-charcoal/40 open:animate-[dialog-in_0.35s_var(--ease-editorial)]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-subtle">Reset password</p>
            <h2 id="reset-title" className="mt-3 text-[1.5rem] font-light tracking-[-0.03em]">
              비밀번호 재설정
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 -mt-2 inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-charcoal/5 hover:text-charcoal"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <p id="reset-desc" className="mt-2 text-[14px] leading-relaxed text-muted">
          가입하신 이메일을 입력하면 비밀번호를 다시 설정할 수 있는 링크를 보내드려요.
        </p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
          <FormAlert
            show={!!serverError}
            variant={serverError?.type === "not-connected" ? "info" : "error"}
            title={serverError?.type === "not-connected" ? "메일 발송 준비 중이에요" : undefined}
          >
            {serverError?.message}
          </FormAlert>
          <AuthInput
            label="이메일"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="hello@musely.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
            {isSubmitting ? "요청 중…" : "재설정 링크 받기"}
          </Button>
        </form>
      </div>
    </dialog>
  );
}
