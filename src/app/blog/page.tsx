import { Eyebrow, H1, H2, H3 } from "@/components/ui/typography";
import { blogText } from "@/data/text";
import { SubmitForm } from "./SubmitForm";

export default function BlogPage() {
  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-end">
            <div className="space-y-6">
              <Eyebrow className="text-secondary">
                {blogText.eyebrow}
              </Eyebrow>
              <H1 className="text-primary">
                {blogText.h1}
              </H1>
              <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[60ch]">
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
      <section className="px-6 md:px-16 py-16 bg-surface">
        <div className="max-w-6xl mx-auto space-y-10">
          <H2 className="text-primary">
            {blogText.featuredTitle}
          </H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {blogText.placeholderStories.map((story, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 space-y-3 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <Eyebrow className="text-muted">
                  {story.eyebrow}
                </Eyebrow>
                <H3 className="text-primary">
                  {story.title}
                </H3>
                <p className="font-body text-sm leading-[1.7] text-primary/70">
                  {story.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Form */}
      <section className="px-6 md:px-16 py-16 bg-background">
        <div className="max-w-4xl mx-auto">
          <SubmitForm />
        </div>
      </section>
    </>
  );
}
