import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center py-32">
        <Container className="flex flex-col items-center text-center">
          <p className="eyebrow text-subtle">Coming soon</p>
          <h1 className="mt-6 font-serif text-[4rem] leading-none italic tracking-[-0.04em] sm:text-[6rem]">
            In the making.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-muted">
            이 페이지는 아직 준비 중이에요. 다음 단계에서 차례로 공개될 예정입니다.
          </p>
          <Button href="/" className="mt-10" arrow>
            홈으로 돌아가기
          </Button>
        </Container>
      </main>
      <Footer />
    </>
  );
}
