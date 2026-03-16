import { Button } from "@/components/ui/button";
import { Eyebrow, H2 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function ContactSection() {
    return (
        <section className="py-24 bg-primary">
            <div className="max-w-6xl mx-auto text-center space-y-8">
                <Eyebrow className="text-white/50">
                    {homeText.contact.eyebrow}
                </Eyebrow>
                <H2 size="xl" className="text-white">
                    {homeText.contact.h2}
                </H2>
                <p className="font-body text-base leading-[1.7] text-white/70 max-w-[50ch] mx-auto">
                    {homeText.contact.body}
                </p>
                <div className="space-y-3">
                    <p className="font-en text-sm text-white/60">
                        Email: {homeText.contact.email}
                    </p>
                    <Button variant="secondary" asChild>
                        <a href="https://forms.gle/zVYC78gu4ski3fXu6" target="_blank" rel="noopener noreferrer">
                            {homeText.contact.ctaForm}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
