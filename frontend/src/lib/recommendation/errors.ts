import type { RecommendationErrorCode } from "@/types/recommendation";

/** 추천 흐름 전반에서 쓰는 오류 — code로 화면 문구/재시도 방식을 결정 */
export class RecommendationError extends Error {
  readonly code: RecommendationErrorCode;

  constructor(code: RecommendationErrorCode, message?: string) {
    super(message ?? code);
    this.name = "RecommendationError";
    this.code = code;
  }
}

export function toRecommendationError(error: unknown): RecommendationError {
  if (error instanceof RecommendationError) return error;
  // fetch가 네트워크 단계에서 실패하면 TypeError
  if (error instanceof TypeError) return new RecommendationError("NETWORK_ERROR", error.message);
  return new RecommendationError("UNKNOWN", error instanceof Error ? error.message : undefined);
}

type ErrorCopy = { title: string; description: string };

/** 사용자에게 보여줄 오류 안내 — 원인을 단정하지 않고, 다음 행동을 알려줍니다 */
export const ERROR_COPY: Record<RecommendationErrorCode, ErrorCopy> = {
  NETWORK_ERROR: {
    title: "연결이 원활하지 않아요.",
    description: "인터넷 연결을 확인한 뒤 다시 시도해 주세요.",
  },
  SERVER_ERROR: {
    title: "추천을 완성하지 못했어요.",
    description: "추천 서버에서 처리 중 문제가 생겼어요. 잠시 후 새로 추천을 요청해 주세요.",
  },
  TIMEOUT: {
    title: "응답이 너무 오래 걸리고 있어요.",
    description: "기다리는 시간이 길어져 확인을 멈췄어요. 새로 추천을 요청해 주세요.",
  },
  INVALID_JOB: {
    title: "진행 중인 추천을 찾을 수 없어요.",
    description: "주소가 잘못되었거나 이미 만료된 추천 요청이에요. 새로 추천을 요청해 주세요.",
  },
  NOT_FOUND: {
    title: "추천 결과를 찾을 수 없어요.",
    description: "삭제되었거나 존재하지 않는 결과예요. 새로 추천을 받아보세요.",
  },
  PROFILE_REQUIRED: {
    title: "먼저 뷰티 프로필이 필요해요.",
    description: "피부 타입과 고민을 알려주시면 그 조건으로 추천을 시작할 수 있어요.",
  },
  UNKNOWN: {
    title: "문제가 생겼어요.",
    description: "예상하지 못한 오류가 발생했어요. 다시 시도해 주세요.",
  },
};
