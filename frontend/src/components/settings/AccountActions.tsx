"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { deleteAccount, logout } from "@/lib/api/account";
import { isAuthApiNotConnected } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormAlert } from "@/components/auth/FormError";

const CONFIRM_WORD = "탈퇴";

/** 로그아웃 — 인증 미연결 시 가짜 로그아웃 처리를 하지 않음 */
export function LogoutAction() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onLogout = async () => {
    setPending(true);
    setNotice(null);
    try {
      await logout();
      // 연동 후: 쿠키 제거 응답 → router.replace(routes.login)
    } catch (e) {
      setNotice(
        isAuthApiNotConnected(e)
          ? "로그인 기능이 아직 서버와 연결되지 않아 로그아웃할 세션이 없어요."
          : "로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="secondary" size="lg" onClick={onLogout} loading={pending} className="w-full sm:w-auto sm:self-start">
        <LogOut className="size-4" strokeWidth={1.5} aria-hidden />
        로그아웃
      </Button>
      <FormAlert show={!!notice} variant="info">
        {notice}
      </FormAlert>
    </div>
  );
}

/** 회원 탈퇴 — 확인 모달(체크 + 확인 단어 입력) · API 미연결 시 실행하지 않음 */
export function DeleteAccountAction() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [word, setWord] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (pending) return;
    setOpen(false);
    setAgreed(false);
    setWord("");
    setError(null);
  };

  const onConfirm = async () => {
    setPending(true);
    setError(null);
    try {
      await deleteAccount();
      // 연동 후: 세션 종료 → 탈퇴 완료 안내 페이지로 이동
    } catch (e) {
      setError(
        isAuthApiNotConnected(e)
          ? "계정 삭제 기능이 아직 서버와 연결되지 않아 탈퇴가 진행되지 않았어요. 계정과 데이터는 그대로예요."
          : "탈퇴를 처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div className="rounded-[1.5rem] border border-rose/70 px-6 py-6">
        <p className="text-[15px] font-medium">회원 탈퇴</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
          탈퇴하면 뷰티 프로필과 추천 기록이 모두 삭제되며 되돌릴 수 없어요.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 -ml-1 inline-flex min-h-11 items-center px-1 text-[14px] font-medium text-rose-ink underline-offset-4 hover:underline"
        >
          회원 탈퇴하기
        </button>
      </div>

      <ConfirmDialog
        open={open}
        onClose={close}
        onConfirm={onConfirm}
        tone="danger"
        eyebrow="Delete account"
        title="정말 탈퇴하시겠어요?"
        description={
          <ul className="list-disc space-y-1 pl-5">
            <li>뷰티 프로필과 추천 기록, 피드백이 모두 삭제돼요.</li>
            <li>삭제된 정보는 복구할 수 없어요.</li>
          </ul>
        }
        confirmLabel="탈퇴하기"
        confirmDisabled={!agreed || word.trim() !== CONFIRM_WORD}
        loading={pending}
      >
        <label className="flex cursor-pointer items-start gap-2.5 text-[14px]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 accent-charcoal"
          />
          위 내용을 확인했어요.
        </label>
        <label className="mt-5 block text-[13px] text-charcoal-soft" htmlFor="delete-confirm-word">
          확인을 위해 <strong className="font-medium text-charcoal">‘{CONFIRM_WORD}’</strong>를 입력해 주세요.
        </label>
        <input
          id="delete-confirm-word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          autoComplete="off"
          className="mt-2 block h-12 w-full rounded-xl border border-line-strong bg-white/60 px-4 text-[15px] focus:border-charcoal focus:outline-none"
        />
        <FormAlert show={!!error} variant="info" title="탈퇴가 진행되지 않았어요" className="mt-4">
          {error}
        </FormAlert>
      </ConfirmDialog>
    </>
  );
}
