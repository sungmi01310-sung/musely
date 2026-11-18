"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/** 경로별 왼쪽 비주얼 패널 콘텐츠 */
const visuals = {
  login: {
    image: "/images/dropper-shadow.jpg",
    alt: "야자수 그림자가 드리운 앰버 드로퍼 보틀",
    quote: "Welcome back to your ritual.",
    caption: "당신의 피부와 향의 기록이 그대로 기다리고 있어요.",
  },
  signup: {
    image: "/images/serum-botanical.jpg",
    alt: "유칼립투스 잎과 함께 놓인 세럼 드로퍼",
    quote: "Begin with what makes you.",
    caption: "몇 가지 질문으로 시작되는, 오직 당신을 위한 큐레이션.",
  },
} as const;

type AuthLayoutProps = { children: ReactNode };

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const visual = pathname.startsWith("/signup") ? visuals.signup : visuals.login;

  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2 xl:grid-cols-[5fr_6fr]">
      {/* ── 왼쪽: 브랜드 비주얼 (데스크톱 전용) ── */}
      <aside className="sticky top-0 hidden h-dvh flex-col justify-between overflow-hidden bg-lavender p-10 lg:flex xl:p-12">
        <Logo />

        <div className="relative mx-auto aspect-[4/5] h-[min(54vh,560px)] max-w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={visual.image}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-hidden rounded-b-[1.5rem] rounded-t-full bg-lavender-deep"
            >
              <Image
                src={visual.image}
                alt={visual.alt}
                fill
                priority
                sizes="(min-width: 1280px) 30vw, 40vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-h-[7.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={visual.quote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="max-w-md font-serif text-[2.4rem] leading-[1.02] italic tracking-[-0.03em] xl:text-[2.75rem]">
                {visual.quote}
              </p>
              <p className="mt-4 text-[14px] text-charcoal-soft">{visual.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* ── 오른쪽: 폼 영역 ── */}
      <div className="flex min-h-dvh flex-col">
        <header className="flex h-16 items-center justify-between px-5 sm:px-8 lg:h-20 lg:justify-end lg:px-12">
          <span className="lg:hidden">
            <Logo />
          </span>
          <Link
            href="/"
            className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted transition-colors hover:text-charcoal"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} aria-hidden />
            홈으로
          </Link>
        </header>

        <main className="flex flex-1 justify-center px-5 pb-12 pt-6 sm:px-8 sm:pt-10 lg:items-center lg:py-12">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 pb-6 text-[12px] text-subtle lg:justify-end lg:px-12">
          <span>© 2026 musely</span>
          <Link href="/terms" className="hover:text-charcoal">
            이용약관
          </Link>
          <Link href="/privacy" className="font-medium text-muted hover:text-charcoal">
            개인정보처리방침
          </Link>
        </footer>
      </div>
    </div>
  );
}
