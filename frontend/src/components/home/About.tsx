import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { EditorialCard } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function InlineImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <span
      className={`relative mx-2 inline-block h-[0.82em] w-[1.7em] overflow-hidden rounded-full align-[-0.08em] sm:mx-3 ${className ?? ""}`}
    >
      <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
    </span>
  );
}

const services = [
  {
    index: "i.",
    eyebrow: "Skin Analysis",
    title: "피부를 읽는 분석",
    description:
      "피부 타입과 고민, 피하고 싶은 성분과 이미 쓰고 있는 성분까지 함께 살펴, 충돌 없이 잘 맞는 스킨케어를 골라냅니다.",
    image: "/images/serum-botanical.jpg",
    imageAlt: "유칼립투스 잎과 함께 놓인 세럼 드로퍼",
  },
  {
    index: "ii.",
    eyebrow: "Scent Profiling",
    title: "향의 기억을 담는 프로파일",
    description:
      "좋아하는 향의 계열과 무드, 계절과 상황을 바탕으로 당신의 취향을 지도처럼 그리고, 그 위에 어울리는 향수를 놓습니다.",
    image: "/images/candle-mood.jpg",
    imageAlt: "따뜻한 불빛의 캔들과 드라이 플라워",
  },
  {
    index: "iii.",
    eyebrow: "Explainable Picks",
    title: "이유가 있는 추천",
    description:
      "왜 이 제품인지, 어떤 성분이 내 피부에 맞는지. 모든 추천에는 근거가 함께하고, 히스토리에서 언제든 다시 확인할 수 있어요.",
    image: "/images/ritual-hands.jpg",
    imageAlt: "두 손으로 크림 자를 감싸 쥔 모습",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <Container>
        {/* 매니페스토 */}
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-3 text-subtle">
              <span className="font-serif text-sm normal-case italic tracking-normal">01</span>
              <span className="h-px w-8 bg-charcoal/20" />
              About musely
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-9">
            <p className="text-[1.75rem] leading-[1.45] font-light tracking-[-0.035em] sm:text-[2.4rem] lg:text-[3rem] lg:leading-[1.38]">
              수천 개의 제품
              <InlineImage src="/images/cream-texture.jpg" alt="크림 텍스처" />
              사이에서 나에게 맞는 단 하나를 찾는 일. musely는 피부의 결과
              <InlineImage src="/images/oil-drop.jpg" alt="손등에 떨어지는 오일 한 방울" />
              향의 기억을 함께 읽어,{" "}
              <span className="font-serif text-[1.12em] italic text-rose-ink">가장 개인적인 아름다움</span>을
              큐레이션합니다.
            </p>
          </Reveal>
        </div>

        {/* 서비스 소개 */}
        <div className="mt-24 sm:mt-32">
          <SectionHeading
            index="✦"
            label="What we do"
            title={
              <>
                화장품과 향수, <br className="sm:hidden" />
                하나의 <span className="font-serif italic">ritual</span>로
              </>
            }
            description="musely는 스킨케어와 향수를 따로 고르지 않아요. 당신이라는 한 사람을 기준으로, 피부와 향을 함께 설계합니다."
          />
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12} className={i === 1 ? "lg:mt-20" : i === 2 ? "sm:col-span-2 sm:mx-auto sm:max-w-[calc(50%-1.5rem)] lg:col-span-1 lg:mx-0 lg:max-w-none" : undefined}>
                <EditorialCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
