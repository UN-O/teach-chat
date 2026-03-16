import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow, H1, P } from "@/components/ui/typography";
import { homeText, siteText } from "@/data/text";

export function HeroSection() {
    return (
        <section className="px-6 md:px-16 pt-0 md:pt-10 pb-24 bg-background overflow-hidden">
            <div className="max-w-6xl mx-auto relative">
                <div className="md:hidden pb-36">
                    <div className="relative w-full max-w-[420px] mx-auto animate-editorial-in">
                        <img
                            src="/images/hero-teacher.svg"
                            alt="年輕老師坐在書桌前看著手機，暖色系插畫"
                            className="block h-auto w-full aspect-[4/5] object-contain"
                        />
                        <div className="absolute -inset-x-3 sm:inset-x-0 -bottom-30 rounded-xl bg-white border border-muted px-6 py-8">
                            <Eyebrow className="text-[11px] text-secondary mb-3">
                                {homeText.hero.eyebrow}
                            </Eyebrow>
                            <H1 className="text-[clamp(2rem,9vw,2.7rem)] leading-[1.06] text-primary">
                                <span className="block">{siteText.siteName}</span>
                                <span className="mt-2 block font-en text-[11px] font-medium tracking-[0.16em] uppercase text-secondary">
                                    {siteText.siteTagline}
                                </span>
                            </H1>
                            <P size="sm" className="mt-5 leading-[1.8] text-primary">
                                {homeText.hero.subtitle}
                            </P>
                            <div className="mt-6 grid items-center gap-3">
                                <Button asChild>
                                    <Link href="/scenario">情境模擬練習</Link>
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link href="/polish-text">潤飾文字工具</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative hidden md:block lg:min-h-[620px]">
                    <div className="relative z-20 max-w-3xl lg:max-w-2xl lg:pr-[22%] md:pt-8 stagger">
                        <Eyebrow className="text-secondary mb-6">
                            {homeText.hero.eyebrow}
                        </Eyebrow>
                        <H1 size="display" className="text-primary">
                            <span className="block">{siteText.siteName}</span>
                            <span className="mt-3 block font-en text-sm md:text-base font-medium tracking-[0.18em] uppercase text-secondary">
                                {siteText.siteTagline}
                            </span>
                        </H1>
                        <P className="mt-8 text-primary max-w-[60ch]">
                            {homeText.hero.subtitle}
                        </P>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Button asChild>
                                <Link href="/scenario">情境模擬練習</Link>
                            </Button>
                            <Button variant="secondary" asChild>
                                <Link href="/polish-text">潤飾文字工具</Link>
                            </Button>
                        </div>
                    </div>
                    <div
                        className="pointer-events-none relative z-10 mt-10 mx-auto w-full max-w-none aspect-[8/5] overflow-hidden md:w-full lg:mx-0 lg:ml-auto lg:mt-0 lg:w-[38%] lg:max-w-[430px] lg:aspect-[4/5] lg:overflow-visible lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 animate-editorial-in"
                        style={{ animationDelay: "220ms" }}
                    >
                        <img
                            src="/images/hero-teacher.svg"
                            alt="年輕老師坐在書桌前看著手機，暖色系插畫"
                            className="h-full w-full object-cover object-top lg:object-contain"
                        />
                    </div>
                </div>
            </div>
            {/* 詳細介紹置中連結與箭頭（使用純連結，移除 Button 元件） */}
            <div className="flex flex-col items-center mt-6 gap-2 text-xs">
                <a
                    href="#hook"
                    aria-label="瞭解更多"
                    className="text-secondary"
                >
                    瞭解更多
                </a>
                <a href="#hook" aria-label="往下介紹" className="mx-auto">
                    <span className="block animate-bounce text-secondary text-center">↓</span>
                </a>
            </div>
        </section>
    );
}
