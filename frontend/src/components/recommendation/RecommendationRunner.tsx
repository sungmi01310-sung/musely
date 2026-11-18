"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { RecommendationJobResponse, RecommendationJobStatus } from "@/types/recommendation";
import { recommendationAdapter, isMockRecommendation } from "@/lib/recommendation/adapter";
import { RecommendationError, toRecommendationError } from "@/lib/recommendation/errors";
import { isMockScenario, writeMockScenario } from "@/lib/recommendation/mock/scenarios";
import { RECOMMENDATION_STEPS } from "@/lib/recommendation/steps";
import { useRecommendationJob } from "@/lib/recommendation/use-recommendation-job";
import { recommendationLoadingPath, recommendationResultPath, routes } from "@/lib/routes";
import { RecommendationProgress } from "./RecommendationProgress";
import { RecommendationErrorState, type StateAction } from "./RecommendationErrorState";
import { ProgressStep } from "./ProgressStep";

const ALL_PENDING: RecommendationJobStatus[] = RECOMMENDATION_STEPS.map(() => "PENDING");

/** 서버 응답 → 화면 단계 상태. 서버가 steps를 주지 않으면 단계를 지어내지 않고 대기로 둡니다. */
function statusesOf(job: RecommendationJobResponse | null): RecommendationJobStatus[] {
  if (!job?.steps) return job?.status === "DONE" ? RECOMMENDATION_STEPS.map(() => "DONE") : ALL_PENDING;
  return RECOMMENDATION_STEPS.map((s) => job.steps!.find((x) => x.key === s.key)?.status ?? "PENDING");
}

type Actions = { retry: () => void; retrying: boolean; cancel: () => void };

function errorActions(error: RecommendationError, { retry, retrying }: Actions): {
  primary: StateAction;
  secondary: StateAction;
} {
  if (error.code === "PROFILE_REQUIRED") {
    return {
      primary: { label: "프로필 입력하기", href: routes.profileSkin },
      secondary: { label: "홈으로", href: routes.home },
    };
  }
  return {
    // 재시도 = 새 추천 요청(Job) 생성
    primary: { label: "다시 시도", onClick: retry, loading: retrying },
    secondary: { label: "추천 선택으로 돌아가기", href: routes.recommendationSelect },
  };
}

/** Job 생성(POST) 단계 실패 화면 */
function CreateErrorView({ error, actions }: { error: RecommendationError; actions: Actions }) {
  return (
    <RecommendationErrorState
      code={error.code}
      {...errorActions(error, actions)}
      devDetail={isMockRecommendation ? error.message : undefined}
    />
  );
}

/** jobId가 정해진 뒤의 폴링 + 진행/실패 화면 */
function JobProgress({ jobId, actions }: { jobId: string; actions: Actions }) {
  const router = useRouter();
  const onDone = useCallback(
    (job: { recommendationId: string }) => {
      // replace: 뒤로 가기로 진행 화면에 다시 갇히지 않도록
      router.replace(recommendationResultPath(job.recommendationId));
    },
    [router],
  );
  const { job, error, slow, stopPolling } = useRecommendationJob(jobId, { onDone });
  const statuses = statusesOf(job);

  const cancel = () => {
    stopPolling();
    actions.cancel();
  };

  if (error) {
    const failedStep = statuses.some((s) => s === "FAILED");
    return (
      <RecommendationErrorState
        code={error.code}
        {...errorActions(error, actions)}
        devDetail={isMockRecommendation ? error.message : undefined}
      >
        {failedStep && (
          <ol aria-label="중단된 단계" className="mx-auto max-w-xs divide-y divide-line/70 text-left">
            {RECOMMENDATION_STEPS.map((s, i) => (
              <ProgressStep key={s.key} index={i} label={s.label} en={s.en} status={statuses[i]} compact />
            ))}
          </ol>
        )}
      </RecommendationErrorState>
    );
  }

  return (
    <RecommendationProgress
      statuses={statuses}
      progress={job?.progress}
      slow={slow}
      onCancel={cancel}
      supportsCancel={recommendationAdapter.supportsCancel}
    />
  );
}

/**
 * /recommendations/loading
 * - ?jobId 없음 → POST로 새 Job 생성 후 URL을 ?jobId=… 로 교체 (새로고침해도 같은 Job 폴링)
 * - ?jobId 있음 → 폴링 → DONE이면 결과 페이지로 이동
 * - (Mock) ?scenario=empty 처럼 시나리오 지정 가능
 */
export function RecommendationRunner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const scenarioParam = searchParams.get("scenario");

  const [createError, setCreateError] = useState<RecommendationError | null>(null);
  const [retrying, setRetrying] = useState(false);
  const creating = useRef(false);
  const alive = useRef(false);

  const createJob = useCallback(async () => {
    if (creating.current) return;
    creating.current = true;
    try {
      if (isMockRecommendation && isMockScenario(scenarioParam)) writeMockScenario(scenarioParam);
      const { jobId: next } = await recommendationAdapter.createJob({ track: "both" });
      // 취소 등으로 화면을 떠났다면 다시 끌고 오지 않음 (서버 Job은 남아 있을 수 있음)
      if (alive.current) router.replace(recommendationLoadingPath(next), { scroll: false });
    } catch (e) {
      if (alive.current) setCreateError(toRecommendationError(e));
    } finally {
      creating.current = false;
      if (alive.current) setRetrying(false);
    }
  }, [router, scenarioParam]);

  useEffect(() => {
    alive.current = true;
    if (!jobId) void createJob();
    return () => {
      alive.current = false;
    };
  }, [jobId, createJob]);

  const retry = useCallback(() => {
    setRetrying(true);
    setCreateError(null);
    void createJob();
  }, [createJob]);

  const cancel = useCallback(() => {
    alive.current = false;
    router.push(routes.recommendationSelect);
  }, [router]);

  const actions: Actions = { retrying, retry, cancel };

  let content;
  if (createError) {
    content = <CreateErrorView error={createError} actions={actions} />;
  } else if (!jobId) {
    // Job 생성 중 — 모든 단계 대기
    content = (
      <RecommendationProgress
        statuses={ALL_PENDING}
        onCancel={actions.cancel}
        supportsCancel={recommendationAdapter.supportsCancel}
      />
    );
  } else {
    content = <JobProgress key={jobId} jobId={jobId} actions={actions} />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={createError ? "error" : "progress"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="flex w-full justify-center"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

/** Suspense 대기 화면 (검색 파라미터를 읽기 전) */
export function RecommendationRunnerFallback() {
  const router = useRouter();
  return (
    <RecommendationProgress
      statuses={ALL_PENDING}
      onCancel={() => router.push(routes.recommendationSelect)}
      supportsCancel={recommendationAdapter.supportsCancel}
    />
  );
}
