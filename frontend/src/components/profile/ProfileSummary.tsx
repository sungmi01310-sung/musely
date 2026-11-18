import { cn } from "@/lib/cn";
import { labelOf } from "@/lib/profile/options";
import type { BeautyProfileFormValues } from "@/lib/profile/schema";

type Row = { label: string; values: string[]; empty: string };

function rowsOf(v: BeautyProfileFormValues): Row[] {
  return [
    { label: "피부 타입", values: v.skinType ? [labelOf(v.skinType)] : [], empty: "선택 전" },
    { label: "피부 고민", values: v.concerns.map(labelOf), empty: "없음" },
    { label: "피하는 성분", values: v.avoidIngredients.map(labelOf), empty: "없음" },
    { label: "사용 중 성분", values: v.currentActives.map(labelOf), empty: "없음" },
    { label: "선호 향", values: v.preferredScentFamilies.map(labelOf), empty: "선택 안 함" },
    { label: "사용 상황", values: v.occasion ? [labelOf(v.occasion)] : [], empty: "선택 안 함" },
  ];
}

type ProfileSummaryProps = {
  values: BeautyProfileFormValues;
  /** panel: 비주얼 패널 위(라벤더) / plain: 완료 화면 */
  tone?: "panel" | "plain";
  className?: string;
};

/** 지금까지 선택한 프로필을 라벨로 요약 */
export function ProfileSummary({ values, tone = "panel", className }: ProfileSummaryProps) {
  return (
    <dl className={cn("divide-y", tone === "panel" ? "divide-charcoal/10" : "divide-line", className)}>
      {rowsOf(values).map((row) => (
        <div key={row.label} className="flex gap-4 py-2.5 first:pt-0 last:pb-0">
          <dt className="w-20 shrink-0 pt-0.5 text-[12px] text-charcoal-soft/80">{row.label}</dt>
          <dd className="flex min-w-0 flex-1 flex-wrap gap-1">
            {row.values.length ? (
              row.values.map((label) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[12px]",
                    tone === "panel" ? "bg-ivory/80 text-charcoal" : "bg-lavender text-charcoal",
                  )}
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="pt-0.5 text-[12px] text-subtle">{row.empty}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
