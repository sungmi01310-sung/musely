"use client";

import { cn } from "@/lib/cn";
import { HISTORY_FILTERS, type HistoryFilterValue } from "@/lib/recommendation/history";

type HistoryFilterProps = {
  value: HistoryFilterValue;
  onChange: (value: HistoryFilterValue) => void;
  counts: Record<HistoryFilterValue, number>;
};

/** 추천 유형 필터 — 네이티브 라디오(방향키 이동) + 필 스타일, 모바일은 가로 스크롤 */
export function HistoryFilter({ value, onChange, counts }: HistoryFilterProps) {
  return (
    <fieldset className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
      <legend className="sr-only">추천 유형으로 거르기</legend>
      <div className="flex w-max gap-2">
        {HISTORY_FILTERS.map((f) => {
          const active = f.value === value;
          return (
            <label
              key={f.value}
              className={cn(
                "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-[14px] transition-[background-color,border-color,color] duration-500 ease-editorial",
                "has-focus-visible:outline has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-2 has-focus-visible:outline-charcoal",
                active ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/15 text-charcoal-soft hover:border-charcoal/50",
              )}
            >
              <input
                type="radio"
                name="history-filter"
                value={f.value}
                checked={active}
                onChange={() => onChange(f.value)}
                className="sr-only"
              />
              {f.label}
              <span className={cn("text-[12px] tabular-nums", active ? "text-ivory/60" : "text-subtle")}>
                {counts[f.value]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
