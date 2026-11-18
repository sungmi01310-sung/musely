import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";

type HistoryEmptyStateProps = {
  /** 필터 결과만 비었을 때 — "전체 보기"로 되돌리기 */
  filtered?: { label: string; onReset: () => void };
};

/** 추천 기록이 없을 때 (또는 선택한 유형의 기록이 없을 때) */
export function HistoryEmptyState({ filtered }: HistoryEmptyStateProps) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="font-serif text-[2rem] italic text-subtle">—</p>
        <p className="mt-4 text-[17px] tracking-[-0.02em]">‘{filtered.label}’ 추천 기록이 아직 없어요.</p>
        <Button variant="secondary" className="mt-8" onClick={filtered.onReset}>
          전체 기록 보기
        </Button>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="history-empty-title"
      className="relative overflow-hidden rounded-[2rem] bg-lavender/60 px-6 py-20 text-center sm:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-rose/45 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-16 size-72 rounded-full bg-sage/25 blur-3xl" />
      {/* 빈 아카이브 — 겹쳐진 빈 액자 */}
      <div aria-hidden className="relative mx-auto h-32 w-28">
        <span className="absolute inset-0 -rotate-6 rounded-t-full border border-charcoal/15 bg-ivory/50" />
        <span className="absolute inset-0 rotate-3 rounded-t-full border border-charcoal/20 bg-ivory/80" />
        <span className="absolute inset-x-0 bottom-6 text-center font-serif text-3xl italic text-subtle">m</span>
      </div>
      <p className="eyebrow relative mt-10 text-subtle">An empty archive</p>
      <h2 id="history-empty-title" className="relative mt-4 text-[1.6rem] font-light tracking-[-0.04em] sm:text-[2rem]">
        아직 저장된 추천이 없어요.
      </h2>
      <p className="relative mt-3 text-[15px] text-muted">첫 번째 뷰티 레이어를 찾아보세요.</p>
      <Button href={routes.recommendationSelect} size="lg" arrow className="relative mt-10">
        추천받으러 가기
      </Button>
    </section>
  );
}
