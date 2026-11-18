"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { focusOptions, type FocusId } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FocusSelector() {
  const [selected, setSelected] = useState<FocusId>("both");
  const current = focusOptions.find((o) => o.id === selected)!;

  return (
    <section id="start" className="relative scroll-mt-24 overflow-hidden bg-lavender/60 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-rose/40 blur-[120px]" />
      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="02"
            label="Start here"
            title={
              <>
                오늘, 무엇을 <br />
                <span className="font-serif italic">찾고</span> 계신가요?
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-[15px] leading-[1.8] text-muted">
              하나만 골라도, 둘 다 골라도 좋아요. 선택에 맞춰 꼭 필요한 질문만 드리고, 끝나면 바로 추천 결과를 보여드립니다.
            </p>
          </Reveal>
        </div>

        <div role="radiogroup" aria-label="추천 받을 카테고리" className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {focusOptions.map((option, i) => {
            const active = option.id === selected;
            return (
              <Reveal key={option.id} delay={i * 0.1}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "group relative block w-full overflow-hidden rounded-[1.5rem] text-left transition-[box-shadow,transform] duration-700 ease-editorial",
                    "aspect-[16/11] sm:aspect-[3/4]",
                    active
                      ? "shadow-[0_40px_80px_-40px_rgba(37,35,32,0.55)] ring-1 ring-charcoal"
                      : "ring-1 ring-transparent hover:-translate-y-1",
                  )}
                >
                  <Image
                    src={option.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 32vw, 100vw"
                    className={cn(
                      "object-cover transition-[transform,filter] duration-[1.4s] ease-editorial",
                      active ? "scale-105" : "scale-100 saturate-[0.7] group-hover:scale-105 group-hover:saturate-100",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent transition-opacity duration-700",
                      active ? "opacity-100" : "opacity-80",
                    )}
                  />

                  {/* 선택 인디케이터 */}
                  <span
                    className={cn(
                      "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border transition-all duration-500",
                      active ? "border-ivory bg-ivory text-charcoal" : "border-ivory/60 text-transparent",
                    )}
                  >
                    <Check className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="absolute left-5 top-5 font-serif text-sm italic text-ivory/80">
                    0{i + 1}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 text-ivory sm:p-6">
                    <p className="font-serif text-[2.6rem] leading-none italic tracking-[-0.03em] sm:text-[2.4rem] lg:text-[3rem]">
                      {option.en}
                    </p>
                    <p className="mt-2 text-lg font-medium">{option.label}</p>
                    <p
                      className={cn(
                        "mt-2 max-w-xs text-[13px] leading-relaxed text-ivory/80 transition-all duration-700 ease-editorial",
                        "sm:max-h-0 sm:opacity-0",
                        active && "sm:max-h-24 sm:opacity-100",
                      )}
                    >
                      {option.description}
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* 선택 요약 + CTA */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-6 rounded-[1.5rem] border border-white/70 bg-ivory/70 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-5">
              <div className="hidden size-14 items-center justify-center rounded-full bg-charcoal font-serif text-xl italic text-ivory sm:flex">
                m
              </div>
              <div aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="text-[17px] font-medium tracking-[-0.02em]">
                      <span className="font-serif text-xl italic">{current.en}</span>
                      <span className="mx-2 text-subtle">—</span>
                      {current.label} 추천을 시작할게요
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
                      <Clock className="size-3.5" strokeWidth={1.5} />
                      {current.duration} 소요 · 로그인 후 결과가 히스토리에 저장돼요
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <Button href={current.href} size="lg" arrow className="w-full sm:w-auto">
              추천받기
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
