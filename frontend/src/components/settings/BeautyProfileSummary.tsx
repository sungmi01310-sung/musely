import Link from "next/link";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import type { BeautyProfile } from "@/types/beauty-profile";
import type { SavedBeautyProfile } from "@/lib/api/profile";
import { labelOf, SCENT_FAMILIES } from "@/lib/profile/options";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";

const savedFmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" });

type Row = { label: string; values: string[]; empty: string; tone?: "avoid" | "scent" };

function Tags({ row }: { row: Row }) {
  if (!row.values.length) return <span className="text-[13px] text-subtle">{row.empty}</span>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {row.values.map((v) => {
        const swatch = row.tone === "scent" ? SCENT_FAMILIES.find((s) => s.value === v)?.swatch : undefined;
        return (
          <li
            key={v}
            className={
              row.tone === "avoid"
                ? "rounded-full border border-charcoal/15 px-2.5 py-0.5 text-[13px] text-charcoal-soft"
                : "inline-flex items-center gap-1.5 rounded-full bg-ivory px-2.5 py-0.5 text-[13px] text-charcoal"
            }
          >
            {swatch && <span className="size-2 rounded-full" style={{ backgroundColor: swatch }} aria-hidden />}
            {labelOf(v)}
          </li>
        );
      })}
    </ul>
  );
}

function ProfilePanel({
  en,
  title,
  rows,
  editHref,
  editLabel,
  className,
}: {
  en: string;
  title: string;
  rows: Row[];
  editHref: string;
  editLabel: string;
  className: string;
}) {
  return (
    <article className={`flex flex-col rounded-[1.5rem] p-6 sm:p-7 ${className}`} aria-label={title}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-[1.5rem] italic leading-none">{en}</p>
          <h3 className="mt-2 text-[14px] font-medium text-charcoal-soft">{title}</h3>
        </div>
        <Link
          href={editHref}
          aria-label={editLabel}
          className="group/edit -mr-1 -mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-charcoal transition-colors hover:bg-ivory/70"
        >
          수정
          <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover/edit:-translate-y-0.5 group-hover/edit:translate-x-0.5" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
      <dl className="mt-6 flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="mb-1.5 text-[12px] text-muted">{row.label}</dt>
            <dd>
              <Tags row={row} />
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

type BeautyProfileSummaryProps = {
  state: { status: "loading" } | { status: "ready"; saved: SavedBeautyProfile | null };
};

/** 설정 > 내 뷰티 프로필 — 피부 정보 · 향 취향 요약 + 수정 이동 */
export function BeautyProfileSummary({ state }: BeautyProfileSummaryProps) {
  if (state.status === "loading") {
    return (
      <div aria-busy="true" aria-label="뷰티 프로필을 불러오는 중" className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-[1.5rem] bg-ivory-deep" />
        <div className="h-64 animate-pulse rounded-[1.5rem] bg-ivory-deep" />
      </div>
    );
  }

  if (!state.saved) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-charcoal/20 px-6 py-10 text-center">
        <p className="font-serif text-[1.6rem] italic">Not yet written.</p>
        <p className="mt-3 text-[15px] font-medium">아직 등록된 뷰티 프로필이 없어요.</p>
        <p className="mt-1 text-[13.5px] text-muted">피부와 향 취향을 알려주시면 더 나에게 맞는 추천을 받을 수 있어요.</p>
        <Button href={routes.profileSkin} className="mt-7" arrow>
          프로필 만들기
        </Button>
      </div>
    );
  }

  const p: BeautyProfile = state.saved.profile;
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ProfilePanel
          en="Skin"
          title="피부 정보"
          editHref={routes.profileEdit}
          editLabel="피부 프로필 수정"
          className="bg-lavender/70"
          rows={[
            { label: "피부 타입", values: p.skinType ? [p.skinType] : [], empty: "—" },
            { label: "피부 고민", values: p.concerns, empty: "선택 안 함" },
            { label: "기피 성분", values: p.avoidIngredients, empty: "없음", tone: "avoid" },
            { label: "사용 중인 성분", values: p.currentActives, empty: "없음" },
          ]}
        />
        <ProfilePanel
          en="Fragrance"
          title="향 취향"
          editHref={routes.profileFragranceEdit}
          editLabel="향 취향 수정"
          className="bg-rose/30"
          rows={[
            { label: "선호 향 계열", values: p.preferredScentFamilies, empty: "선택 안 함", tone: "scent" },
            { label: "사용 상황", values: p.occasion ? [p.occasion] : [], empty: "선택 안 함" },
          ]}
        />
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[12px] text-subtle">
        {state.saved.source === "mock" && <FlaskConical className="size-3.5 text-sage-deep" strokeWidth={1.75} aria-hidden />}
        {state.saved.source === "mock" ? "이 브라우저에 저장된 Mock 프로필 · " : "마지막 저장 · "}
        {savedFmt.format(new Date(state.saved.savedAt))}
      </p>
    </div>
  );
}
