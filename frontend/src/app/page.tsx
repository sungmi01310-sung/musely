import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FocusSelector } from "@/components/home/FocusSelector";
import { Personalize } from "@/components/home/Personalize";
import { Fragrance } from "@/components/home/Fragrance";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FinalCta } from "@/components/home/FinalCta";
import { Marquee } from "@/components/ui/Marquee";

const marqueeItems = [
  "Skin Type",
  "Skin Concerns",
  "Avoided Ingredients",
  "Current Actives",
  "Scent Profile",
  "Explainable AI",
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee items={marqueeItems} className="border-y border-line py-5 text-charcoal-soft" />
        <About />
        <FocusSelector />
        <Personalize />
        <Fragrance />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
