"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ban, Droplet, FlaskConical, Flower2, Plus, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const factors = [
  {
    en: "Skin Type",
    title: "피부 타입",
    icon: Droplet,
    description: "유수분 밸런스와 민감도를 기준으로 피부의 기본 결을 파악해요.",
    chips: ["건성", "지성", "복합성", "중성", "민감성"],
    image: "/images/cream-texture.jpg",
  },
  {
    en: "Concerns",
    title: "피부 고민",
    icon: Target,
    description: "지금 가장 신경 쓰이는 고민에 우선순위를 두고 효능 성분을 매칭해요.",
    chips: ["건조함", "트러블", "홍조", "색소침착", "모공", "탄력"],
    image: "/images/guasha-serum.jpg",
  },
  {
    en: "Avoid List",
    title: "기피 성분",
    icon: Ban,
    description: "맞지 않았던 성분은 처음부터 제외해요. 추천 목록에 절대 섞이지 않습니다.",
    chips: ["인공 향료", "에탄올", "파라벤", "에센셜 오일", "실리콘"],
    image: "/images/balm-light.jpg",
  },
  {
    en: "Current Actives",
    title: "사용 중인 성분",
    icon: FlaskConical,
    description: "이미 쓰고 있는 액티브 성분과 충돌하지 않도록 조합까지 계산해요.",
    chips: ["레티놀", "비타민 C", "AHA · BHA", "나이아신아마이드", "펩타이드"],
    image: "/images/dropper-shadow.jpg",
  },
  {
    en: "Scent Profile",
    title: "향 취향",
    icon: Flower2,
    description: "좋아하는 향의 계열과 강도, 무드를 바탕으로 향의 지도를 그려요.",
    chips: ["플로럴", "우디", "시트러스", "머스크", "파우더리", "그린"],
    image: "/images/candle-mood.jpg",
  },
];

const reasons = [
  { from: "건성 · 민감성", text: "세라마이드와 판테놀이 장벽을 채워 건조함과 붉은기를 함께 진정시켜요." },
  { from: "기피: 인공 향료, 에탄올", text: "두 성분 모두 포함되지 않은 무향 · 저자극 포뮬러예요." },
  { from: "사용 중: 레티놀", text: "레티놀과 충돌하는 산 성분이 없어 저녁 루틴에 함께 써도 괜찮아요." },
];

export function Personalize() {
  const [active, setActive] = useState(0);

  return (
    <section id="personalize" className="scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* ── 왼쪽: 헤딩 + 추천 리포트 미리보기 ── */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              index="03"
              label="Personalized"
              title={
                <>
                  다섯 가지 결로 읽는, <br />
                  <span className="font-serif italic">오직 당신</span>을 위한 추천
                </>
              }
              description="musely는 단순히 인기 있는 제품을 보여주지 않아요. 다섯 가지 정보를 교차 분석하고, 왜 그 제품인지 근거를 함께 설명합니다."
            />

            <Reveal delay={0.15} className="mt-12">
              <Card variant="surface" className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow flex items-center gap-2 text-subtle">
                    <Sparkles className="size-3.5" strokeWidth={1.5} />
                    AI Report Preview
                  </p>
                  <span className="rounded-full bg-sage/25 px-2.5 py-1 text-[11px] font-medium text-sage-deep">
                    Match 94%
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-ivory-deep">
                    <Image src="/images/serum-marble.jpg" alt="카밍 배리어 세럼" fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[12px] text-subtle">Atelier Calme · Serum · 30ml</p>
                    <p className="mt-1 text-lg font-medium tracking-[-0.02em]">카밍 배리어 세럼</p>
                    <p className="mt-0.5 font-serif text-[15px] italic text-muted">Ceramide NP · Panthenol 5%</p>
                  </div>
                </div>

                <p className="mt-6 text-[13px] font-semibold">왜 추천했나요?</p>
                <ol className="mt-3 space-y-3">
                  {reasons.map((r, i) => (
                    <li key={r.from} className="flex gap-3 border-t border-line pt-3">
                      <span className="font-serif text-[15px] italic text-rose-ink">0{i + 1}</span>
                      <div>
                        <p className="text-[12px] font-medium text-charcoal-soft">{r.from}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{r.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* ── 오른쪽: 분석 요소 아코디언 ── */}
        <div className="lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-charcoal/15">
            {factors.map((f, i) => {
              const open = active === i;
              const Icon = f.icon;
              return (
                <Reveal as="li" key={f.title} delay={i * 0.06} className="border-b border-charcoal/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setActive(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`factor-${i}`}
                      className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-7"
                    >
                      <span className="w-8 font-serif text-base italic text-subtle">0{i + 1}</span>
                      <span className="flex-1">
                        <span className="block font-serif text-[15px] italic text-muted">{f.en}</span>
                        <span
                          className={cn(
                            "mt-1 block text-[1.6rem] font-light tracking-[-0.035em] transition-colors duration-500 sm:text-[2rem]",
                            open ? "text-charcoal" : "text-charcoal/55 group-hover:text-charcoal",
                          )}
                        >
                          {f.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-editorial",
                          open ? "rotate-45 border-charcoal bg-charcoal text-ivory" : "border-charcoal/20",
                        )}
                      >
                        <Plus className="size-4" strokeWidth={1.5} />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`factor-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-8 sm:grid-cols-[1fr_160px] sm:pl-16">
                          <div>
                            <p className="flex items-start gap-2.5 text-[15px] leading-[1.8] text-muted">
                              <Icon className="mt-1 size-4 shrink-0 text-sage-deep" strokeWidth={1.5} />
                              {f.description}
                            </p>
                            <ul className="mt-5 flex flex-wrap gap-2">
                              {f.chips.map((chip) => (
                                <li
                                  key={chip}
                                  className="rounded-full border border-charcoal/15 bg-white/60 px-3.5 py-1.5 text-[13px] text-charcoal-soft"
                                >
                                  {chip}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl sm:block">
                            <Image src={f.image} alt="" fill sizes="160px" className="object-cover" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
