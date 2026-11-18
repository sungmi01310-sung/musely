"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Controller, useWatch } from "react-hook-form";
import { OCCASIONS, SCENT_FAMILIES } from "@/lib/profile/options";
import { SKIN_STEP_FIELDS } from "@/lib/profile/schema";
import { routes } from "@/lib/routes";
import { FormAlert } from "@/components/auth/FormError";
import { useProfileFlow, useProfileForm } from "./ProfileFormProvider";
import { ProfileSection } from "./ProfileSection";
import { SingleSelectCard } from "./SingleSelectCard";
import { MultiSelectChip } from "./MultiSelectChip";
import { ProfileNavigation } from "./ProfileNavigation";
import { ProfileComplete } from "./ProfileComplete";

type Pending = "save" | "skip" | null;

/** STEP 2 / 2 — 향 취향 프로필 (선택 입력) */
export function FragranceProfileForm() {
  const { hydrated, saved, saveProfile, restoreDraft } = useProfileFlow();
  // 하이드레이션 이후 임시 저장본 복원
  useEffect(restoreDraft, [restoreDraft]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useProfileForm();
  const [skinType, scents] = useWatch({ control, name: ["skinType", "preferredScentFamilies"] });
  const [pending, setPending] = useState<Pending>(null);
  const [skinIncomplete, setSkinIncomplete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const submit = async (kind: Exclude<Pending, null>) => {
    setSaveError(null);
    setSkinIncomplete(false);
    if (kind === "skip") {
      // 건너뛰기 = 향 관련 값을 비운 채로 저장
      setValue("preferredScentFamilies", [], { shouldDirty: true });
      setValue("occasion", null, { shouldDirty: true });
    }
    setPending(kind);
    await handleSubmit(
      async (values) => {
        try {
          await saveProfile(values);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          setSaveError(error instanceof Error ? error.message : "저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      },
      (errs) => {
        // 향 단계 자체엔 필수 항목이 없으므로, 실패했다면 피부 단계가 비어 있는 것
        if (SKIN_STEP_FIELDS.some((f) => errs[f])) setSkinIncomplete(true);
      },
    )();
    setPending(null);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submit("save");
  };

  if (saved) return <ProfileComplete />;

  const showSkinGuard = hydrated && (skinIncomplete || !skinType);

  return (
    <form noValidate onSubmit={onSubmit}>
      <header className="mt-10 sm:mt-12">
        <p className="eyebrow text-subtle">Fragrance profile · 선택</p>
        <h1 className="mt-4 text-[1.85rem] leading-[1.25] font-light tracking-[-0.04em] text-balance sm:text-[2.4rem]">
          당신이 좋아하는 <span className="font-serif text-[1.08em] italic">향</span>은 어떤 느낌인가요?
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
          좋아하는 향과 사용 상황을 알려주시면, 취향에 맞는 향수를 찾아드릴게요.
        </p>
      </header>

      <FormAlert show={showSkinGuard} variant="info" title="피부 프로필을 먼저 완성해 주세요" className="mt-6">
        프로필을 저장하려면 STEP 1의 피부 타입이 필요해요.{" "}
        <Link href={routes.profileSkin} className="font-medium text-charcoal underline underline-offset-4">
          피부 프로필로 이동
        </Link>
      </FormAlert>
      <FormAlert show={!!saveError} variant="error" title="저장하지 못했어요" className="mt-6">
        {saveError}
      </FormAlert>

      <div className="mt-12 flex flex-col gap-14">
        <ProfileSection
          index="01"
          title="선호하는 향 계열"
          en="Scent families"
          badge="optional"
          description="끌리는 향을 모두 골라주세요."
          meta={scents.length > 0 ? `${scents.length}개 선택` : null}
          error={errors.preferredScentFamilies?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="preferredScentFamilies"
              render={({ field }) => (
                <MultiSelectChip
                  variant="card"
                  name={field.name}
                  options={SCENT_FAMILIES}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  invalid={invalid}
                  describedBy={describedBy}
                />
              )}
            />
          )}
        </ProfileSection>

        <ProfileSection
          index="02"
          title="주로 사용하는 상황"
          en="Occasion"
          badge="optional"
          description="가장 자주 뿌리게 될 순간 하나를 골라주세요. 다시 누르면 선택이 해제돼요."
          error={errors.occasion?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="occasion"
              render={({ field }) => (
                <SingleSelectCard
                  name={field.name}
                  options={OCCASIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onClear={() => field.onChange(null)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  columns={4}
                  invalid={invalid}
                  describedBy={describedBy}
                />
              )}
            />
          )}
        </ProfileSection>
      </div>

      <ProfileNavigation
        back={{ label: "이전 단계", href: routes.profileSkin }}
        skip={{
          label: "건너뛰기",
          onClick: () => void submit("skip"),
          loading: pending === "skip",
          disabled: pending !== null,
        }}
        primary={{
          label: pending === "save" ? "저장 중…" : "프로필 저장",
          type: "submit",
          loading: pending === "save",
          disabled: pending !== null,
        }}
        hint="향 취향은 선택 사항이에요. 건너뛰면 향 정보 없이 프로필이 저장돼요."
      />
    </form>
  );
}
