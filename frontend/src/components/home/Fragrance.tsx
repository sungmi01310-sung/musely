"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const families = [
  { en: "Floral", ko: "플로럴", note: "로즈 · 자스민 · 피오니", color: "#D8C5CE" },
  { en: "Woody", ko: "우디", note: "샌달우드 · 시더 · 베티버", color: "#9C8B76" },
  { en: "Citrus", ko: "시트러스", note: "베르가못 · 만다린 · 유자", color: "#E3D3A4" },
  { en: "Musk", ko: "머스크", note: "화이트 머스크 · 앰브레트", color: "#EDE5EF" },
  { en: "Powdery", ko: "파우더리", note: "아이리스 · 바이올렛 · 헬리오트로프", color: "#C9BCD6" },
  { en: "Green", ko: "그린", note: "무화과 잎 · 바질 · 갈바넘", color: "#A4A998" },
];

export function Fragrance() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const ySmall = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section
      ref={ref}
      id="fragrance"
      className="relative scroll-mt-24 overflow-hidden bg-charcoal py-24 text-ivory sm:py-32 lg:py-40"
    >
      <div aria-hidden className="pointer-events-none absolute -right-48 top-0 size-[560px] rounded-full bg-rose-deep/20 blur-[140px]" />
      <Container className="relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* 이미지 */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] max-w-[520px] lg:mx-0">
            <motion.div
              style={{ y: yBig }}
              className="absolute inset-y-0 left-0 w-[80%] overflow-hidden rounded-t-full rounded-b-[1.5rem]"
            >
              <Image
                src="/images/fragrance-amber.jpg"
                alt="빛을 머금은 앰버 컬러 향수 보틀"
                fill
                sizes="(min-width: 1024px) 34vw, 80vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: ySmall }}
              className="absolute -right-2 bottom-[8%] w-[42%] overflow-hidden rounded-[1.25rem] border-[6px] border-charcoal sm:right-0"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/candle-mood.jpg"
                  alt="캔들 불빛과 드라이 플라워"
                  fill
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
            <p className="absolute -left-1 top-[12%] origin-left -rotate-90 translate-y-full font-serif text-sm italic text-ivory/40 max-lg:hidden">
              Scent Curation — Vol. 01
            </p>
          </div>
        </div>

        {/* 카피 */}
        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <SectionHeading
            tone="light"
            index="04"
            label="Scent Curation"
            title={
              <>
                <span className="font-serif text-[1.25em] italic leading-none">A scent is a memory</span>
                <br />
                <span className="font-serif text-[1.25em] italic leading-none text-rose">you wear.</span>
              </>
            }
            description="향은 피부 위에서 완성됩니다. musely는 좋아하는 향의 계열과 무드, 그리고 당신의 피부 컨디션까지 고려해 하루 종일 기분 좋게 머무를 향을 찾아드려요."
          />

          <ul className="mt-12 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {families.map((f, i) => (
              <Reveal as="li" key={f.en} delay={i * 0.06} className="group border-t border-ivory/15 py-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2.5 rounded-full transition-transform duration-500 group-hover:scale-150"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="font-serif text-xl italic">{f.en}</span>
                </div>
                <p className="mt-1.5 text-[13px] text-ivory/90">{f.ko}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ivory/50">{f.note}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-10">
            <Button href="/profile/fragrance" variant="light" size="lg" arrow>
              향 취향 찾기
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
