import Link from "next/link";
import { footerNav } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "./NewsletterForm";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-ivory-deep pt-20 sm:pt-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-subtle">musely letter</p>
            <p className="mt-5 max-w-sm text-2xl font-light leading-snug tracking-[-0.03em] sm:text-[1.75rem]">
              피부와 향에 관한 <span className="font-serif text-[1.15em] italic">slow</span> 이야기를 받아보세요.
            </p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="푸터 메뉴" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7 lg:col-start-6">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="font-serif text-lg italic">{group.title}</p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="link-underline text-[14px] text-muted hover:text-charcoal">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="font-serif text-lg italic">Follow</p>
              <ul className="mt-5 space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-[14px] text-muted hover:text-charcoal"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line-strong py-6 text-[12px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 musely. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-charcoal">이용약관</Link>
            <Link href="/privacy" className="font-medium text-muted hover:text-charcoal">개인정보처리방침</Link>
            <span>AI 추천은 참고용이며, 피부 질환은 전문의와 상담하세요.</span>
          </div>
        </div>
      </Container>

      {/* 초대형 워드마크 */}
      <div aria-hidden className="pointer-events-none select-none">
        <p className="text-center whitespace-nowrap font-serif text-[30vw] leading-[0.72] font-light tracking-[-0.06em] text-charcoal/[0.06]">
          musely
        </p>
      </div>
    </footer>
  );
}
