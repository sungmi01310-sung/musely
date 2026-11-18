import { labelOf } from "@/lib/profile/options";
import type { BeautyProfile } from "@/types/beauty-profile";

type RecommendationSummaryProps = {
  profile: BeautyProfile;
  summary: string;
};

type Row = { label: string; values: string[]; empty: string };

/** 추천 요약 — 어떤 조건을 읽고 골랐는지 (편집 매거진의 "스펙 시트" 느낌) */
export function RecommendationSummary({ profile, summary }: RecommendationSummaryProps) {
  const rows: Row[] = [
    { label: "피부 타입", values: profile.skinType ? [labelOf(profile.skinType)] : [], empty: "—" },
    { label: "주요 피부 고민", values: profile.concerns.map(labelOf), empty: "선택 안 함" },
    { label: "제외한 기피 성분", values: profile.avoidIngredients.map(labelOf), empty: "없음" },
    { label: "선호 향 계열", values: profile.preferredScentFamilies.map(labelOf), empty: "선택 안 함" },
  ];

  return (
    <section aria-labelledby="rec-summary-title">
      <h2 id="rec-summary-title" className="eyebrow text-subtle">
        How we chose · 이렇게 골랐어요
      </h2>
      <p className="relative mt-5 pl-7 text-[1.15rem] leading-[1.7] tracking-[-0.02em] text-charcoal text-pretty sm:pl-8 sm:text-[1.3rem]">
        <span aria-hidden className="absolute left-0 top-0 font-serif text-[2.6em] leading-[0.9] text-rose-deep">
          “
        </span>
        {summary}
      </p>
      <dl className="mt-8 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-32 shrink-0 text-[12.5px] text-muted">{row.label}</dt>
            <dd className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {row.values.length ? (
                row.values.map((v) => (
                  <span
                    key={v}
                    className={
                      row.label === "제외한 기피 성분"
                        ? "rounded-full border border-charcoal/15 px-2.5 py-0.5 text-[13px] text-charcoal-soft line-through decoration-rose-deep/70"
                        : "rounded-full bg-lavender px-2.5 py-0.5 text-[13px] text-charcoal"
                    }
                  >
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-subtle">{row.empty}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
