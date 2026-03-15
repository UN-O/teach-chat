import { Eyebrow, H2 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function OriginSection() {
  return (
    <section className="py-24 bg-surface">
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
            <Eyebrow className="text-secondary">
              {homeText.origin.eyebrow}
            </Eyebrow>
            <H2 size="lg" className="text-primary">
              {homeText.origin.h2}
            </H2>
            <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[55ch]">
              {homeText.origin.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
