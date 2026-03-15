import { blogText } from "@/data/text";
import { SubmitForm } from "./SubmitForm";

export default function BlogPage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-end">
            <div className="space-y-6">
              <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
                {blogText.eyebrow}
              </p>
              <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold leading-[1.1] text-[var(--color-primary)]">
                {blogText.h1}
              </h1>
              <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[60ch]">
                {blogText.intro}
              </p>
            </div>
            <div>
              <img
                src="/images/blog-header.svg"
                alt="教師鬼故事集插畫"
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold leading-snug text-[var(--color-primary)]">
            {blogText.featuredTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {blogText.placeholderStories.map((story, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 space-y-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
                  {story.eyebrow}
                </p>
                <h3 className="font-[var(--font-display)] text-lg font-bold leading-snug text-[var(--color-primary)]">
                  {story.title}
                </h3>
                <p className="font-[var(--font-body)] text-sm leading-[1.7] text-[var(--color-primary)]/70">
                  {story.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Form */}
      <section className="px-6 md:px-16 py-16 bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto">
          <SubmitForm />
        </div>
      </section>
    </>
  );
}
