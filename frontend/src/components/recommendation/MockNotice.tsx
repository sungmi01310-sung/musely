import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/cn";
import { isMockRecommendation } from "@/lib/recommendation/adapter";

type MockNoticeProps = {
  /** progress: 진행 화면 하단 한 줄 / result: 결과 화면 안내 */
  variant?: "progress" | "result";
  /** 결과 데이터 자체가 샘플인지 (API 응답의 meta.sample) */
  sample?: boolean;
  className?: string;
};

/**
 * Mock/샘플 표시 — 실제 AI 분석 결과와 혼동되지 않도록 명확히 구분합니다.
 * 실제 API 어댑터 + 실데이터면 렌더링하지 않습니다.
 */
export function MockNotice({ variant = "progress", sample, className }: MockNoticeProps) {
  if (!isMockRecommendation && !sample) return null;

  if (variant === "progress") {
    return (
      <p
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-ivory/70 px-3.5 py-1.5 text-[11.5px] text-muted backdrop-blur",
          className,
        )}
      >
        <FlaskConical className="size-3 shrink-0 text-sage-deep" strokeWidth={1.75} aria-hidden />
        Mock 시뮬레이션 · 실제 AI 서버에 연결되지 않은 개발용 진행 화면이에요
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl border border-line-strong bg-white/50 px-4 py-3 text-[12.5px] leading-relaxed text-muted",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-sage-deep" strokeWidth={1.75} aria-hidden />
      <p>
        <strong className="font-medium text-charcoal-soft">샘플 결과</strong> — 가상의 샘플 제품과 규칙 기반 Mock 분석으로
        만든 화면이에요. 실제 AI 분석이나 검증된 성분 데이터가 아니며, 제품 · 브랜드도 실재하지 않아요.
      </p>
    </div>
  );
}

/** 카드 위 작은 "Sample" 표시 */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-ivory/85 px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-charcoal-soft uppercase backdrop-blur",
        className,
      )}
    >
      Sample
    </span>
  );
}
