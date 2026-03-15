import { Button } from "@/components/ui/button";
import Link from "next/link";
import { techniqueText } from "@/data/text";

export default function TechniquePage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
            {techniqueText.eyebrow}
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold leading-[1.1] text-[var(--color-primary)]">
            {techniqueText.h1}
          </h1>
          <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[65ch]">
            {techniqueText.intro}
          </p>
        </div>
      </section>

      {/* Platform Tips */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] space-y-4">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
              {techniqueText.platform.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold leading-snug text-[var(--color-primary)]">
              {techniqueText.platform.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[65ch]">
              {techniqueText.platform.body}
            </p>
          </div>
        </div>
      </section>

      {/* Core Techniques */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
              Core Skills
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-bold leading-snug text-[var(--color-primary)]">
              {techniqueText.coreTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger">
            {techniqueText.techniques.map((technique) => (
              <div
                key={technique.code}
                className={`rounded-xl p-8 space-y-3 transition-all duration-200 ${
                  technique.comingSoon
                    ? "bg-[var(--color-background)] border border-[var(--color-muted)]/20"
                    : "bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
                }`}
              >
                <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
                  {technique.eyebrow}
                </p>
                <h3 className="font-[var(--font-display)] text-xl font-medium leading-snug text-[var(--color-primary)]">
                  {technique.h3}
                </h3>
                {technique.comingSoon ? (
                  <p className="font-[var(--font-body)] text-sm leading-[1.7] text-[var(--color-muted)] italic">
                    文章撰寫中，敬請期待...
                  </p>
                ) : (
                  <p className="font-[var(--font-body)] text-sm leading-[1.7] text-[var(--color-primary)]/70">
                    {technique.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <Button variant="deep" asChild>
              <Link href="/scenario">去情境練習運用這些技巧</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
