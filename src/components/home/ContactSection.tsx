import { Button } from "@/components/ui/button";
import { homeText } from "@/data/text";

export function ContactSection() {
  return (
    <section className="px-6 md:px-16 py-24 bg-[var(--color-primary)]">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-white/50">
          {homeText.contact.eyebrow}
        </p>
        <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold leading-[1.15] text-white">
          {homeText.contact.h2}
        </h2>
        <p className="font-[var(--font-body)] text-base leading-[1.7] text-white/70 max-w-[50ch] mx-auto">
          {homeText.contact.body}
        </p>
        <div className="space-y-3">
          <p className="font-[var(--font-en)] text-sm text-white/60">
            Email: {homeText.contact.email}
          </p>
          <Button variant="secondary" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {homeText.contact.ctaForm}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
