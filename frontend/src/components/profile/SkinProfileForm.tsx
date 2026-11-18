"use client";

import { useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Controller, useWatch } from "react-hook-form";
import { AVOID_INGREDIENTS, CONCERNS, CURRENT_ACTIVES, SKIN_TYPES } from "@/lib/profile/options";
import { SKIN_STEP_FIELDS } from "@/lib/profile/schema";
import { routes } from "@/lib/routes";
import { useProfileFlow, useProfileForm } from "./ProfileFormProvider";
import { ProfileSection } from "./ProfileSection";
import { SingleSelectCard } from "./SingleSelectCard";
import { MultiSelectChip } from "./MultiSelectChip";
import { IngredientTagInput } from "./IngredientTagInput";
import { ProfileNavigation } from "./ProfileNavigation";

const countLabel = (n: number) => (n > 0 ? `${n}개 선택` : null);

/** STEP 1 / 2 — 피부 프로필 */
export function SkinProfileForm() {
  const router = useRouter();
  const { restoreDraft } = useProfileFlow();
  // 하이드레이션 이후 임시 저장본 복원
  useEffect(restoreDraft, [restoreDraft]);
  const {
    control,
    trigger,
    formState: { errors },
  } = useProfileForm();
  const [skinType, concerns, avoid, actives] = useWatch({
    control,
    name: ["skinType", "concerns", "avoidIngredients", "currentActives"],
  });

  const onNext = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 피부 단계 필드만 검증 → 통과해야 향 단계로 이동
    const ok = await trigger(SKIN_STEP_FIELDS, { shouldFocus: true });
    if (ok) router.push(routes.profileFragrance);
  };

  return (
    <form noValidate onSubmit={onNext}>
      <header className="mt-10 sm:mt-12">
        <p className="eyebrow text-subtle">Skin consultation</p>
        <h1 className="mt-4 text-[1.85rem] leading-[1.25] font-light tracking-[-0.04em] text-balance sm:text-[2.4rem]">
          당신의 <span className="font-serif text-[1.08em] italic">피부</span>를 조금 더 알려주세요.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
          피부 타입과 고민을 알려주시면, 나에게 맞는 성분을 찾는 데 도움이 돼요.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-14">
        <ProfileSection
          index="01"
          title="피부 타입"
          en="Skin type"
          badge="required"
          description="가장 가까운 하나를 골라주세요."
          error={errors.skinType?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="skinType"
              render={({ field }) => (
                <SingleSelectCard
                  name={field.name}
                  options={SKIN_TYPES}
                  value={field.value as (typeof SKIN_TYPES)[number]["value"] | ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  columns={2}
                  invalid={invalid}
                  describedBy={describedBy}
                />
              )}
            />
          )}
        </ProfileSection>

        <ProfileSection
          index="02"
          title="피부 고민"
          en="Concerns"
          badge="optional"
          description="해당하는 고민을 모두 선택해 주세요."
          meta={countLabel(concerns.length)}
          error={errors.concerns?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="concerns"
              render={({ field }) => (
                <MultiSelectChip
                  name={field.name}
                  options={CONCERNS}
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
          index="03"
          title="피하고 싶은 성분"
          en="Avoid list"
          badge="optional"
          description={
            <>
              선택한 성분이 들어간 제품은 <strong className="font-medium text-charcoal">추천 결과에서 제외</strong>돼요.
            </>
          }
          meta={countLabel(avoid.length)}
          error={errors.avoidIngredients?.message ?? errors.avoidIngredients?.root?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="avoidIngredients"
              render={({ field }) => (
                <div className="flex flex-col gap-6">
                  <MultiSelectChip
                    name={field.name}
                    options={AVOID_INGREDIENTS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    invalid={invalid}
                    describedBy={describedBy}
                  />
                  <IngredientTagInput
                    value={field.value}
                    onChange={field.onChange}
                    label="목록에 없는 성분 직접 입력"
                    invalid={invalid}
                    describedBy={describedBy}
                  />
                </div>
              )}
            />
          )}
        </ProfileSection>

        <ProfileSection
          index="04"
          title="현재 사용 중인 성분"
          en="Current actives"
          badge="optional"
          description="함께 쓰면 자극이 될 수 있는 성분 조합을 추천 결과에서 미리 알려드려요."
          meta={countLabel(actives.length)}
          error={errors.currentActives?.message}
        >
          {({ describedBy, invalid }) => (
            <Controller
              control={control}
              name="currentActives"
              render={({ field }) => (
                <MultiSelectChip
                  name={field.name}
                  options={CURRENT_ACTIVES}
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
      </div>

      <ProfileNavigation
        back={{ label: "홈으로", href: routes.home }}
        primary={{ label: "다음 · 향 취향", type: "submit", arrow: true }}
        hint={
          !skinType ? (
            <span>
              <span className="text-rose-ink">*</span> 피부 타입을 선택하면 다음 단계로 넘어갈 수 있어요.
            </span>
          ) : undefined
        }
      />
    </form>
  );
}
