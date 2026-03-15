import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeText } from "@/data/text";

export function HeroSection() {
  return (
    <section className="px-6 md:px-16 pt-20 pb-24 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">
          <div className="stagger">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)] mb-6">
              {homeText.hero.eyebrow}
            </p>
            <h1 className="font-[var(--font-display)] text-6xl md:text-7xl font-bold leading-[1.1] text-[var(--color-primary)]">
              {homeText.hero.h1Line1}
              <br />
              <span className="text-[var(--color-secondary)]">{homeText.hero.h1Line2}</span>
            </h1>
            <p className="font-[var(--font-body)] mt-8 text-base leading-[1.7] text-[var(--color-primary)] max-w-[60ch]">
              {homeText.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild>
                <Link href="/scenario">{homeText.hero.ctaPrimary}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="#intro">{homeText.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
          <div className="animate-editorial-in" style={{ animationDelay: "200ms" }}>
            <img
              src="/images/hero-teacher.svg"
              alt="年輕老師坐在書桌前看著手機，暖色系插畫"
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
