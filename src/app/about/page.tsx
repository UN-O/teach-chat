import { aboutText } from "@/data/text";

const futureVisuals = ["/images/future-2.svg", "/images/future-1.svg"];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
            {aboutText.eyebrow}
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold leading-[1.1] text-[var(--color-primary)]">
            {aboutText.h1}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-start pt-4">
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[65ch]">
              {aboutText.intro}
            </p>
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]">
              <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)] mb-3">
                Team
              </p>
              <p className="font-[var(--font-display)] text-lg font-bold text-[var(--color-primary)]">
                {aboutText.teamName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto">
          <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)] mb-10">
            Team Members
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-start">
            <img
              src="/images/origin-team.webp"
              alt="Team collaboration"
              className="w-full h-auto object-contain"
            />
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]">
                <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)] mb-3">
                  Team
                </p>
                <p className="font-[var(--font-display)] text-lg font-bold text-[var(--color-primary)]">
                  {aboutText.teamName}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
                {aboutText.teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]"
                  >
                    <p className="font-[var(--font-display)] text-sm font-medium text-[var(--color-primary)]">
                      {member.name}
                    </p>
                    <p className="font-[var(--font-en)] text-xs text-[var(--color-muted)] tracking-wider mt-1">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
              {aboutText.futurePlans.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold leading-snug text-[var(--color-primary)]">
              {aboutText.futurePlans.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80">
              {aboutText.futurePlans.body}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
            {aboutText.futurePlans.items.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 md:p-8 space-y-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]"
              >
                <img
                  src={futureVisuals[i % futureVisuals.length]}
                  alt={`${item.label} visual`}
                  className="w-full h-auto object-contain bg-[var(--color-background)]"
                />
                <div className="space-y-3">
                  <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
                    Coming Soon
                  </p>
                  <h3 className="font-[var(--font-display)] text-lg font-medium leading-snug text-[var(--color-primary)]">
                    {item.label}
                  </h3>
                  <p className="font-[var(--font-body)] text-sm leading-[1.7] text-[var(--color-primary)]/70">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruit */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-white/50">
              {aboutText.recruit.eyebrow}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold leading-snug text-white">
              {aboutText.recruit.h2}
            </h2>
            <p className="font-[var(--font-body)] text-base leading-[1.7] text-white/70">
              {aboutText.recruit.body}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutText.recruit.positions.map((pos, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl p-8 space-y-3 border border-white/10"
              >
                <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-white/50">
                  Open Position
                </p>
                <h3 className="font-[var(--font-display)] text-lg font-medium leading-snug text-white">
                  {pos.label}
                </h3>
                <p className="font-[var(--font-body)] text-sm leading-[1.7] text-white/70">
                  {pos.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
