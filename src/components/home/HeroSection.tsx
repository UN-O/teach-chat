import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeText, siteText } from "@/data/text";

export function HeroSection() {
  return (
    <section className="px-6 md:px-16 pt-20 pb-24 bg-[var(--color-background)] overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="md:hidden pb-36">
          <div className="relative w-full max-w-[420px] mx-auto animate-editorial-in">
            <img
              src="/images/hero-teacher.svg"
              alt="年輕老師坐在書桌前看著手機，暖色系插畫"
              className="block h-auto w-full aspect-[4/5] object-contain"
            />
            <div className="absolute -inset-x-3 sm:inset-x-0 -bottom-30 rounded-xl bg-white border border-[var(--color-muted)] px-6 py-8">
              <p className="font-[var(--font-en)] text-[11px] font-medium tracking-widest uppercase text-[var(--color-secondary)] mb-3">
                {homeText.hero.eyebrow}
              </p>
              <h1 className="font-[var(--font-display)] text-[clamp(2rem,9vw,2.7rem)] font-bold leading-[1.06] text-[var(--color-primary)]">
                <span className="block">{siteText.siteName}</span>
                <span className="mt-2 block font-[var(--font-en)] text-[11px] font-medium tracking-[0.16em] uppercase text-[var(--color-secondary)]">
                  {siteText.siteTagline}
                </span>
              </h1>
              <p className="mt-5 font-[var(--font-body)] text-sm leading-[1.8] text-[var(--color-primary)]">
                {homeText.hero.subtitle}
              </p>
              <div className="mt-6 grid items-center gap-3">
                <Button asChild>
                  <Link href="/scenario">{homeText.hero.ctaPrimary}</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#intro">{homeText.hero.ctaSecondary}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden md:block lg:min-h-[620px]">
          <div className="relative z-20 max-w-3xl lg:max-w-2xl lg:pr-[22%] md:pt-8 stagger">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)] mb-6">
              {homeText.hero.eyebrow}
            </p>
            <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,8vw,5.25rem)] font-bold leading-[1.05] text-[var(--color-primary)]">
              <span className="block">{siteText.siteName}</span>
              <span className="mt-3 block font-[var(--font-en)] text-sm md:text-base font-medium tracking-[0.18em] uppercase text-[var(--color-secondary)]">
                {siteText.siteTagline}
              </span>
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
          <div
            className="pointer-events-none relative z-10 mt-10 mx-auto w-full max-w-none aspect-[8/5] overflow-hidden md:w-full lg:mx-0 lg:ml-auto lg:mt-0 lg:w-[38%] lg:max-w-[430px] lg:aspect-[4/5] lg:overflow-visible lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 animate-editorial-in"
            style={{ animationDelay: "220ms" }}
          >
            <img
              src="/images/hero-teacher.svg"
              alt="年輕老師坐在書桌前看著手機，暖色系插畫"
              className="h-full w-full object-cover object-top lg:object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
