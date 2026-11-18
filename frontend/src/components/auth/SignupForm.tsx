"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup, isAuthApiNotConnected } from "@/lib/api/auth";
import {
  getPasswordStrength,
  PASSWORD_MIN,
  signupSchema,
  type SignupValues,
} from "@/lib/validation/auth";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { AgreementCheckbox } from "./AgreementCheckbox";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { FormAlert, FormError } from "./FormError";

const strengthMeta = {
  1: { label: "약함", bar: "bg-rose-deep" },
  2: { label: "보통", bar: "bg-sage" },
  3: { label: "안전", bar: "bg-sage-deep" },
} as const;

function PasswordStrength({ password }: { password: string }) {
  const level = getPasswordStrength(password);
  if (level === 0) {
    return <>{PASSWORD_MIN}자 이상 입력해 주세요. 영문 · 숫자 · 특수문자를 섞으면 더 안전해요.</>;
  }
  const meta = strengthMeta[level];
  return (
    <span className="flex items-center gap-3">
      <span className="grid flex-1 grid-cols-3 gap-1" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("h-1 rounded-full transition-colors duration-300", i <= level ? meta.bar : "bg-line")}
          />
        ))}
      </span>
      <span className="shrink-0">
        보안 강도 <span className="font-medium text-charcoal-soft">{meta.label}</span>
      </span>
    </span>
  );
}

export function SignupForm({ className }: { className?: string }) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    trigger,
    getFieldState,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      agreeTerms: false,
      agreePrivacy: false,
    },
    mode: "onTouched", // 필드를 한 번 벗어난 뒤부터 입력할 때마다 실시간 검증
  });

  const [password, passwordConfirm, agreeTerms, agreePrivacy] = useWatch({
    control,
    name: ["password", "passwordConfirm", "agreeTerms", "agreePrivacy"],
  });
  const allAgreed = agreeTerms && agreePrivacy;

  const toggleAll = (checked: boolean) => {
    const opts = { shouldDirty: true, shouldTouch: true, shouldValidate: checked || isSubmitted };
    setValue("agreeTerms", checked, opts);
    setValue("agreePrivacy", checked, opts);
  };

  const onSubmit = async (values: SignupValues) => {
    try {
      await signup({
        email: values.email,
        password: values.password,
        agreeTerms: values.agreeTerms,
        agreePrivacy: values.agreePrivacy,
      });
      // STEP 08: 가입 성공 → 서버가 로그인 세션(httpOnly 쿠키)을 발급 → 피부 프로필 작성으로 이동
      router.push("/profile/skin");
    } catch (error) {
      setError("root.server", {
        type: isAuthApiNotConnected(error) ? "not-connected" : "unknown",
        message: isAuthApiNotConnected(error)
          ? "입력하신 내용은 모두 올바르게 확인됐어요. 다만 아직 인증 서버가 연결되지 않아 실제 계정은 생성되지 않았고, 정보도 전송 · 저장되지 않았습니다."
          : "일시적인 문제로 가입하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  const serverError = errors.root?.server;
  const notConnected = serverError?.type === "not-connected";
  const agreementError =
    errors.agreeTerms && errors.agreePrivacy
      ? "필수 약관에 모두 동의해 주세요."
      : (errors.agreeTerms?.message ?? errors.agreePrivacy?.message);
  const confirmMatches =
    passwordConfirm.length > 0 && passwordConfirm === password && !errors.passwordConfirm;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-5", className)}>
      <FormAlert
        show={!!serverError}
        variant={notConnected ? "info" : "error"}
        title={notConnected ? "회원가입 서버 연동 준비 중이에요" : "가입하지 못했어요"}
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
        autoComplete="new-password"
        placeholder={`${PASSWORD_MIN}자 이상`}
        error={errors.password?.message}
        hint={<PasswordStrength password={password} />}
        {...register("password", {
          // 비밀번호를 고치면 '비밀번호 확인' 일치 여부도 즉시 다시 검사
          onChange: () => {
            if (getFieldState("passwordConfirm").isTouched || isSubmitted) void trigger("passwordConfirm");
          },
        })}
      />

      <PasswordInput
        label="비밀번호 확인"
        autoComplete="new-password"
        placeholder="비밀번호를 한 번 더 입력하세요"
        error={errors.passwordConfirm?.message}
        valid={confirmMatches}
        {...register("passwordConfirm")}
      />

      {/* 약관 동의 */}
      <fieldset className="mt-1">
        <legend className="mb-2 text-[13px] font-medium text-charcoal-soft">약관 동의</legend>
        <div
          className={cn(
            "rounded-xl border bg-white/50 px-4 py-1.5 transition-colors duration-300",
            agreementError ? "border-rose-ink/70" : "border-line-strong",
          )}
        >
          <AgreementCheckbox
            label="전체 동의"
            emphasis
            checked={allAgreed}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          <div className="my-1 h-px bg-line" />
          <AgreementCheckbox
            label="서비스 이용약관 동의"
            necessity="required"
            href="/terms"
            invalid={!!errors.agreeTerms}
            {...register("agreeTerms")}
          />
          <AgreementCheckbox
            label="개인정보 수집 · 이용 동의"
            necessity="required"
            href="/privacy"
            invalid={!!errors.agreePrivacy}
            {...register("agreePrivacy")}
          />
        </div>
        <FormError message={agreementError} />
      </fieldset>

      <Button type="submit" size="lg" arrow loading={isSubmitting} className="mt-3 w-full">
        {isSubmitting ? "가입 처리 중…" : "가입하고 피부 프로필 시작하기"}
      </Button>
    </form>
  );
}
