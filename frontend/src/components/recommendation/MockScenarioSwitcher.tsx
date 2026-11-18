"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { routes } from "@/lib/routes";
import { isMockRecommendation } from "@/lib/recommendation/adapter";
import {
  MOCK_SCENARIOS,
  readMockScenario,
  subscribeMockScenario,
  writeMockScenario,
  type MockScenario,
} from "@/lib/recommendation/mock/scenarios";
import { DevMockPanel, DevPanelAction } from "@/components/dev/DevMockPanel";

/**
 * 개발용 Mock 추천 시나리오 전환 패널 (Mock 어댑터일 때만 렌더링)
 * 실제 API 어댑터로 바꾸면 자동으로 사라집니다.
 */
export function MockScenarioSwitcher() {
  const scenario = useSyncExternalStore(subscribeMockScenario, readMockScenario, () => null);
  const router = useRouter();
  if (!isMockRecommendation) return null;

  return (
    <DevMockPanel
      title="Mock 추천 시나리오"
      note="개발용 패널 · 실제 AI 서버가 아닌 시뮬레이션이에요. 새 추천 요청부터 적용돼요."
      options={MOCK_SCENARIOS}
      value={scenario}
      onChange={(v) => writeMockScenario(v as MockScenario)}
      actions={(close) => (
        <DevPanelAction
          primary
          onClick={() => {
            close();
            router.push(routes.recommendationStart);
          }}
        >
          <Play className="size-3.5" strokeWidth={1.75} aria-hidden />이 시나리오로 새 추천 실행
        </DevPanelAction>
      )}
    />
  );
}
