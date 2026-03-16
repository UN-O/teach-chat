import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, H2 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function HookSection() {
    return (
        <section id="hook" className="bg-surface">
            {/* Scenario block */}
            <div className="py-14 md:py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_2fr] items-center p-5 sm:p-6 md:p-0 gap-10">
                    <div className="order-2 md:order-1 bg-background md:bg-transparent rounded-xl md:rounded-none p-0">
                        <img
                            src="/images/hook-phone.svg"
                            alt="老師手握手機，家長 LINE 訊息涌現"
                            className="w-full h-auto max-h-75 md:max-h-110 object-contain mx-auto"
                        />
                    </div>
                    <div className="order-1 md:order-2 w-full md:rounded-none">
                        <div className="pt-2 w-full md:max-w-md space-y-6">
                            <Eyebrow className="text-secondary">
                                {homeText.hook.scenario.eyebrow}
                            </Eyebrow>
                            <H2 size="lg" className="text-[1.8rem] sm:text-3xl md:text-4xl text-primary">
                                {homeText.hook.scenario.h2}
                            </H2>
                            <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[55ch]">
                                {homeText.hook.scenario.body}
                            </p>
                            <div className="rounded-xl bg-white">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="accent"
                                        size="lg"
                                        className="h-auto min-h-13 w-full justify-between py-3"
                                        asChild
                                    >
                                        <Link href="/scenario/fight">
                                            <span className="flex-1 text-left whitespace-normal leading-[1.4]">
                                                {homeText.hook.scenario.ctaFight}
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="deep"
                                        size="lg"
                                        className="h-auto min-h-13 w-full justify-between py-3"
                                        asChild
                                    >
                                        <Link href="/scenario/abnormal">
                                            <span className="flex-1 text-left whitespace-normal leading-[1.4]">
                                                {homeText.hook.scenario.ctaDisorder}
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="h-auto min-h-13 w-full justify-between py-3"
                                        asChild
                                    >
                                        <Link href="/scenario">
                                            <span className="flex-1 text-left whitespace-normal leading-[1.4]">
                                                {homeText.hook.scenario.ctaMore}
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-t border-muted opacity-20" />

            {/* Technique block */}
            <div className="py-14 md:py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_2fr] items-center p-5 sm:p-6 md:p-0 gap-10">
                    {/* Text — left on desktop */}
                    <div className="w-full md:rounded-none">
                        <div className="pt-2 w-full md:max-w-md space-y-6">
                            <Eyebrow className="text-secondary">
                                {homeText.hook.technique.eyebrow}
                            </Eyebrow>
                            <H2 size="lg" className="text-[1.8rem] sm:text-3xl md:text-4xl text-primary">
                                {homeText.hook.technique.h2}
                            </H2>
                            <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[55ch]">
                                {homeText.hook.technique.body}
                            </p>
                            <div className="rounded-xl bg-white">
                                <Button
                                    size="lg"
                                    variant="deep"
                                    className="h-auto min-h-13 w-full justify-between py-3"
                                    asChild
                                >
                                    <Link href="/technique">
                                        <span className="flex-1 text-left whitespace-normal leading-[1.4]">
                                            {homeText.hook.technique.cta}
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Visual — technique tag preview */}
                    <div className="bg-background rounded-xl p-6 space-y-3">
                        <p className="font-en text-xs font-medium tracking-widest uppercase text-muted mb-4">
                            精選技巧
                        </p>
                        {homeText.hook.technique.tags.map((t) => (
                            <div
                                key={t.code}
                                className="flex items-center gap-4 bg-white rounded-lg px-5 py-4 shadow-soft"
                            >
                                <span className="font-en text-xs font-medium tracking-widest uppercase text-muted shrink-0">
                                    {t.code}
                                </span>
                                <span className="font-body text-sm text-primary leading-snug">
                                    {t.label}
                                </span>
                            </div>
                        ))}
                        <p className="font-en text-xs tracking-widest uppercase text-muted/60 pt-1 text-right">
                            + more
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-t border-muted opacity-20" />

            {/* Polish block */}
            <div className="py-14 md:py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_2fr] items-center p-5 sm:p-6 md:p-0 gap-10">
                    <div className="order-2 md:order-1 bg-background md:bg-transparent rounded-xl md:rounded-none p-0">
                        <img
                            src="/images/feature-polish.svg"
                            alt="訊息潤飾 Before/After 對比示意"
                            className="w-full h-auto max-h-75 md:max-h-110 object-contain mx-auto"
                        />
                    </div>
                    <div className="order-1 md:order-2 w-full md:rounded-none">
                        <div className="pt-2 w-full md:max-w-md space-y-6">
                        <Eyebrow className="text-secondary">
                            {homeText.hook.polish.eyebrow}
                        </Eyebrow>
                        <H2 size="lg" className="text-[1.8rem] sm:text-3xl md:text-4xl text-primary">
                            {homeText.hook.polish.h2}
                        </H2>
                        <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[55ch]">
                            {homeText.hook.polish.body}
                        </p>
                            <div className="rounded-xl bg-white">
                                <Button size="lg" className="h-auto min-h-13 w-full justify-between py-3" asChild>
                                    <Link href="/polish-text">
                                        <span className="flex-1 text-left whitespace-normal leading-[1.4]">
                                            {homeText.hook.polish.cta}
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
