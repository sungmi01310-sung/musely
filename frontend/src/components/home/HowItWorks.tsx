import { ClipboardList, History, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: UserRound,
    en: "Join",
    title: "계정 만들기",
    description: "이메일로 간단히 가입하세요. 추천 결과와 프로필이 안전하게 저장됩니다.",
  },
  {
    icon: ClipboardList,
    en: "Profile",
    title: "피부 · 향 프로필 작성",
    description: "피부 타입과 고민, 기피 · 사용 중인 성분, 좋아하는 향을 차례로 선택해요.",
  },
  {
    icon: Sparkles,
    en: "Analyze",
    title: "AI 분석 & 맞춤 추천",
    description: "AI가 성분과 향 데이터를 교차 분석해 꼭 맞는 제품을 이유와 함께 추천해요.",
  },
  {
    icon: History,
    en: "Revisit",
    title: "히스토리로 다시 보기",
    description: "지난 추천을 비교하고, 피부가 달라지면 언제든 프로필을 고쳐 다시 추천받아요.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-ivory-deep py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            label="How it works"
            title={
              <>
                네 단계면 충분해요, <br />
                <span className="font-serif italic">simply</span> musely.
              </>
            }
          />
          <Reveal delay={0.1}>
            <Button href="/signup" variant="secondary" arrow>
              지금 시작하기
            </Button>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-line-strong bg-line-strong sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 0.1}
                className="group relative flex min-h-[300px] flex-col bg-ivory-deep p-7 transition-colors duration-700 ease-editorial hover:bg-ivory sm:p-8 lg:min-h-[380px]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-[4.5rem] leading-none font-light tracking-[-0.04em] text-charcoal/15 transition-colors duration-700 group-hover:text-rose-deep">
                    0{i + 1}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full border border-charcoal/15 transition-all duration-700 ease-editorial group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory">
                    <Icon className="size-[18px]" strokeWidth={1.4} />
                  </span>
                </div>
                <div className="mt-auto pt-10">
                  <p className="font-serif text-base italic text-subtle">{step.en}</p>
                  <h3 className="mt-1.5 text-xl font-medium tracking-[-0.025em]">{step.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-muted">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
