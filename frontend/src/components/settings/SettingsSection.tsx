import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SettingsSectionProps = {
  id: string;
  index: string;
  en: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** 회원 탈퇴 등 주의 영역 */
  tone?: "default" | "danger";
};

/** 설정 섹션 — 왼쪽 에디토리얼 라벨 + 오른쪽 내용 (박스 대신 헤어라인으로 구분) */
export function SettingsSection({ id, index, en, title, description, children, tone = "default" }: SettingsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid scroll-mt-28 gap-7 border-t border-line py-12 sm:py-14 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12"
    >
      <div>
        <p className="flex items-baseline gap-3">
          <span className="font-serif text-sm italic text-subtle">{index}</span>
          <span className={cn("font-serif text-[1.35rem] italic", tone === "danger" ? "text-rose-ink" : "text-charcoal")}>
            {en}
          </span>
        </p>
        <h2 id={`${id}-title`} className="mt-2 text-[1.2rem] font-medium tracking-[-0.03em]">
          {title}
        </h2>
        {description && <div className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted">{description}</div>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** 섹션 안 작은 상태 표시 (예: "서버 연결 전") */
export function PendingTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/12 bg-ivory px-2.5 py-0.5 text-[11.5px] text-muted">
      <span className="size-1.5 rounded-full bg-sage" aria-hidden />
      {children}
    </span>
  );
}
