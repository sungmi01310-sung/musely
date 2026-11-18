"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모바일 메뉴가 열려 있을 때 배경 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* 상단 공지 바 */}
      <div className="relative z-40 bg-charcoal text-ivory">
        <p className="mx-auto flex h-9 max-w-[1440px] items-center justify-center gap-2 px-5 text-center text-[12px] tracking-[0.01em] text-ivory/80">
          <span className="hidden sm:inline">New —</span>
          AI가 추천 이유까지 설명하는 맞춤 뷰티 큐레이션, 지금 무료로 시작하세요
        </p>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-editorial",
          scrolled || open
            ? "border-b border-line/80 bg-ivory/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[72px] lg:px-12">
          <Logo />

          <nav aria-label="주요 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-[14px] text-charcoal-soft transition-colors hover:text-charcoal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden px-3 text-[14px] text-charcoal-soft transition-colors hover:text-charcoal sm:inline-flex"
            >
              로그인
            </Link>
            <Button href="/#start" size="sm" className="hidden sm:inline-flex">
              추천받기
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              className="relative -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-charcoal transition-transform duration-500 ease-editorial",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-charcoal transition-transform duration-500 ease-editorial",
                    open && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 전체화면 메뉴 */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ivory px-5 pb-10 pt-32 sm:px-8 lg:hidden"
          >
            <nav aria-label="모바일 메뉴" className="flex-1">
              <ul className="flex flex-col">
                {mainNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="text-[1.65rem] font-light tracking-[-0.03em]">{item.label}</span>
                      <span className="font-serif text-sm italic text-subtle">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              <Button href="/login" variant="secondary" size="lg" onClick={() => setOpen(false)}>
                로그인
              </Button>
              <Button href="/#start" size="lg" onClick={() => setOpen(false)}>
                추천받기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
