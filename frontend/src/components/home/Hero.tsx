"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/Card";

const ease = [0.22, 1, 0.36, 1] as const;

const headline = [
  [
    { text: "Beauty", italic: false },
    { text: "that", italic: true },
  ],
  [
    { text: "knows", italic: false },
    { text: "you.", italic: true },
  ],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // 레이어별로 다른 속도의 패럴랙스
  const yMain = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const ySide = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const scaleMain = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  return (
    <section ref={ref} className="relative overflow-x-clip pb-20 pt-8 sm:pt-12 lg:pb-28 lg:pt-10">
      {/* 부드러운 컬러 블롭 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 -z-10">
        <div className="absolute -right-40 -top-40 size-[640px] rounded-full bg-lavender blur-[120px]" />
        <div className="absolute -left-32 top-1/3 size-[420px] rounded-full bg-rose/40 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 size-[360px] rounded-full bg-sage/20 blur-[120px]" />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* ── 카피 ─────────────────────────────── */}
        <div className="relative z-10 lg:col-span-6 xl:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-ivory/60 px-3.5 py-2 text-charcoal-soft backdrop-blur"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            AI Beauty &amp; Fragrance Curation
          </motion.p>

          <h1 className="mt-8 font-serif text-[3.6rem] min-[400px]:text-[4.1rem] leading-[0.9] tracking-[-0.045em] sm:text-[6rem] lg:text-[6.4rem] xl:text-[7.4rem]">
            <span className="sr-only">Beauty that knows you. </span>
            {headline.map((line, li) => (
              <span key={li} aria-hidden className="block">
                {line.map((word, wi) => (
                  <span key={word.text} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1.2, delay: 0.15 + (li * 2 + wi) * 0.09, ease }}
                      className={
                        word.italic
                          ? "inline-block pr-[0.2em] font-light italic text-rose-ink"
                          : "inline-block pr-[0.2em]"
                      }
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="mt-8 max-w-[29rem] text-[16px] leading-[1.85] text-muted sm:text-[17px]"
          >
            피부 타입과 고민, 피하고 싶은 성분과 지금 쓰는 성분, 좋아하는 향까지.
            musely의 AI가 당신의 결을 읽고, 꼭 맞는 화장품과 향수를{" "}
            <strong className="font-medium text-charcoal">이유와 함께</strong> 제안합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <Button href="/#start" size="lg" arrow>
              나만의 추천 받기
            </Button>
            <Button href="/#how" variant="link">
              어떻게 추천하나요?
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="mt-14 grid max-w-md grid-cols-3 border-t border-charcoal/10 pt-6"
          >
            {[
              ["5", "가지 분석 요소"],
              ["3", "분이면 충분한 진단"],
              ["100%", "추천 근거 공개"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-3xl leading-none">{num}</dd>
                <dd className="mt-2 text-[12px] text-subtle">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ── 비주얼 콜라주 ─────────────────────── */}
        <div className="relative lg:col-span-6 xl:col-span-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:aspect-[5/5.4] lg:ml-auto lg:mr-0 lg:max-w-none xl:aspect-[7/6.4]">
            {/* 메인 아치 이미지 */}
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 24px 24px)" }}
              animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 24px 24px)" }}
              transition={{ duration: 1.6, delay: 0.2, ease }}
              style={{ y: yMain }}
              className="absolute right-0 top-0 h-[88%] w-[72%] overflow-hidden rounded-b-3xl rounded-t-full bg-rose xl:w-[58%]"
            >
              <motion.div style={{ scale: scaleMain }} className="absolute inset-0">
                <Image
                  src="/images/hero-portrait.jpg"
                  alt="자연스러운 피부결의 모델 포트레이트"
                  fill
                  priority
                  sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 36vw, 72vw"
                  className="object-cover object-[50%_30%]"
                />
              </motion.div>
            </motion.div>

            {/* 서브 이미지 — 향수 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.55, ease }}
              style={{ y: ySide }}
              className="absolute bottom-[24%] left-0 h-[40%] w-[40%] sm:bottom-[4%] sm:h-[46%] sm:w-[42%] overflow-hidden rounded-[1.5rem] border-[6px] border-ivory bg-ivory-deep shadow-[0_30px_60px_-30px_rgba(37,35,32,0.4)] xl:left-[6%] xl:w-[34%]"
            >
              <Image
                src="/images/fragrance-clear.jpg"
                alt="자연광 아래 놓인 투명한 향수 보틀"
                fill
                sizes="(min-width: 1024px) 20vw, 42vw"
                className="object-cover"
              />
            </motion.div>

            {/* 서브 이미지 — 세럼 (데스크톱) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.75, ease }}
              className="absolute left-[10%] top-[6%] hidden aspect-square w-[22%] overflow-hidden rounded-full border-[5px] border-ivory xl:block"
            >
              <Image
                src="/images/serum-marble.jpg"
                alt="마블 위의 화이트 세럼 보틀"
                fill
                sizes="16vw"
                className="object-cover"
              />
            </motion.div>

            {/* 플로팅 추천 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.05, ease }}
              style={{ y: yCard }}
              className="absolute -bottom-6 right-[-2%] w-[78%] max-w-[330px] sm:right-[4%] lg:bottom-[8%] lg:right-[-2%]"
            >
              <div className="animate-float">
                <p className="eyebrow mb-2.5 ml-1 flex items-center gap-2 text-charcoal-soft">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-deep opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-sage-deep" />
                  </span>
                  Your match
                </p>
                <ProductCard
                  image="/images/serum-marble.jpg"
                  brand="Atelier Calme"
                  category="Serum"
                  name="카밍 배리어 세럼"
                  match={96}
                  tags={["민감성", "무향료", "세라마이드"]}
                />
              </div>
            </motion.div>

            {/* 향 노트 칩 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 1.2, ease }}
              className="absolute right-[56%] top-[44%] hidden sm:block xl:right-[52%]"
            >
              <div className="animate-float-slow rounded-full border border-white/70 bg-ivory/75 px-4 py-2.5 text-[12px] shadow-[0_18px_40px_-20px_rgba(37,35,32,0.35)] backdrop-blur-xl">
                <span className="font-serif text-[15px] italic">Notes</span>
                <span className="mx-2 text-subtle">·</span>
                아이리스 · 화이트 머스크
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
