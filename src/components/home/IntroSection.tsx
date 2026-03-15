import { Eyebrow, H2, H3 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function IntroSection() {
  return (
    <section id="intro" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 space-y-4">
          <Eyebrow className="text-secondary">
            {homeText.intro.eyebrow}
          </Eyebrow>
          <H2 size="xl" className="text-primary">
            {homeText.intro.h2}
          </H2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-xl p-8 space-y-3 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Eyebrow className="text-muted">
              {homeText.intro.scenario.eyebrow}
            </Eyebrow>
            <img
              src="/images/feature-chat.svg"
              alt="情境訓練聊天室截圖"
              className="w-full h-auto object-contain mix-blend-multiply rounded-lg overflow-hidden"
            />
            <H3 size="xl" className="text-primary">
              {homeText.intro.scenario.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-primary/70">
              {homeText.intro.scenario.body}
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-secondary rounded-xl p-8 space-y-3 shadow-md hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-200">
            <Eyebrow className="text-white/50">
              {homeText.intro.polish.eyebrow}
            </Eyebrow>
            <img
              src="/images/feature-polish.svg"
              alt="訊息潤飾功能截圖"
              className="w-full h-auto object-contain rounded-lg overflow-hidden"
            />
            <H3 size="xl" className="text-white">
              {homeText.intro.polish.h3}
            </H3>
            <p className="font-body text-sm leading-[1.7] text-white/70">
              {homeText.intro.polish.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
