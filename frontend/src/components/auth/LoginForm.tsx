"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, isAuthApiNotConnected } from "@/lib/api/auth";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { FormAlert } from "./FormError";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [resetOpen, setResetOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit", // 첫 제출 시 검증
    reValidateMode: "onChange", // 이후에는 입력할 때마다 재검증
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values);
      // STEP 08: 서버가 httpOnly 쿠키로 JWT를 내려주면 홈(또는 이전 페이지)으로 이동
      router.replace("/");
    } catch (error) {
      setError("root.server", {
        type: isAuthApiNotConnected(error) ? "not-connected" : "unknown",
        message: isAuthApiNotConnected(error)
          ? "아직 인증 서버가 연결되지 않아 로그인할 수 없어요. 입력하신 정보는 어디에도 전송되거나 저장되지 않았습니다."
          : "일시적인 문제로 로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  const serverError = errors.root?.server;
  const notConnected = serverError?.type === "not-connected";

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-5", className)}>
        <FormAlert
          show={!!serverError}
          variant={notConnected ? "info" : "error"}
          title={notConnected ? "로그인 서버 연동 준비 중이에요" : "로그인하지 못했어요"}
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

        <PasswordInput
          label="비밀번호"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          error={errors.password?.message}
          labelAction={
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="link-underline -my-3 py-3 text-[13px] text-muted hover:text-charcoal"
            >
              비밀번호를 잊으셨나요?
            </button>
          }
          {...register("password")}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="mt-3 w-full">
          {isSubmitting ? "로그인 중…" : "로그인"}
        </Button>
      </form>

      <ForgotPasswordDialog
        open={resetOpen}
        defaultEmail={resetOpen ? getValues("email") : ""}
        onClose={() => setResetOpen(false)}
      />
    </>
  );
}
