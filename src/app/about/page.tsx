import { Eyebrow, H1, H2, H3 } from "@/components/ui/typography";
import { aboutText } from "@/data/text";

const futureVisuals = ["/images/future-2.svg", "/images/future-1.svg"];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Eyebrow className="text-secondary">
            {aboutText.eyebrow}
          </Eyebrow>
          <H1 className="text-primary">
            {aboutText.h1}
          </H1>
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-start pt-4">
            <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
              {aboutText.intro}
            </p>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <p className="font-en text-xs font-medium tracking-widest uppercase text-muted mb-3">
                Team
              </p>
              <p className="font-display text-lg font-bold text-primary">
                {aboutText.teamName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="px-6 md:px-16 py-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          <p className="font-en text-xs font-medium tracking-widest uppercase text-muted mb-10">
            Team Members
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-start">
            <img
              src="/images/origin-team.webp"
              alt="Team collaboration"
              className="w-full h-auto object-contain"
            />
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <p className="font-en text-xs font-medium tracking-widest uppercase text-muted mb-3">
                  Team
                </p>
                <p className="font-display text-lg font-bold text-primary">
                  {aboutText.teamName}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
                {aboutText.teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 shadow-soft"
                  >
                    <p className="font-display text-sm font-medium text-primary">
                      {member.name}
                    </p>
                    <p className="font-en text-xs text-muted tracking-wider mt-1">
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
      <section className="px-6 md:px-16 py-16 bg-background">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <Eyebrow className="text-secondary">
              {aboutText.futurePlans.eyebrow}
            </Eyebrow>
            <H2 size="lg" className="leading-snug text-primary">
              {aboutText.futurePlans.h2}
            </H2>
            <p className="font-body text-base leading-[1.7] text-primary/80">
              {aboutText.futurePlans.body}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
            {aboutText.futurePlans.items.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 md:p-8 space-y-5 shadow-soft"
              >
                <img
                  src={futureVisuals[i % futureVisuals.length]}
                  alt={`${item.label} visual`}
                  className="w-full h-auto object-contain bg-background"
                />
                <div className="space-y-3">
                  <p className="font-en text-xs font-medium tracking-widest uppercase text-muted">
                    Coming Soon
                  </p>
                  <H3 weight="medium" className="text-primary">
                    {item.label}
                  </H3>
                  <p className="font-body text-sm leading-[1.7] text-primary/70">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruit */}
      <section className="px-6 md:px-16 py-16 bg-secondary">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <Eyebrow className="text-white/50">
              {aboutText.recruit.eyebrow}
            </Eyebrow>
            <H2 size="lg" className="leading-snug text-white">
              {aboutText.recruit.h2}
            </H2>
            <p className="font-body text-base leading-[1.7] text-white/70">
              {aboutText.recruit.body}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutText.recruit.positions.map((pos, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl p-8 space-y-3 border border-white/10"
              >
                <p className="font-en text-xs font-medium tracking-widest uppercase text-white/50">
                  Open Position
                </p>
                <H3 weight="medium" className="text-white">
                  {pos.label}
                </H3>
                <p className="font-body text-sm leading-[1.7] text-white/70">
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
