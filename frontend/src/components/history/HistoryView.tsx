"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { RecommendationHistory } from "@/types/recommendation";
import { recommendationAdapter, isMockRecommendation } from "@/lib/recommendation/adapter";
import { RecommendationError, toRecommendationError } from "@/lib/recommendation/errors";
import { HISTORY_FILTERS, isHistoryFilter, type HistoryFilterValue } from "@/lib/recommendation/history";
import { routes } from "@/lib/routes";
import { RecommendationErrorState } from "@/components/recommendation/RecommendationErrorState";
import { MockDataSwitcher } from "@/components/dev/MockDataSwitcher";
import { HistoryFilter } from "./HistoryFilter";
import { HistoryCard } from "./HistoryCard";
import { HistoryEmptyState } from "./HistoryEmptyState";

type LoadState =
  | { status: "loading" }
  | { status: "error"; error: RecommendationError }
  | { status: "ready"; items: RecommendationHistory[] };

const monthFmt = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" });

function HistorySkeleton() {
  return (
    <div aria-busy="true" aria-label="추천 기록을 불러오는 중" className="mt-10 divide-y divide-line">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-8 px-4 py-8 sm:px-8">
          <div className="h-12 w-14 animate-pulse rounded-xl bg-ivory-deep" />
          <div className="flex-1">
            <div className="h-5 w-28 animate-pulse rounded-full bg-ivory-deep" />
            <div className="mt-4 h-4 w-full max-w-lg animate-pulse rounded-full bg-ivory-deep" />
            <div className="mt-2 h-4 w-2/3 max-w-sm animate-pulse rounded-full bg-ivory-deep" />
          </div>
          <div className="hidden size-14 animate-pulse rounded-full bg-ivory-deep sm:block" />
        </div>
      ))}
    </div>
  );
}

/** /history — 저장된 추천 결과만 조회 (새 추천을 실행하지 않음) */
export function HistoryView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const filter: HistoryFilterValue = isHistoryFilter(typeParam) ? typeParam : "ALL";

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    recommendationAdapter
      .listHistory(controller.signal)
      .then((items) => setState({ status: "ready", items }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error: toRecommendationError(e) });
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  const setFilter = (value: HistoryFilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") params.delete("type");
    else params.set("type", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const items = useMemo(() => (state.status === "ready" ? state.items : []), [state]);
  const counts = useMemo(() => {
    const c = { ALL: items.length, COSMETIC: 0, FRAGRANCE: 0, BOTH: 0 } as Record<HistoryFilterValue, number>;
    for (const it of items) c[it.track]++;
    return c;
  }, [items]);
  const visible = filter === "ALL" ? items : items.filter((it) => it.track === filter);

  // 월별로 묶기 (최신순 유지)
  const groups = useMemo(() => {
    const map = new Map<string, RecommendationHistory[]>();
    for (const it of visible) {
      const key = monthFmt.format(new Date(it.createdAt));
      map.set(key, [...(map.get(key) ?? []), it]);
    }
    return [...map.entries()];
  }, [visible]);

  let body;
  if (state.status === "loading") {
    body = <HistorySkeleton />;
  } else if (state.status === "error") {
    body = (
      <div className="flex justify-center py-16">
        <RecommendationErrorState
          code={state.error.code === "NETWORK_ERROR" ? "NETWORK_ERROR" : "SERVER_ERROR"}
          title="추천 기록을 불러오지 못했어요."
          description="잠시 후 다시 시도해 주세요. 저장된 기록은 사라지지 않아요."
          headingLevel="h2"
          primary={{ label: "다시 불러오기", onClick: reload }}
          secondary={{ label: "홈으로", href: routes.home }}
          devDetail={isMockRecommendation ? state.error.message : undefined}
        />
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <div className="mt-10">
        <HistoryEmptyState />
      </div>
    );
  } else {
    body = (
      <>
        <div className="mt-10 flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <HistoryFilter value={filter} onChange={setFilter} counts={counts} />
          <p className="text-[13px] text-muted" aria-live="polite">
            {visible.length}개의 기록
            {isMockRecommendation && <span className="text-subtle"> · 이 브라우저에 저장된 Mock 기록</span>}
          </p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {visible.length === 0 ? (
              <HistoryEmptyState
                filtered={{
                  label: HISTORY_FILTERS.find((f) => f.value === filter)!.label,
                  onReset: () => setFilter("ALL"),
                }}
              />
            ) : (
              groups.map(([month, list]) => (
                <section key={month} aria-label={month} className="mt-10">
                  <h2 className="eyebrow px-4 text-subtle sm:px-6 lg:px-8">{month}</h2>
                  <ul className="mt-2 divide-y divide-line">
                    {list.map((item) => (
                      <li key={item.id}>
                        <HistoryCard item={item} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {body}
      <MockDataSwitcher onDataChange={reload} />
    </>
  );
}
