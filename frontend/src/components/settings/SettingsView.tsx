"use client";

import { useCallback, useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { getBeautyProfileForSettings, getMe, type MeResult } from "@/lib/api/account";
import type { SavedBeautyProfile } from "@/lib/api/profile";
import { MockDataSwitcher } from "@/components/dev/MockDataSwitcher";
import { SettingsSection, PendingTag } from "./SettingsSection";
import { AccountInfoCard } from "./AccountInfoCard";
import { BeautyProfileSummary } from "./BeautyProfileSummary";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { NotificationSettings } from "./NotificationSettings";
import { DeleteAccountAction, LogoutAction } from "./AccountActions";

const NAV = [
  { id: "account", label: "계정 정보" },
  { id: "beauty-profile", label: "내 뷰티 프로필" },
  { id: "password", label: "비밀번호 변경" },
  { id: "notifications", label: "알림 설정" },
  { id: "manage", label: "로그아웃 · 탈퇴" },
] as const;

type MeState = { status: "loading" } | { status: "error" } | MeResult;
type ProfileState = { status: "loading" } | { status: "ready"; saved: SavedBeautyProfile | null };

export function SettingsView() {
  const [me, setMe] = useState<MeState>({ status: "loading" });
  const [profile, setProfile] = useState<ProfileState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getMe(controller.signal)
      .then(setMe)
      .catch(() => {
        if (!controller.signal.aborted) setMe({ status: "error" });
      });
    getBeautyProfileForSettings()
      .then((saved) => {
        if (!controller.signal.aborted) setProfile({ status: "ready", saved });
      })
      .catch(() => {
        if (!controller.signal.aborted) setProfile({ status: "ready", saved: null });
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setMe({ status: "loading" });
    setProfile({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
      {/* 섹션 바로가기 — 데스크톱 고정, 모바일 가로 스크롤 */}
      <nav aria-label="설정 메뉴" className="lg:sticky lg:top-28 lg:self-start">
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0 lg:flex-col lg:gap-0.5">
          {NAV.map((n, i) => (
            <li key={n.id} className="shrink-0">
              <a
                href={`#${n.id}`}
                className="flex min-h-11 items-center gap-3 rounded-full border border-charcoal/12 px-4 text-[13.5px] text-charcoal-soft transition-colors hover:border-charcoal/40 hover:text-charcoal lg:rounded-xl lg:border-transparent lg:px-3 lg:hover:border-transparent lg:hover:bg-lavender/60"
              >
                <span className="hidden font-serif text-[13px] italic text-subtle lg:inline">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 hidden gap-2 rounded-xl bg-lavender/50 p-3.5 text-[12px] leading-relaxed text-muted lg:flex">
          <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-sage-deep" strokeWidth={1.75} aria-hidden />
          계정 · 비밀번호 · 알림 기능은 서버 연결 전이라 실제로 저장되지 않아요.
        </p>
      </nav>

      <div className="min-w-0">
        <SettingsSection id="account" index="01" en="Account" title="계정 정보" description="로그인에 사용하는 정보예요.">
          <AccountInfoCard me={me.status === "error" ? { status: "error", retry: reload } : me} />
        </SettingsSection>

        <SettingsSection
          id="beauty-profile"
          index="02"
          en="Beauty profile"
          title="내 뷰티 프로필"
          description="추천의 기준이 되는 피부 정보와 향 취향이에요. 수정하면 다음 추천부터 반영돼요."
        >
          <BeautyProfileSummary state={profile} />
        </SettingsSection>

        <SettingsSection
          id="password"
          index="03"
          en="Password"
          title="비밀번호 변경"
          description={
            <>
              <PendingTag>서버 연결 전</PendingTag>
              <span className="mt-2 block">입력값 검증만 동작해요. 실제 변경은 백엔드 연동 후 가능해요.</span>
            </>
          }
        >
          <PasswordChangeForm />
        </SettingsSection>

        <SettingsSection id="notifications" index="04" en="Notifications" title="알림 설정" description="받고 싶은 소식을 골라주세요.">
          <NotificationSettings />
        </SettingsSection>

        <SettingsSection id="manage" index="05" en="Leave" title="로그아웃 · 회원 탈퇴" tone="danger">
          <div className="flex flex-col gap-8">
            <LogoutAction />
            <DeleteAccountAction />
          </div>
        </SettingsSection>
      </div>

      <MockDataSwitcher onDataChange={reload} />
    </div>
  );
}
