/* ──────────────────────────────────────────────────────────────
   개발용 Mock 데이터 상태 — /history, /settings 화면 상태 확인용
   (추천 진행 시나리오는 lib/recommendation/mock/scenarios.ts 에서 별도 관리)
   ────────────────────────────────────────────────────────────── */

export const MOCK_DATA_SCENARIOS = [
  { value: "default", label: "정상", description: "이 브라우저에 저장된 Mock 데이터 표시" },
  { value: "empty", label: "추천 기록 없음", description: "히스토리 빈 상태" },
  { value: "slow", label: "로딩 지연", description: "조회에 약 3.5초 소요" },
  { value: "error", label: "조회 실패", description: "히스토리 · 계정 조회 오류" },
  { value: "no-profile", label: "프로필 미등록", description: "설정의 뷰티 프로필이 비어 있는 상태" },
] as const;

export type MockDataScenario = (typeof MOCK_DATA_SCENARIOS)[number]["value"];

const STORAGE_KEY = "musely:dev:data-scenario";
const listeners = new Set<() => void>();

export function readMockDataScenario(): MockDataScenario {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return MOCK_DATA_SCENARIOS.some((s) => s.value === v) ? (v as MockDataScenario) : "default";
  } catch {
    return "default";
  }
}

export function writeMockDataScenario(value: MockDataScenario) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* noop */
  }
  listeners.forEach((l) => l());
}

export function subscribeMockDataScenario(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** 시나리오에 맞춘 Mock 지연 */
export function mockDelay(signal?: AbortSignal, normalMs = 500): Promise<void> {
  const ms = readMockDataScenario() === "slow" ? 3_500 : normalMs;
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
