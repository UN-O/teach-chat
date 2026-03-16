import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow, H2, H3 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function IntroSection() {
  const { intro } = homeText;

  return (
    <section id="intro" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 space-y-4">
          <Eyebrow className="text-secondary">{intro.eyebrow}</Eyebrow>
          <H2 size="xl" className="text-primary">
            {intro.h2}
          </H2>
          <p className="font-body text-base leading-[1.7] text-primary/70 max-w-[60ch]">
            {intro.subtitle}
          </p>
        </div>

        {/* Row 1: [3fr 2fr] — Feature 01 (dark, large) + Feature 02 (light) */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 mb-6">
          {/* Card 01: Immersive Scenario Training */}
          <div className="bg-secondary rounded-xl p-8 space-y-4 shadow-md hover:shadow-lifted hover:-translate-y-0.5 transition-shadow transition-transform duration-200">
            <Eyebrow className="text-white/50">{intro.scenario.eyebrow}</Eyebrow>
            <H3 size="xl" className="text-white">
              {intro.scenario.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-white/70">
              {intro.scenario.body}
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-2">
              <Link href="/scenario">{intro.scenario.cta}</Link>
            </Button>
          </div>

          {/* Card 02: AI PAD Emotion Model */}
          <div className="bg-white rounded-xl p-8 space-y-4 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-shadow transition-transform duration-200">
            <Eyebrow className="text-muted">{intro.pad.eyebrow}</Eyebrow>
            <H3 size="xl" className="text-primary">
              {intro.pad.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-primary/70">
              {intro.pad.body}
            </p>
          </div>
        </div>

        {/* Row 2: [2fr 3fr] — Feature 03 (light) + Feature 04 (dark, large) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6">
          {/* Card 03: 18-Technique Scoring & Radar Chart */}
          <div className="bg-white rounded-xl p-8 space-y-4 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-shadow transition-transform duration-200">
            <Eyebrow className="text-muted">{intro.scoring.eyebrow}</Eyebrow>
            <H3 size="xl" className="text-primary">
              {intro.scoring.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-primary/70">
              {intro.scoring.body}
            </p>
          </div>

          {/* Card 04: Message Polish Tool */}
          <div className="bg-primary rounded-xl p-8 space-y-4 shadow-md hover:shadow-lifted hover:-translate-y-0.5 transition-shadow transition-transform duration-200">
            <Eyebrow className="text-white/50">{intro.polish.eyebrow}</Eyebrow>
            <H3 size="xl" className="text-white">
              {intro.polish.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-white/70">
              {intro.polish.body}
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-2">
              <Link href="/polish-text">{intro.polish.cta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
