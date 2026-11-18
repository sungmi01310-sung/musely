"use client";

import { useId, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  addIngredient,
  AVOID_MAX_COUNT,
  INGREDIENT_MAX_LENGTH,
  isPresetIngredient,
  type AddIngredientResult,
} from "@/lib/profile/ingredients";
import { labelOf } from "@/lib/profile/options";

type IngredientTagInputProps = {
  /** 기피 성분 전체 목록 (기본 항목 코드 + 직접 입력값) */
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  describedBy?: string;
  invalid?: boolean;
};

type Feedback = { tone: "info" | "warn"; text: string } | null;

function feedbackFor(result: AddIngredientResult): Feedback {
  switch (result.status) {
    case "added":
      return { tone: "info", text: `‘${result.value}’을(를) 기피 성분에 추가했어요.` };
    case "preset":
      return { tone: "info", text: `‘${labelOf(result.value)}’은(는) 기본 항목이라 위 목록에서 선택해 두었어요.` };
    case "duplicate":
      return { tone: "warn", text: `‘${labelOf(result.value)}’은(는) 이미 추가된 성분이에요.` };
    case "too_long":
      return { tone: "warn", text: `성분명은 ${INGREDIENT_MAX_LENGTH}자 이내로 입력해 주세요.` };
    case "limit":
      return { tone: "warn", text: `기피 성분은 최대 ${AVOID_MAX_COUNT}개까지 등록할 수 있어요.` };
    case "empty":
      return null;
  }
}

/**
 * 기피 성분 직접 입력 — Enter 또는 쉼표로 칩 추가, 개별 삭제
 * - 공백 · 중복(대소문자/띄어쓰기 무시) 방지
 * - "에탄올" 같은 동의어는 기본 항목(알코올)으로 합침
 * - 한글 IME 조합 중 Enter는 무시 (마지막 글자 중복 방지)
 */
export function IngredientTagInput({
  value,
  onChange,
  label = "직접 입력",
  describedBy,
  invalid,
}: IngredientTagInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const customTags = value.filter((v) => !isPresetIngredient(v));

  /** 여러 개(쉼표 구분)를 한 번에 추가 */
  const commit = (raw: string) => {
    const parts = raw.split(/[,，]/);
    let list = value;
    let last: Feedback = null;
    for (const part of parts) {
      const result = addIngredient(list, part);
      list = result.list;
      last = feedbackFor(result) ?? last;
    }
    if (list !== value) onChange(list);
    setFeedback(last);
    setDraft("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((v) => v !== tag));
    setFeedback({ tone: "info", text: `‘${tag}’을(를) 삭제했어요.` });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return; // IME 조합 중
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // 폼 제출/쉼표 입력 방지
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && customTags.length > 0) {
      remove(customTags[customTags.length - 1]);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (/[,，\n]/.test(text)) {
      e.preventDefault();
      commit(`${draft}${text.replace(/\n/g, ",")}`);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-charcoal-soft">
        {label}
      </label>

      <div
        className={cn(
          "mt-2 flex flex-wrap items-center gap-1.5 rounded-2xl border bg-white/60 p-2 transition-[border-color,box-shadow,background-color] duration-300 focus-within:bg-white",
          invalid
            ? "border-rose-ink/70 focus-within:ring-4 focus-within:ring-rose/30"
            : "border-line-strong focus-within:border-charcoal focus-within:ring-4 focus-within:ring-lavender",
        )}
      >
        <ul className="contents" aria-label="직접 추가한 기피 성분">
          <AnimatePresence initial={false}>
            {customTags.map((tag) => (
              <motion.li
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex h-9 items-center gap-0.5 rounded-full bg-lavender pl-3.5 pr-1 text-[14px] text-charcoal"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  aria-label={`${tag} 삭제`}
                  className="inline-flex size-8 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-charcoal/10 hover:text-charcoal"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          maxLength={INGREDIENT_MAX_LENGTH + 10}
          enterKeyHint="done"
          autoComplete="off"
          placeholder={customTags.length ? "성분 추가" : "예) 실리콘, 라놀린"}
          aria-describedby={[hintId, describedBy].filter(Boolean).join(" ")}
          className="h-9 min-w-[8rem] flex-1 bg-transparent px-2 text-base text-charcoal placeholder:text-subtle focus-visible:outline-none sm:text-[15px]"
        />
        <button
          type="button"
          onClick={() => commit(draft)}
          disabled={!draft.trim()}
          className="inline-flex h-9 items-center gap-1 rounded-full bg-charcoal px-3.5 text-[13px] font-medium text-ivory transition-opacity disabled:opacity-25"
        >
          <Plus className="size-3.5" strokeWidth={2} aria-hidden />
          추가
        </button>
      </div>

      <p id={hintId} className="mt-2 text-[12px] text-subtle">
        성분명을 입력하고 <kbd className="font-sans font-medium text-muted">Enter</kbd> 또는{" "}
        <kbd className="font-sans font-medium text-muted">,</kbd>를 누르면 추가돼요.
      </p>
      <p
        aria-live="polite"
        className={cn(
          "min-h-[1.25rem] pt-1 text-[12.5px] transition-colors",
          feedback?.tone === "warn" ? "text-rose-ink" : "text-sage-deep",
        )}
      >
        {feedback?.text}
      </p>
    </div>
  );
}
