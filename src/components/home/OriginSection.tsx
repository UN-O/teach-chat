import { homeText } from "@/data/text";

export function OriginSection() {
  return (
    <section className="py-24 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-16 items-center">
          <div>
            <img
              src="/images/origin-team.webp"
              alt="AI創新教育工學圈圈團隊合照"
              className="w-full h-auto object-contain mix-blend-multiply rounded-xl"
            />
          </div>
          <div className="space-y-6">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
              {homeText.origin.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold leading-[1.2] text-[var(--color-primary)]">
              {homeText.origin.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[55ch]">
              {homeText.origin.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
