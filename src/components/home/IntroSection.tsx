import { homeText } from "@/data/text";

export function IntroSection() {
  return (
    <section id="intro" className="px-6 md:px-16 py-24 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 space-y-4">
          <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
            {homeText.intro.eyebrow}
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold leading-[1.15] text-[var(--color-primary)]">
            {homeText.intro.h2}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-xl p-8 space-y-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-200">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
              {homeText.intro.scenario.eyebrow}
            </p>
            <img
              src="/images/feature-chat.svg"
              alt="情境訓練聊天室截圖"
              className="w-full h-auto object-contain mix-blend-multiply rounded-lg overflow-hidden"
            />
            <h3 className="font-[var(--font-display)] text-xl font-bold leading-snug text-[var(--color-primary)]">
              {homeText.intro.scenario.h3}
            </h3>
            <p className="font-[var(--font-body)] text-sm leading-[1.7] text-[var(--color-primary)]/70">
              {homeText.intro.scenario.body}
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[var(--color-secondary)] rounded-xl p-8 space-y-3 shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition-all duration-200">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-white/50">
              {homeText.intro.polish.eyebrow}
            </p>
            <img
              src="/images/feature-polish.svg"
              alt="訊息潤飾功能截圖"
              className="w-full h-auto object-contain mix-blend-screen rounded-lg overflow-hidden"
            />
            <h3 className="font-[var(--font-display)] text-xl font-bold leading-snug text-white">
              {homeText.intro.polish.h3}
            </h3>
            <p className="font-[var(--font-body)] text-sm leading-[1.7] text-white/70">
              {homeText.intro.polish.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
