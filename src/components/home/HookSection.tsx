import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeText } from "@/data/text";

export function HookSection() {
  return (
    <section className="bg-[var(--color-surface)]">
      {/* Scenario block */}
      <div className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-16 items-center">
          <div>
            <img
              src="/images/hook-phone.svg"
              alt="老師手握手機，家長 LINE 訊息涌現"
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-6">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
              {homeText.hook.scenario.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold leading-[1.2] text-[var(--color-primary)]">
              {homeText.hook.scenario.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[55ch]">
              {homeText.hook.scenario.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="accent" size="sm" asChild>
                <Link href="/scenario/studentfeud">{homeText.hook.scenario.ctaFight}</Link>
              </Button>
              <Button variant="deep" size="sm" asChild>
                <Link href="/scenario/disorder">{homeText.hook.scenario.ctaDisorder}</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/scenario">{homeText.hook.scenario.ctaMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-[var(--color-muted)] opacity-20 mx-6 md:mx-16" />

      {/* Polish block */}
      <div className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
              {homeText.hook.polish.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold leading-[1.2] text-[var(--color-primary)]">
              {homeText.hook.polish.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[55ch]">
              {homeText.hook.polish.body}
            </p>
            <Button variant="secondary" asChild>
              <Link href="/polishtext">{homeText.hook.polish.cta}</Link>
            </Button>
          </div>
          <div>
            <img
              src="/images/feature-polish.svg"
              alt="訊息潤飾 Before/After 對比示意"
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
