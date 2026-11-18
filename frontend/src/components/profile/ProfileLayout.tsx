"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { Cloud, RotateCcw, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import { ProfileStepIndicator } from "./ProfileStepIndicator";
import { ProfileSummary } from "./ProfileSummary";
import { useProfileFlow, useProfileForm } from "./ProfileFormProvider";

export const PROFILE_STEPS = [
  { label: "피부 프로필", en: "Skin" },
  { label: "향 취향", en: "Fragrance" },
] as const;

const visuals = {
  1: {
    image: "/images/cream-texture.jpg",
    alt: "대리석 위에 펼쳐 바른 크림 텍스처",
    quote: "Your skin, read closely.",
  },
  2: {
    image: "/images/candle-mood.jpg",
    alt: "따뜻한 캔들 불빛과 드라이 플라워",
    quote: "A scent that stays with you.",
  },
} as const;

const timeFmt = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" });
const dateTimeFmt = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** 좌측 비주얼 패널의 실시간 프로필 요약 */
function LiveSummary() {
  const { control } = useProfileForm();
  const values = useWatch({ control });
  return (
    <ProfileSummary
      values={{
        skinType: values.skinType ?? "",
        concerns: values.concerns ?? [],
        avoidIngredients: (values.avoidIngredients ?? []).filter((v): v is string => typeof v === "string"),
        currentActives: values.currentActives ?? [],
        preferredScentFamilies: values.preferredScentFamilies ?? [],
        occasion: values.occasion ?? null,
      }}
    />
  );
}

export function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const step = pathname.startsWith(routes.profileFragrance) ? 2 : 1;
  const visual = visuals[step];
  const { hydrated, mode, restoredDraftAt, draftSavedAt, saved, discardDraft } = useProfileFlow();

  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      {/* ── 왼쪽: 비주얼 + 실시간 요약 (데스크톱) ── */}
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-hidden bg-lavender p-10 lg:flex xl:p-12">
        <Logo />
        <div className="relative mt-10 h-[30vh] min-h-48 overflow-hidden rounded-t-full rounded-b-[1.25rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={visual.image}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image src={visual.image} alt={visual.alt} fill priority sizes="30vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={visual.quote}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45 }}
            className="mt-7 font-serif text-[2rem] leading-[1.05] italic tracking-[-0.03em] xl:text-[2.3rem]"
          >
            {visual.quote}
          </motion.p>
        </AnimatePresence>

        <div className="mt-auto rounded-2xl bg-ivory/55 p-5 backdrop-blur">
          <p className="eyebrow mb-4 text-charcoal-soft">Your profile so far</p>
          <LiveSummary />
        </div>
      </aside>

      {/* ── 오른쪽: 입력 영역 ── */}
      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line/70 bg-ivory/85 px-5 backdrop-blur-xl sm:px-8 lg:static lg:h-20 lg:border-0 lg:bg-transparent lg:px-12 lg:backdrop-blur-none">
          <span className="lg:hidden">
            <Logo />
          </span>
          <p className="hidden items-center gap-1.5 text-[12px] text-subtle sm:flex" aria-live="polite">
            <Cloud className="size-3.5" strokeWidth={1.5} aria-hidden />
            {/* draftSavedAt은 클라이언트 전용 값 → 하이드레이션 이후에만 표시 */}
            {hydrated && draftSavedAt
              ? `이 브라우저에 임시 저장됨 · ${timeFmt.format(draftSavedAt)}`
              : "입력 내용은 이 브라우저에 자동으로 임시 저장돼요"}
          </p>
          <Link
            href={routes.home}
            className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted transition-colors hover:text-charcoal"
          >
            <X className="size-3.5" strokeWidth={1.5} aria-hidden />
            나가기
          </Link>
        </header>

        <main className="flex flex-1 justify-center px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pb-16 lg:pt-6">
          <div className="w-full max-w-[640px]">
            <ProfileStepIndicator steps={PROFILE_STEPS} current={step} complete={!!saved} />

            {/* 임시 저장본 복원 / 수정 모드 안내 */}
            <AnimatePresence initial={false}>
              {hydrated && !saved && (restoredDraftAt || mode === "edit") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-lavender-deep bg-lavender/60 px-4 py-2.5 text-[13px] text-charcoal-soft">
                    <span>
                      {restoredDraftAt
                        ? `${dateTimeFmt.format(restoredDraftAt)}에 임시 저장된 입력을 불러왔어요.`
                        : "저장된 프로필을 불러왔어요. 수정 후 다시 저장해 주세요."}
                    </span>
                    <button
                      type="button"
                      onClick={discardDraft}
                      className="-my-2 inline-flex min-h-11 items-center gap-1 font-medium text-charcoal underline-offset-4 hover:underline"
                    >
                      <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden />
                      처음부터 다시
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
