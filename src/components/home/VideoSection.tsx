import { Eyebrow, H2 } from "@/components/ui/typography";
import { homeText } from "@/data/text";

export function VideoSection() {
    return (
        <section className="bg-surface">
            <div className="py-14 md:py-24">
                <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-0 space-y-8 text-center">
                    <div className="space-y-4">
                        <Eyebrow className="text-secondary">
                            {homeText.video.eyebrow}
                        </Eyebrow>
                        <H2 size="lg" className="text-[1.8rem] sm:text-3xl md:text-4xl text-primary">
                            {homeText.video.h2}
                        </H2>
                    </div>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.youtube.com/embed/Mgb-Z8zN1P4"
                            title="介紹影片"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
