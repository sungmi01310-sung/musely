"use client";

import { motion } from "motion/react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import { sanitizeProfileValues } from "@/lib/profile/schema";
import { useProfileFlow } from "./ProfileFormProvider";
import { ProfileSummary } from "./ProfileSummary";

const savedFmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" });

/** 프로필 저장 완료 → 추천받기(STEP 04)로 이어지는 화면 */
export function ProfileComplete() {
  const { saved, resumeEditing } = useProfileFlow();
  if (!saved) return null;
  const skipped = saved.profile.preferredScentFamilies.length === 0 && saved.profile.occasion === null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="profile-complete-title"
      className="mt-10 pb-16 sm:mt-12"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-charcoal text-ivory">
        <Check className="size-5" strokeWidth={2} aria-hidden />
      </span>
      <p className="eyebrow mt-8 text-subtle">Profile saved</p>
      <h1
        id="profile-complete-title"
        className="mt-4 text-[1.85rem] leading-[1.25] font-light tracking-[-0.04em] sm:text-[2.4rem]"
      >
        당신의 <span className="font-serif text-[1.08em] italic">beauty</span> 프로필이 준비됐어요.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        이제 이 프로필을 바탕으로 AI가 화장품{skipped ? "" : "과 향수"}를 추천하고, 그 이유를 설명해 드릴게요.
        {skipped && " 향 취향은 나중에 언제든 추가할 수 있어요."}
      </p>

      {/* Mock 저장 안내 — 실제 서버 저장과 명확히 구분 */}
      <div className="mt-6 flex gap-2.5 rounded-xl border border-line-strong bg-white/50 px-4 py-3 text-[12.5px] leading-relaxed text-muted">
        <Info className="mt-0.5 size-3.5 shrink-0 text-sage-deep" strokeWidth={1.75} aria-hidden />
        <p>
          <strong className="font-medium text-charcoal-soft">개발용 Mock 저장</strong> — 아직 서버가 연결되지 않아 이
          브라우저에만 저장됐어요 ({savedFmt.format(new Date(saved.savedAt))}). 로그인 · 서버 연동 후에는 계정에
          저장됩니다.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white/60 p-5 sm:p-6">
        <ProfileSummary values={sanitizeProfileValues(saved.profile)} tone="plain" />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={routes.recommendationStart} size="lg" arrow className="sm:min-w-52">
          AI 추천받기
        </Button>
        <Button variant="secondary" size="lg" onClick={resumeEditing}>
          프로필 다시 수정
        </Button>
      </div>
    </motion.section>
  );
}
