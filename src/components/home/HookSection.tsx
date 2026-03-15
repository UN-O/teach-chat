import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeText } from "@/data/text";

export function HookSection() {
    return (
        <section className="bg-[var(--color-surface)]">
            {/* Scenario block */}
            <div className="py-14 md:py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_2fr] items-center p-5 sm:p-6 md:p-0 gap-10">
                    <div className="order-2 md:order-1 bg-[var(--color-background)] md:bg-transparent rounded-xl md:rounded-none p-0">
                        <img
                            src="/images/hook-phone.svg"
                            alt="老師手握手機，家長 LINE 訊息涌現"
                            className="w-full h-auto max-h-[300px] md:max-h-[440px] object-contain  mx-auto"
                        />
                    </div>
                    <div className="order-1 md:order-2 w-full md:rounded-none">
                        <div className="pt-2 w-full md:max-w-md space-y-6">
                            <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
                                {homeText.hook.scenario.eyebrow}
                            </p>
                            <h2 className="font-[var(--font-display)] text-[1.8rem] sm:text-3xl md:text-4xl font-bold leading-[1.2] text-[var(--color-primary)]">
                                {homeText.hook.scenario.h2}
                            </h2>
                            <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[55ch]">
                                {homeText.hook.scenario.body}
                            </p>
                            <div className="rounded-xl bg-white">
                                <div className="flex flex-col gap-3">
                                    <Button variant="accent" size="lg" className="w-full justify-between" asChild>
                                        <Link href="/scenario/studentfeud">
                                            <span>{homeText.hook.scenario.ctaFight}</span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button variant="deep" size="lg" className="w-full justify-between" asChild>
                                        <Link href="/scenario/disorder">
                                            <span>{homeText.hook.scenario.ctaDisorder}</span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="lg" className="w-full justify-between" asChild>
                                        <Link href="/scenario">
                                            <span>{homeText.hook.scenario.ctaMore}</span>
                                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-t border-[var(--color-muted)] opacity-20" />

            {/* Polish block */}
            <div className="py-14 md:py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_2fr] items-center p-5 sm:p-6 md:p-0 gap-10">
                    <div className="order-2 md:order-1 bg-[var(--color-background)] md:bg-transparent rounded-xl md:rounded-none p-0">
                        <img
                            src="/images/feature-polish.svg"
                            alt="訊息潤飾 Before/After 對比示意"
                            className="w-full h-auto max-h-[300px] md:max-h-[440px] object-contain  mx-auto"
                        />
                    </div>
                    <div className="order-1 md:order-2 w-full md:rounded-none">
                        <div className="pt-2 w-full md:max-w-md space-y-6">
                        <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)]">
                            {homeText.hook.polish.eyebrow}
                        </p>
                        <h2 className="font-[var(--font-display)] text-[1.8rem] sm:text-3xl md:text-4xl font-bold leading-[1.2] text-[var(--color-primary)]">
                            {homeText.hook.polish.h2}
                        </h2>
                        <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/80 max-w-[55ch]">
                            {homeText.hook.polish.body}
                        </p>
                            <div className="rounded-xl bg-white">
                                <Button size="lg" className="w-full justify-between" asChild>
                                    <Link href="/polishtext">
                                        <span>{homeText.hook.polish.cta}</span>
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
