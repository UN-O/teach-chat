import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, H1, H2, H3 } from "@/components/ui/typography";
import { techniqueText } from "@/data/text";
import { getAllTechniqueDocs } from "@/lib/techniques";

export default async function TechniquePage() {
  const techniques = await getAllTechniqueDocs();

  return (
    <>
      {/* Page Header */}
      <section className="px-6 md:px-16 py-20 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Eyebrow className="text-secondary">
            {techniqueText.eyebrow}
          </Eyebrow>
          <H1 className="text-primary">
            {techniqueText.h1}
          </H1>
          <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
            {techniqueText.intro}
          </p>
        </div>
      </section>

      {/* Platform Tips */}
      <section className="px-6 md:px-16 py-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-soft space-y-4">
            <Eyebrow className="text-muted">
              {techniqueText.platform.eyebrow}
            </Eyebrow>
            <H2 className="text-primary">
              {techniqueText.platform.h2}
            </H2>
            <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
              {techniqueText.platform.body}
            </p>
          </div>
        </div>
      </section>

      {/* Core Techniques */}
      <section className="px-6 md:px-16 py-16 bg-background">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3">
            <Eyebrow className="text-secondary">
              Core Skills
            </Eyebrow>
            <H2 size="lg" className="md:text-3xl text-primary">
              {techniqueText.coreTitle}
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger">
            {techniques.map((technique) => (
              <Link
                key={technique.id}
                href={`/docs/techniques/${technique.id}`}
                className="group block rounded-xl bg-white shadow-soft hover:shadow-md transition-shadow duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <div className="relative aspect-4/3 bg-background/60">
                  <Image
                    src={technique.coverImage}
                    alt={technique.coverAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8 space-y-3">
                  <Eyebrow className="text-muted">
                    {technique.eyebrow}
                  </Eyebrow>
                  <H3 size="xl" weight="medium" className="text-primary">
                    {technique.title}
                  </H3>
                  <p className="font-body text-sm leading-[1.7] text-primary/70">
                    {technique.summary}
                  </p>
                  <div className="pt-2 font-en text-sm font-medium text-secondary transition-colors group-hover:text-primary">
                      查看完整文章 →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-8 text-center">
            <Button variant="deep" asChild>
              <Link href="/scenario">去情境練習運用這些技巧</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
