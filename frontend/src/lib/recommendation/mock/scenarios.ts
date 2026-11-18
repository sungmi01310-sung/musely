/* ──────────────────────────────────────────────────────────────
   Mock 시나리오 — 개발 중 화면 상태를 쉽게 확인하기 위한 스위치
   선택값은 localStorage에 저장되고, 우측 하단 "Mock" 패널이나
   /recommendations/loading?scenario=empty 처럼 쿼리로도 바꿀 수 있습니다.
   ────────────────────────────────────────────────────────────── */

export const MOCK_SCENARIOS = [
  { value: "success", label: "정상 추천", description: "약 7초 후 추천 결과로 이동" },
  { value: "empty", label: "조건에 맞는 제품 없음", description: "기피 성분 조건으로 후보가 모두 제외됨" },
  { value: "failure", label: "추천 실패", description: "성분 조합 검수 단계에서 서버 오류" },
  { value: "delay", label: "처리 지연", description: "약 17초 소요 · 지연 안내 표시" },
  { value: "network", label: "네트워크 오류", description: "추천 요청 자체가 실패" },
  { value: "timeout", label: "타임아웃", description: "응답이 오지 않아 20초 후 확인 중단" },
] as const;

export type MockScenario = (typeof MOCK_SCENARIOS)[number]["value"];

const STORAGE_KEY = "musely:dev:recommendation-scenario";

export function isMockScenario(value: unknown): value is MockScenario {
  return MOCK_SCENARIOS.some((s) => s.value === value);
}

export function readMockScenario(): MockScenario {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isMockScenario(value) ? value : "success";
  } catch {
    return "success";
  }
}

const listeners = new Set<() => void>();

/** useSyncExternalStore 구독용 */
export function subscribeMockScenario(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function writeMockScenario(value: MockScenario) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* 저장소를 못 쓰면 이번 세션만 기본값 */
  }
  listeners.forEach((l) => l());
}

/** 시나리오별 시뮬레이션 타이밍(ms) — 실제 서버 시간과 무관 */
export const SCENARIO_TIMING: Record<MockScenario, { pendingMs: number; stepMs: number; failAtStep?: number }> = {
  success: { pendingMs: 700, stepMs: 1_600 },
  empty: { pendingMs: 700, stepMs: 1_500 },
  failure: { pendingMs: 700, stepMs: 1_500, failAtStep: 2 },
  delay: { pendingMs: 1_500, stepMs: 3_900 },
  network: { pendingMs: 0, stepMs: 0 },
  timeout: { pendingMs: 700, stepMs: Number.POSITIVE_INFINITY },
};
