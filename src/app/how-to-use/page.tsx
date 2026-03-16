import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow, H1, H2, H3 } from "@/components/ui/typography";
import { howToUseText } from "@/data/text";

const phaseMeta: Record<string, { label: string; bg: string; text: string }> = {
  "Phase 1": { label: "Phase 1 · 主動告知", bg: "bg-secondary", text: "text-white" },
  "Phase 2": { label: "Phase 2 · 即時互動", bg: "bg-accent",   text: "text-white" },
  Score:     { label: "Score · 技巧評分",   bg: "bg-primary",   text: "text-white" },
  Final:     { label: "Final · 總結建議",   bg: "bg-background", text: "text-secondary" },
};

export default function HowToUsePage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Eyebrow className="text-secondary">{howToUseText.eyebrow}</Eyebrow>
          <H1 className="text-primary">{howToUseText.h1}</H1>
          <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
            {howToUseText.intro}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 md:px-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          {howToUseText.steps.map((step, i) => {
            const flipLayout = i % 2 !== 0;
            const meta = step.phase ? phaseMeta[step.phase] : null;

            return (
              <div key={step.num}>
                <div className={`py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 ${"subImages" in step && step.subImages.length > 0 ? "items-start" : "items-center"}`}>

                  {/* Text side */}
                  <div className={`space-y-5 ${flipLayout ? "md:order-2" : "md:order-1"}`}>
                    {/* Step num + phase badge */}
                    <div className="flex items-center gap-4">
                      <span className="font-en text-5xl font-bold leading-none text-background select-none">
                        {step.num}
                      </span>
                      {meta && (
                        <span className={`w-fit px-3 py-1 rounded-md text-xs font-en font-medium tracking-widest uppercase ${meta.bg} ${meta.text}`}>
                          {meta.label}
                        </span>
                      )}
                    </div>

                    <H2 size="lg" className="text-primary">{step.h3}</H2>

                    <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[50ch]">
                      {step.body}
                    </p>

                    {/* Feature callout cards */}
                    {step.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {step.features.map((f) => (
                          <div key={f.label} className="bg-white rounded-xl p-5 shadow-soft space-y-1.5">
                            <H3 size="xl" weight="medium" className="text-secondary">{f.label}</H3>
                            <p className="font-body text-sm leading-[1.7] text-primary/70">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image side */}
                  <div className={`${flipLayout ? "md:order-1" : "md:order-2"}`}>
                    {"subImages" in step && step.subImages.length > 0 ? (
                      /* Vertical stack for steps with sub-images (e.g. step 04) */
                      <div className="flex flex-col gap-4">
                        {/* Main step image */}
                        <div className="relative bg-background rounded-xl overflow-hidden min-h-[180px]">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="font-en text-xs tracking-widest uppercase text-muted select-none">
                              Step {step.num} Screenshot
                            </p>
                          </div>
                          <img
                            src={`/images/how-to-use-step-${String(i + 1).padStart(2, "0")}.jpeg`}
                            alt={`步驟 ${step.num}：${step.h3}`}
                            className="relative w-full h-auto block"
                          />
                        </div>
                        {/* Sub-images stacked vertically */}
                        {step.subImages.map((img) => (
                          <div key={img.src} className="space-y-2">
                            <div className="relative bg-background rounded-xl overflow-hidden min-h-[180px]">
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="font-en text-xs tracking-widest uppercase text-muted select-none text-center px-2">
                                  {img.label}
                                </p>
                              </div>
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="relative w-full h-auto block"
                              />
                            </div>
                            <p className="font-en text-xs tracking-widest uppercase text-center text-secondary">
                              {img.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Single image for all other steps */
                      <div className="relative bg-background rounded-xl overflow-hidden min-h-[180px]">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="font-en text-xs tracking-widest uppercase text-muted select-none">
                            Step {step.num} Screenshot
                          </p>
                        </div>
                        <img
                          src={`/images/how-to-use-step-${String(i + 1).padStart(2, "0")}.jpeg`}
                          alt={`步驟 ${step.num}：${step.h3}`}
                          className="relative w-full h-auto block"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {i < howToUseText.steps.length - 1 && (
                  <hr className="border-t border-muted opacity-20" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 md:px-16 py-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-secondary rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="space-y-2">
              <Eyebrow className="text-white/50">Ready to start?</Eyebrow>
              <p className="font-display text-xl font-bold text-white leading-snug">
                已經準備好了嗎？選一個情境，開始你的第一次演練。
              </p>
            </div>
            <Button variant="secondary" size="lg" asChild className="shrink-0">
              <Link href="/scenario">{howToUseText.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
