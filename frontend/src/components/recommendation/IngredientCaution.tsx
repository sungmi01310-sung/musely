import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { IngredientCaution as Caution, IngredientCautionSeverity } from "@/types/recommendation";

const SEVERITY: Record<IngredientCautionSeverity, { label: string; className: string }> = {
  LOW: { label: "참고", className: "bg-sage/25 text-sage-deep" },
  MEDIUM: { label: "주의", className: "bg-rose/50 text-rose-ink" },
  HIGH: { label: "높은 주의", className: "bg-rose-ink text-ivory" },
};

/**
 * 성분 조합 주의사항
 * - 의학적 진단처럼 단정하지 않는 안내 문구
 * - 주의 등급/확신도는 API가 제공할 때만 표시
 * - 주의사항이 없으면 렌더링하지 않음 (불필요한 경고 금지)
 */
export function IngredientCaution({ cautions }: { cautions: Caution[] }) {
  if (cautions.length === 0) return null;

  return (
    <section
      aria-labelledby="rec-caution-title"
      className="grid gap-8 rounded-[2rem] bg-rose/20 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14"
    >
      <div>
        <p className="eyebrow text-rose-ink">Before you layer</p>
        <h2 id="rec-caution-title" className="mt-4 text-[1.5rem] leading-[1.3] font-light tracking-[-0.035em] sm:text-[1.8rem]">
          함께 쓰기 전에
          <br />
          <span className="font-serif text-[1.1em] italic">확인해 주세요</span>
        </h2>
        <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-muted">
          일반적인 사용 가이드를 바탕으로 한 안내이며 의학적 진단이 아니에요. 피부 상태가 걱정된다면 전문가와 상담해 주세요.
        </p>
      </div>

      <ul className="divide-y divide-rose-deep/25">
        {cautions.map((c) => (
          <li key={c.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              {c.severity && SEVERITY[c.severity] && (
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", SEVERITY[c.severity].className)}>
                  {SEVERITY[c.severity].label}
                </span>
              )}
              {c.pairLabels && c.pairLabels.length > 0 && (
                <span className="inline-flex flex-wrap items-center gap-1.5">
                  {c.pairLabels.map((label, i) => (
                    <span key={`${label}-${i}`} className="inline-flex items-center gap-1.5">
                      {i > 0 && <Plus className="size-3 text-rose-ink" strokeWidth={2} aria-label="그리고" />}
                      <span className="rounded-full bg-ivory/80 px-2.5 py-0.5 text-[13px] font-medium text-charcoal">{label}</span>
                    </span>
                  ))}
                </span>
              )}
            </div>
            {c.title && <p className="mt-3 text-[13px] text-muted">{c.title}</p>}
            <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal">{c.message}</p>
            {(c.source || c.confidence) && (
              <p className="mt-2 text-[11.5px] text-subtle">
                {c.source && <>출처 · {c.source}</>}
                {c.source && c.confidence && " · "}
                {c.confidence && <>확신도 · {c.confidence}</>}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
