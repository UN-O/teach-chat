import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow, H1, H2 } from "@/components/ui/typography";
import { howToUseText } from "@/data/text";

export default function HowToUsePage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Eyebrow className="text-secondary">
            {howToUseText.eyebrow}
          </Eyebrow>
          <H1 className="text-primary">
            {howToUseText.h1}
          </H1>
          <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
            {howToUseText.intro}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 md:px-16 py-16 bg-surface">
        <div className="max-w-6xl mx-auto space-y-20">
          {howToUseText.steps.map((step, i) => (
            <div
              key={step.num}
              className={`grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center ${
                i % 2 !== 0 ? "md:[direction:rtl] [direction:ltr]" : ""
              }`}
            >
              <div className={`space-y-4 ${i % 2 !== 0 ? "md:[direction:ltr]" : ""}`}>
                <span className="font-en text-6xl font-bold text-background select-none leading-none">
                  {step.num}
                </span>
                <H2 className="text-primary">
                  {step.h3}
                </H2>
                <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[50ch]">
                  {step.body}
                </p>
              </div>
              <div className={i % 2 !== 0 ? "md:[direction:ltr]" : ""}>
                <img
                  src={`/images/how-to-use-step-${i + 1}.jpeg`}
                  alt={`步驟 ${step.num}：${step.h3}`}
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshot Notice */}
      <section className="px-6 md:px-16 py-12 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <p className="font-body text-sm leading-[1.7] text-muted max-w-[55ch]">
              {howToUseText.screenshotNotice}
            </p>
            <Button variant="deep" asChild className="shrink-0">
              <Link href="/scenario">{howToUseText.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
