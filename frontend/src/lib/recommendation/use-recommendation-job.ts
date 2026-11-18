"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RecommendationErrorCode, RecommendationJobResponse } from "@/types/recommendation";
import { recommendationAdapter } from "./adapter";
import { ERROR_COPY, RecommendationError, toRecommendationError } from "./errors";
import { POLL_INTERVAL_MS, SLOW_NOTICE_AFTER_MS } from "./steps";

/** 일시적인 네트워크 오류는 이 횟수까지 조용히 재시도 */
const MAX_NETWORK_RETRIES = 3;

const knownCode = (code?: string): RecommendationErrorCode =>
  code && code in ERROR_COPY ? (code as RecommendationErrorCode) : "SERVER_ERROR";

type Options = {
  /** DONE 응답을 받았을 때 (recommendationId 포함) */
  onDone: (job: RecommendationJobResponse & { recommendationId: string }) => void;
};

/**
 * 추천 Job 폴링 훅
 * - 약 1초 간격으로 GET /api/recommendations/jobs/{jobId}
 * - DONE → onDone, FAILED/404/타임아웃 → error
 * - 언마운트(페이지 이탈 · 취소) 시 진행 중인 요청과 타이머를 모두 정리
 * jobId가 바뀌면 상태를 초기화하려면 사용하는 컴포넌트에 key={jobId}를 주세요.
 */
export function useRecommendationJob(jobId: string, { onDone }: Options) {
  const [job, setJob] = useState<RecommendationJobResponse | null>(null);
  const [error, setError] = useState<RecommendationError | null>(null);
  const [slow, setSlow] = useState(false);
  const stopRef = useRef<() => void>(() => {});
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let networkFailures = 0;
    let stopped = false;
    const slowTimer = setTimeout(() => setSlow(true), SLOW_NOTICE_AFTER_MS);

    const stop = () => {
      stopped = true;
      controller.abort();
      clearTimeout(timer);
      clearTimeout(slowTimer);
    };
    stopRef.current = stop;

    const tick = async () => {
      try {
        const next = await recommendationAdapter.getJob(jobId, controller.signal);
        if (stopped) return;
        networkFailures = 0;
        setJob(next);
        if (next.status === "DONE" && next.recommendationId) {
          stop();
          onDoneRef.current({ ...next, recommendationId: next.recommendationId });
          return;
        }
        if (next.status === "FAILED") {
          stop();
          setError(new RecommendationError(knownCode(next.error?.code), next.error?.message));
          return;
        }
      } catch (e) {
        if (stopped) return;
        const err = toRecommendationError(e);
        if (!(err.code === "NETWORK_ERROR" && ++networkFailures < MAX_NETWORK_RETRIES)) {
          stop();
          setError(err);
          return;
        }
      }
      if (Date.now() - startedAt > recommendationAdapter.pollTimeoutMs) {
        stop();
        setError(new RecommendationError("TIMEOUT"));
        return;
      }
      timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    void tick();
    return stop;
  }, [jobId]);

  /** 폴링 중단 (취소 버튼) — 서버 작업 취소와는 별개 */
  const stopPolling = useCallback(() => stopRef.current(), []);

  return { job, error, slow, stopPolling };
}
