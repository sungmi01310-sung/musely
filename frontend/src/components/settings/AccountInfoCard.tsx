"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlaskConical, Lock, PenLine, UserRound } from "lucide-react";
import type { MeResult } from "@/lib/api/account";
import { updateMe } from "@/lib/api/account";
import { isAuthApiNotConnected } from "@/lib/api/auth";
import { accountNameSchema, NAME_MAX, type AccountNameValues } from "@/lib/validation/auth";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "@/components/auth/AuthInput";
import { FormAlert } from "@/components/auth/FormError";

const dateFmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" });

type AccountInfoCardProps = {
  me: { status: "loading" } | { status: "error"; retry: () => void } | MeResult;
};

function Field({ label, editable, children }: { label: string; editable: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start sm:gap-6">
      <dt className="flex items-center gap-1.5 text-[13px] text-muted sm:min-h-11">
        {label}
        {editable ? (
          <span className="rounded-full bg-lavender px-2 py-0.5 text-[10.5px] text-charcoal-soft">수정 가능</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10.5px] text-subtle">
            <Lock className="size-3" strokeWidth={1.75} aria-hidden />
            읽기 전용
          </span>
        )}
      </dt>
      <dd className="flex min-w-0 items-center sm:min-h-11 [&>*]:w-full">{children}</dd>
    </div>
  );
}

function NameEditor({ initial, onDone }: { initial: string; onDone: () => void }) {
  const [notConnected, setNotConnected] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountNameValues>({ resolver: zodResolver(accountNameSchema), defaultValues: { name: initial } });

  const onSubmit = async (values: AccountNameValues) => {
    setNotConnected(false);
    try {
      await updateMe({ name: values.name });
      onDone();
    } catch (e) {
      if (isAuthApiNotConnected(e)) setNotConnected(true);
      else throw e;
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <AuthInput
        label="이름 또는 닉네임"
        maxLength={NAME_MAX}
        autoComplete="nickname"
        error={errors.name?.message}
        hint={`${NAME_MAX}자 이하`}
        {...register("name")}
      />
      <FormAlert show={notConnected} variant="info" title="아직 저장하지 않았어요">
        계정 서버가 연결되기 전이라 이름이 변경되지 않았어요.
      </FormAlert>
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={isSubmitting} className="min-h-11 px-5">
          저장
        </Button>
        <Button variant="ghost" size="sm" onClick={onDone} disabled={isSubmitting} className="min-h-11 px-5">
          취소
        </Button>
      </div>
    </form>
  );
}

/** 계정 정보 — 개발용 샘플 계정은 실제 계정과 명확히 구분 */
export function AccountInfoCard({ me }: AccountInfoCardProps) {
  const [editing, setEditing] = useState(false);

  if (me.status === "loading") {
    return (
      <div aria-busy="true" aria-label="계정 정보를 불러오는 중" className="flex flex-col gap-4">
        <div className="h-14 animate-pulse rounded-2xl bg-ivory-deep" />
        <div className="h-24 animate-pulse rounded-2xl bg-ivory-deep" />
      </div>
    );
  }
  if (me.status === "error") {
    return (
      <div role="alert" className="rounded-2xl border border-rose bg-rose/20 px-5 py-4 text-[14px]">
        <p className="font-medium">계정 정보를 불러오지 못했어요.</p>
        <p className="mt-1 text-[13px] text-muted">잠시 후 다시 시도해 주세요.</p>
        <Button variant="secondary" size="sm" onClick={me.retry} className="mt-4 min-h-11 px-5">
          다시 불러오기
        </Button>
      </div>
    );
  }
  if (me.status === "signed-out") {
    return (
      <div className="flex flex-col gap-5 rounded-[1.5rem] bg-lavender/55 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ivory text-muted">
            <UserRound className="size-5" strokeWidth={1.5} aria-hidden />
          </span>
          <div>
            <p className="text-[15px] font-medium">로그인 후 계정 정보를 확인할 수 있어요.</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">로그인 기능은 아직 서버와 연결되지 않았어요.</p>
          </div>
        </div>
        <Button href={routes.login} variant="secondary" className="shrink-0">
          로그인
        </Button>
      </div>
    );
  }

  const { user, source } = me;
  const initial = (user.name ?? user.email).trim().charAt(0).toUpperCase();

  return (
    <div>
      {source === "mock" && (
        <p className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-lavender px-3 py-1 text-[12px] text-charcoal-soft">
          <FlaskConical className="size-3.5 text-sage-deep" strokeWidth={1.75} aria-hidden />
          개발용 샘플 계정 · 실제 로그인 계정이 아니에요
        </p>
      )}
      <div className="flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-charcoal font-serif text-2xl italic text-ivory">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[1.25rem] tracking-[-0.03em]">{user.name ?? "이름 미설정"}</p>
          <p className="break-all text-[13.5px] text-muted">{user.email}</p>
        </div>
      </div>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        <Field label="이름" editable>
          {editing ? (
            <NameEditor initial={user.name ?? ""} onDone={() => setEditing(false)} />
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px]">{user.name ?? <span className="text-subtle">미설정</span>}</span>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-charcoal hover:bg-charcoal/5"
              >
                <PenLine className="size-3.5" strokeWidth={1.5} aria-hidden />
                수정
              </button>
            </div>
          )}
        </Field>
        <Field label="이메일" editable={false}>
          <span className="break-all text-[15px]">{user.email}</span>
        </Field>
        <Field label="가입일" editable={false}>
          <span className="text-[15px]">
            {user.createdAt ? <time dateTime={user.createdAt}>{dateFmt.format(new Date(user.createdAt))}</time> : "—"}
          </span>
        </Field>
      </dl>
    </div>
  );
}
