import { cn } from "@/lib/cn";

type Step = { label: string; en: string };

type ProfileStepIndicatorProps = {
  steps: readonly Step[];
  /** 1부터 시작 */
  current: number;
  /** 모든 단계 완료(저장 완료) 상태 */
  complete?: boolean;
  className?: string;
};

/** "STEP 1 / 2" + 단계별 진행 바 */
export function ProfileStepIndicator({ steps, current, complete, className }: ProfileStepIndicatorProps) {
  const total = steps.length;
  const active = steps[current - 1];
  return (
    <nav aria-label="프로필 작성 단계" className={className}>
      <div className="flex items-baseline justify-between">
        <p className="eyebrow text-charcoal-soft">
          {complete ? "Complete" : `Step ${current} / ${total}`}
        </p>
        <p className="font-serif text-[15px] italic text-subtle">{complete ? "All set" : active?.en}</p>
      </div>
      <ol className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {steps.map((step, i) => {
          const n = i + 1;
          const done = complete || n < current;
          const isCurrent = !complete && n === current;
          return (
            <li key={step.label} aria-current={isCurrent ? "step" : undefined}>
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-line">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-charcoal transition-[width] duration-700 ease-editorial",
                    done || isCurrent ? "w-full" : "w-0",
                  )}
                />
              </span>
              <span
                className={cn(
                  "mt-2 block text-[12px]",
                  isCurrent ? "font-medium text-charcoal" : done ? "text-charcoal-soft" : "text-subtle",
                )}
              >
                {step.label}
                <span className="sr-only">{done ? " (완료)" : isCurrent ? " (현재 단계)" : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
