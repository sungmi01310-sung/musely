import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal">
          <Image
            src="/images/dropper-shadow.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-[50%_40%] opacity-90"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/85 via-charcoal/50 to-charcoal/10" />

          <div className="flex min-h-[520px] flex-col justify-end p-7 text-ivory sm:min-h-[580px] sm:p-12 lg:p-16">
            <Reveal>
              <p className="eyebrow text-ivory/70">Find your formula</p>
              <h2 className="mt-6 max-w-2xl font-serif text-[3.2rem] leading-[0.95] tracking-[-0.04em] sm:text-[5rem] lg:text-[6rem]">
                Your skin. <br />
                <span className="italic text-rose">Your scent.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-ivory/80 sm:text-base">
                몇 가지 질문이면 충분합니다. 지금 당신의 피부와 향을 들려주세요.
                musely가 꼭 맞는 한 병을 찾아드릴게요.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/#start" variant="light" size="lg" arrow>
                  무료로 추천받기
                </Button>
                <Button
                  href="/login"
                  size="lg"
                  className="border border-ivory/30 bg-transparent before:bg-ivory hover:text-charcoal"
                >
                  이미 계정이 있어요
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
