"use client";

import { useSyncExternalStore } from "react";
import { BellOff } from "lucide-react";
import type { NotificationKey, NotificationPreferences } from "@/types/user";
import {
  DEFAULT_NOTIFICATIONS,
  readLocalNotificationPreferences,
  writeLocalNotificationPreferences,
} from "@/lib/api/account";
import { NotificationToggle } from "./NotificationToggle";

const ITEMS: { key: NotificationKey; label: string; description: string }[] = [
  { key: "recommendation", label: "추천 관련 알림", description: "새 추천이 준비되거나 프로필에 맞는 제품이 생겼을 때" },
  { key: "service", label: "서비스 공지 알림", description: "약관 변경, 점검 등 꼭 필요한 안내" },
  { key: "marketing", label: "마케팅 알림", description: "이벤트와 큐레이션 소식 (선택)" },
];

/* localStorage 스냅샷 구독 — 문자열 스냅샷으로 참조 안정성 확보 */
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => JSON.stringify(readLocalNotificationPreferences());
const getServerSnapshot = () => null;

/** 알림 설정 — 발송 기능 전: 선택만 이 브라우저에 기억 */
export function NotificationSettings() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const prefs: NotificationPreferences = snapshot ? (JSON.parse(snapshot) as NotificationPreferences) : DEFAULT_NOTIFICATIONS;

  const set = (key: NotificationKey, value: boolean) => {
    writeLocalNotificationPreferences({ ...prefs, [key]: value });
    listeners.forEach((l) => l());
  };

  return (
    <div>
      <p className="flex gap-2 rounded-xl bg-lavender/60 px-4 py-3 text-[12.5px] leading-relaxed text-charcoal-soft">
        <BellOff className="mt-0.5 size-3.5 shrink-0 text-sage-deep" strokeWidth={1.75} aria-hidden />
        알림 발송 기능은 아직 준비 중이에요. 지금 고른 설정은 이 브라우저에만 기억되며, 실제 알림은 발송되지 않아요.
      </p>
      <div className="mt-2 divide-y divide-line">
        {ITEMS.map((item) => (
          <NotificationToggle
            key={item.key}
            label={item.label}
            description={item.description}
            checked={prefs[item.key]}
            disabled={!snapshot}
            onChange={(v) => set(item.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
