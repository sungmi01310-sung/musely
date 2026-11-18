"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, History, PenLine, RotateCcw, Sparkles } from "lucide-react";
import type { RecommendationResult } from "@/types/recommendation";
import { recommendationAdapter, isMockRecommendation } from "@/lib/recommendation/adapter";
import { RecommendationError, toRecommendationError } from "@/lib/recommendation/errors";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MockNotice } from "./MockNotice";
import { RecommendationSummary } from "./RecommendationSummary";
import { IngredientCaution } from "./IngredientCaution";
import { CosmeticProductCard } from "./CosmeticProductCard";
import { FragranceProductCard } from "./FragranceProductCard";
import { RecommendationFeedback } from "./RecommendationFeedback";
import { RecommendationEmptyState } from "./RecommendationEmptyState";
import { RecommendationErrorState } from "./RecommendationErrorState";
import { RecommendationResultSkeleton } from "./RecommendationResultSkeleton";

type LoadState =
  | { status: "loading" }
  | { status: "error"; error: RecommendationError }
  | { status: "ready"; data: RecommendationResult };

const dateFmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short" });

function SectionTitle({ index, en, ko, count }: { index: string; en: string; ko: string; count?: number }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="flex items-end gap-4">
        <span className="pb-2 font-serif text-sm italic text-subtle">{index}</span>
        <h2 className="display text-[3rem] italic sm:text-[4.2rem]">
          {en}
          <span className="sr-only"> · {ko}</span>
        </h2>
        <span aria-hidden className="pb-2.5 text-[13px] text-muted">
          ( {ko} )
        </span>
      </div>
      {typeof count === "number" && <p className="pb-2 text-[13px] text-muted">{count}개의 제안</p>}
    </div>
  );
}

/** 추천 결과 화면 */
export function RecommendationResultView({ id }: { id: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    recommendationAdapter
      .getRecommendation(id, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error: toRecommendationError(e) });
      });
    return () => controller.abort();
  }, [id, attempt]);

  if (state.status === "loading") return <RecommendationResultSkeleton />;

  if (state.status === "error") {
    const notFound = state.error.code === "NOT_FOUND";
    return (
      <Container className="flex justify-center py-24 sm:py-32">
        <RecommendationErrorState
          code={state.error.code}
          primary={
            notFound
              ? { label: "새 추천 받기", href: routes.recommendationStart }
              : {
                  label: "다시 불러오기",
                  onClick: () => {
                    setState({ status: "loading" });
                    setAttempt((n) => n + 1);
                  },
                }
          }
          secondary={notFound ? { label: "홈으로", href: routes.home } : { label: "새 추천 받기", href: routes.recommendationStart }}
          devDetail={isMockRecommendation ? state.error.message : undefined}
        />
      </Container>
    );
  }

  const r = state.data;
  const sample = r.meta.sample;
  const empty = r.cosmetics.length === 0 && r.fragrances.length === 0;
  const wantsFragrance = r.track !== "cosmetic";
  const avoidsFragrance = r.profile.avoidIngredients.includes("fragrance");
  const oddFragrances = r.fragrances.length % 2 === 1;

  return (
    <div className="pb-24">
      <Container className="max-w-[1280px] pt-8 sm:pt-12">
        <Link
          href={routes.recommendationSelect}
          className="-ml-1 inline-flex min-h-11 items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} aria-hidden />
          추천 선택으로
        </Link>

        {/* ── 헤드라인 + 요약 ── */}
        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-subtle">
              Your beauty layers · <time dateTime={r.createdAt}>{dateFmt.format(new Date(r.createdAt))}</time>
            </p>
            <h1 className="mt-6 text-[2.3rem] leading-[1.18] font-light tracking-[-0.045em] text-balance sm:text-[3.4rem]">
              당신을 위해 고른 <span className="font-serif text-[1.08em] italic">뷰티 레이어</span>.
            </h1>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
              피부 조건과 취향을 바탕으로, 어울릴 수 있는 제품을 골랐어요.
            </p>
            <MockNotice variant="result" sample={sample} className="mt-8 max-w-md" />
            {!!r.relaxationLevel && r.relaxationLevel > 0 && (
              <p className="mt-4 max-w-md rounded-xl bg-lavender/70 px-4 py-3 text-[12.5px] leading-relaxed text-charcoal-soft">
                후보가 부족해 선호 조건 일부를 넓혀 찾은 결과예요. 기피 성분 조건은 완화하지 않아요.
              </p>
            )}
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:pt-10">
            <RecommendationSummary profile={r.profile} summary={r.summary} />
          </Reveal>
        </div>

        {empty ? (
          <div className="mt-20">
            <RecommendationEmptyState
              blockedBy={r.blockedBy}
              primary={{ label: "프로필 수정하기", href: routes.profileEdit }}
              secondary={{ label: "다시 추천받기", href: routes.recommendationStart }}
            />
          </div>
        ) : (
          <>
            {r.cautions.length > 0 && (
              <Reveal className="mt-20">
                <IngredientCaution cautions={r.cautions} />
              </Reveal>
            )}

            {r.cosmetics.length > 0 && (
              <section aria-label="화장품 추천" className="mt-24">
                <SectionTitle index="01" en="Skincare" ko="화장품" count={r.cosmetics.length} />
                <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                  {r.cosmetics.map((p, i) => (
                    <Reveal as="li" key={p.itemId} delay={i * 0.08}>
                      <CosmeticProductCard product={p} index={i} sample={sample} />
                    </Reveal>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </Container>

      {/* ── 향수 — 라벤더 밴드로 화장품과 구분 ── */}
      {!empty && wantsFragrance && (
        <section aria-label="향수 추천" className="relative mt-24 overflow-hidden bg-lavender/60 py-20 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute -right-40 top-0 size-[480px] rounded-full bg-rose/40 blur-[120px]" />
          <Container className="relative max-w-[1280px]">
            <SectionTitle
              index={r.cosmetics.length ? "02" : "01"}
              en="Fragrance"
              ko="향수"
              count={r.fragrances.length || undefined}
            />
            {r.fragrances.length > 0 ? (
              <ul className="mt-10 grid gap-5 xl:grid-cols-2">
                {r.fragrances.map((p, i) => {
                  const featured = oddFragrances && i === 0;
                  return (
                    <Reveal as="li" key={p.itemId} delay={i * 0.08} className={featured ? "xl:col-span-2" : undefined}>
                      <FragranceProductCard product={p} sample={sample} featured={featured} />
                    </Reveal>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-10 max-w-lg text-[15px] leading-relaxed text-muted">
                {avoidsFragrance
                  ? "기피 성분에 ‘향료’가 등록되어 있어 향수는 후보에서 제외했어요. 향수는 향료를 원료로 하기 때문이에요."
                  : "선호하는 향 조건에 맞는 향수를 이번에는 찾지 못했어요."}
              </p>
            )}
          </Container>
        </section>
      )}

      <Container className="max-w-[1280px]">
        {!empty && !wantsFragrance && (
          <p className="mt-16 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted">
            <Sparkles className="size-4 text-rose-deep" strokeWidth={1.5} aria-hidden />
            향 취향을 알려주시면 향수도 함께 추천해 드릴게요.
            <Link href={routes.profileEdit} className="font-medium text-charcoal underline underline-offset-4">
              향 취향 추가하기
            </Link>
          </p>
        )}

        {!empty && (
          <div className="mt-24 border-t border-line pt-20">
            <RecommendationFeedback recommendationId={r.id} />
          </div>
        )}

        {/* ── 하단 CTA ── */}
        <section
          aria-label="다음 행동"
          className="relative mt-24 overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-ivory sm:px-12 sm:py-16"
        >
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-rose-deep/40 blur-[100px]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-ivory/60">Next layer</p>
              <p className="mt-4 text-[1.7rem] leading-[1.25] font-light tracking-[-0.04em] sm:text-[2.2rem]">
                다른 조합도 <span className="font-serif text-[1.1em] italic">궁금하다면.</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={routes.recommendationStart} variant="light" size="lg">
                <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
                다시 추천받기
              </Button>
              <Button
                href={routes.profileEdit}
                size="lg"
                className="border border-ivory/30 bg-transparent text-ivory hover:text-charcoal"
              >
                <PenLine className="size-4" strokeWidth={1.5} aria-hidden />내 프로필 수정
              </Button>
              <Button
                href={routes.history}
                size="lg"
                className="border border-ivory/30 bg-transparent text-ivory hover:text-charcoal"
              >
                <History className="size-4" strokeWidth={1.5} aria-hidden />
                추천 히스토리 보기
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
