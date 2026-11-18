"use client";

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FlaskConical, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RecommendationFeedbackResponse, RecommendationFeedbackSentiment } from "@/types/recommendation";
import { recommendationAdapter } from "@/lib/recommendation/adapter";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/auth/FormError";

const COMMENT_MAX = 500;

const CHOICES: { value: RecommendationFeedbackSentiment; label: string; Icon: typeof ThumbsUp }[] = [
  { value: "LIKE", label: "추천이 마음에 들어요", Icon: ThumbsUp },
  { value: "DISLIKE", label: "아쉬워요", Icon: ThumbsDown },
];

/** 추천 결과 피드백 — Mock 모드에서는 서버 저장 완료로 가장하지 않음 */
export function RecommendationFeedback({ recommendationId }: { recommendationId: string }) {
  const [sentiment, setSentiment] = useState<RecommendationFeedbackSentiment | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RecommendationFeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const commentId = useId();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sentiment) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await recommendationAdapter.submitFeedback({
        recommendationId,
        sentiment,
        comment: comment.trim() || undefined,
      });
      setResult(res);
    } catch {
      setError("피드백을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="rec-feedback-title" className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-subtle">Feedback</p>
      <h2 id="rec-feedback-title" className="mt-4 text-[1.6rem] font-light tracking-[-0.04em] sm:text-[2rem]">
        이번 추천, <span className="font-serif text-[1.1em] italic">어떠셨나요?</span>
      </h2>
      <p className="mt-3 text-[14px] text-muted">남겨주신 의견은 다음 추천을 더 정확하게 만드는 데 쓰여요.</p>

      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-white/60 px-6 py-6"
          >
            {result.persisted ? (
              <>
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-charcoal text-ivory">
                  <Check className="size-4" strokeWidth={2} aria-hidden />
                </span>
                <p className="mt-4 text-[15px] font-medium">소중한 의견 감사해요.</p>
                <p className="mt-1 text-[13px] text-muted">다음 추천에 반영할게요.</p>
              </>
            ) : (
              <>
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-lavender text-sage-deep">
                  <FlaskConical className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-4 text-[15px] font-medium">의견을 확인했어요.</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  지금은 개발용 Mock 모드라 <strong className="font-medium text-charcoal-soft">서버에 저장되지 않았어요.</strong>
                  <br className="hidden sm:block" /> 서버 연동 후에는 계정에 저장돼요.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-4 inline-flex min-h-11 items-center text-[13px] text-charcoal underline underline-offset-4"
            >
              의견 수정하기
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} className="mt-8">
            <fieldset>
              <legend className="sr-only">추천 만족도</legend>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                {CHOICES.map(({ value, label, Icon }) => {
                  const active = sentiment === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSentiment(active ? null : value)}
                      className={cn(
                        "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border px-7 text-[15px] transition-all duration-500 ease-editorial",
                        active
                          ? "border-charcoal bg-charcoal text-ivory shadow-[0_14px_30px_-16px_rgba(37,35,32,0.7)]"
                          : "border-charcoal/20 text-charcoal hover:border-charcoal",
                      )}
                    >
                      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {sentiment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mx-auto mt-6 max-w-lg text-left">
                    <label htmlFor={commentId} className="text-[13px] text-charcoal-soft">
                      {sentiment === "LIKE" ? "어떤 점이 좋았나요?" : "어떤 점이 아쉬웠나요?"}{" "}
                      <span className="text-subtle">(선택)</span>
                    </label>
                    <textarea
                      id={commentId}
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
                      maxLength={COMMENT_MAX}
                      rows={3}
                      placeholder="예) 향수 추천이 제 취향보다 조금 무거웠어요."
                      className="mt-2 block w-full resize-none rounded-2xl border border-line-strong bg-white/70 px-4 py-3 text-[15px] leading-relaxed placeholder:text-subtle focus:border-charcoal focus:outline-none"
                    />
                    <p className="mt-1.5 text-right text-[12px] tabular-nums text-subtle">
                      {comment.length} / {COMMENT_MAX}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <FormAlert show={!!error} className="mx-auto mt-4 max-w-lg text-left">
              {error}
            </FormAlert>

            <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto sm:min-w-44" disabled={!sentiment} loading={submitting}>
              피드백 보내기
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
