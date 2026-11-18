/** 앱 내부 경로 — 한 곳에서 관리 */
export const routes = {
  home: "/",
  /** 홈의 "무엇을 찾고 계신가요?" 추천 선택 영역 */
  recommendationSelect: "/#start",
  login: "/login",
  signup: "/signup",
  profileSkin: "/profile/skin",
  profileFragrance: "/profile/fragrance",
  /** 저장된 프로필을 불러와 수정 */
  profileEdit: "/profile/skin?mode=edit",
  /** 새 추천 요청 → 진행 화면 (jobId 없이 들어오면 새 Job 생성) */
  recommendationStart: "/recommendations/loading",
  /** STEP 05에서 구현 예정 */
  history: "/history",
  settings: "/settings",
} as const;

export const recommendationLoadingPath = (jobId: string) =>
  `${routes.recommendationStart}?jobId=${encodeURIComponent(jobId)}`;

export const recommendationResultPath = (id: string) => `/recommendations/${encodeURIComponent(id)}`;
