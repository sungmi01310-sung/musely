"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

/** 뉴스레터 구독 폼 (STEP 08에서 백엔드와 연결 예정 — 현재는 UI만) */
export function NewsletterForm() {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        이메일 주소
      </label>
      <div className="flex items-center border-b border-charcoal/30 transition-colors focus-within:border-charcoal">
        <input
          id="newsletter-email"
          type="email"
          required
          disabled={done}
          placeholder="이메일 주소를 입력하세요"
          className="h-14 w-full bg-transparent text-[15px] placeholder:text-subtle focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={done}
          aria-label="구독하기"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-charcoal hover:text-ivory disabled:hover:bg-transparent disabled:hover:text-charcoal"
        >
          {done ? <Check className="size-4" strokeWidth={1.5} /> : <ArrowRight className="size-4" strokeWidth={1.5} />}
        </button>
      </div>
      <p className="mt-3 text-[12px] text-subtle" aria-live="polite">
        {done ? "구독해 주셔서 감사합니다. 첫 번째 레터를 곧 보내드릴게요." : "새로운 성분 이야기와 향의 큐레이션을 한 달에 한 번 보내드려요."}
      </p>
    </form>
  );
}
