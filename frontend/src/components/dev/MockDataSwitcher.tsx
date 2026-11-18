"use client";

import { useState, useSyncExternalStore } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { isMockRecommendation } from "@/lib/recommendation/adapter";
import { clearMockHistory, seedMockHistory } from "@/lib/recommendation/mock/history";
import {
  MOCK_DATA_SCENARIOS,
  readMockDataScenario,
  subscribeMockDataScenario,
  writeMockDataScenario,
  type MockDataScenario,
} from "@/lib/dev/mock-data-scenario";
import { DevMockPanel, DevPanelAction } from "./DevMockPanel";

/** /history · /settings 개발용 Mock 데이터 상태 패널 */
export function MockDataSwitcher({ onDataChange }: { onDataChange?: () => void }) {
  const scenario = useSyncExternalStore(subscribeMockDataScenario, readMockDataScenario, () => null);
  const [note, setNote] = useState<string | null>(null);
  if (!isMockRecommendation) return null;

  return (
    <DevMockPanel
      title="Mock 데이터 상태"
      note={note ?? "개발용 패널 · 이 브라우저의 Mock 데이터로 화면 상태를 바꿔 볼 수 있어요."}
      options={MOCK_DATA_SCENARIOS}
      value={scenario}
      onChange={(v) => {
        writeMockDataScenario(v as MockDataScenario);
        setNote(null);
        onDataChange?.();
      }}
      actions={() => (
        <>
          <DevPanelAction
            primary
            onClick={() => {
              const n = seedMockHistory();
              writeMockDataScenario("default");
              setNote(`샘플 추천 기록 ${n}건을 이 브라우저에 만들었어요.`);
              onDataChange?.();
            }}
          >
            <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden />
            샘플 추천 기록 채우기
          </DevPanelAction>
          <DevPanelAction
            onClick={() => {
              clearMockHistory();
              setNote("이 브라우저의 Mock 추천 기록을 모두 지웠어요.");
              onDataChange?.();
            }}
          >
            <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden />
            Mock 추천 기록 지우기
          </DevPanelAction>
        </>
      )}
    />
  );
}
