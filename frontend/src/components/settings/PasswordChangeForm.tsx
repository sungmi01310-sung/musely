"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/api/account";
import { isAuthApiNotConnected } from "@/lib/api/auth";
import { changePasswordSchema, PASSWORD_MIN, type ChangePasswordValues } from "@/lib/validation/auth";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { FormAlert } from "@/components/auth/FormError";

type Outcome = "changed" | "not-connected" | "error" | null;

/**
 * 비밀번호 변경 (React Hook Form + Zod)
 * API 연결 전에는 "변경되지 않았음"을 안내 — 성공 메시지는 실제 성공 응답에서만 표시
 */
export function PasswordChangeForm() {
  const [outcome, setOutcome] = useState<Outcome>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: { currentPassword: "", newPassword: "", newPasswordConfirm: "" },
  });
  const [newPassword, confirm] = useWatch({ control, name: ["newPassword", "newPasswordConfirm"] });

  const onSubmit = async (values: ChangePasswordValues) => {
    setOutcome(null);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      reset();
      setOutcome("changed");
    } catch (e) {
      setOutcome(isAuthApiNotConnected(e) ? "not-connected" : "error");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-5">
      <PasswordInput
        label="현재 비밀번호"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <PasswordInput
        label="새 비밀번호"
        autoComplete="new-password"
        hint={`${PASSWORD_MIN}자 이상 · 영문, 숫자, 특수문자를 섞으면 더 안전해요`}
        error={errors.newPassword?.message}
        valid={!!dirtyFields.newPassword && !errors.newPassword && newPassword.length >= PASSWORD_MIN}
        {...register("newPassword", { deps: ["newPasswordConfirm"] })}
      />
      <PasswordInput
        label="새 비밀번호 확인"
        autoComplete="new-password"
        error={errors.newPasswordConfirm?.message}
        valid={!!confirm && !errors.newPasswordConfirm && confirm === newPassword}
        {...register("newPasswordConfirm")}
      />

      <FormAlert show={outcome === "not-connected"} variant="info" title="비밀번호가 변경되지 않았어요">
        비밀번호 변경 기능은 아직 서버와 연결되지 않았어요. 연결 후 이 화면에서 바로 변경할 수 있어요.
      </FormAlert>
      <FormAlert show={outcome === "error"} title="변경하지 못했어요">
        잠시 후 다시 시도해 주세요.
      </FormAlert>
      <FormAlert show={outcome === "changed"} variant="info" title="비밀번호를 변경했어요">
        다음 로그인부터 새 비밀번호를 사용해 주세요.
      </FormAlert>

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto sm:self-start sm:min-w-44">
        비밀번호 변경
      </Button>
    </form>
  );
}
