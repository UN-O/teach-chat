import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Eyebrow, H1 } from "@/components/ui/typography";
import { getAllTechniqueDocs, getTechniqueDocById } from "@/lib/techniques";

interface TechniqueDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateStaticParams() {
    const techniques = await getAllTechniqueDocs();

    return techniques.map((technique) => ({
        id: technique.id,
    }));
}

export async function generateMetadata({
    params,
}: TechniqueDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const technique = await getTechniqueDocById(id);

    if (!technique) {
        return {
            title: "找不到技巧文章",
        };
    }

    return {
        title: `${technique.eyebrow}｜${technique.title}`,
        description: technique.summary,
    };
}

export default async function TechniqueDetailPage({ params }: TechniqueDetailPageProps) {
    const { id } = await params;
    const technique = await getTechniqueDocById(id);

    if (!technique) {
        notFound();
    }

    return (
        <section className="bg-background grid gap-5 px-1 pt-5 pb-8 md:px-16 md:py-20 overflow-x-hidden">
            <div className="max-w-4xl mx-auto w-full">
                <Button asChild variant="secondary" size="sm" className="w-fit normal-case tracking-normal">
                    <Link href="/technique">← 回交戰手冊</Link>
                </Button>
            </div>
            <article className="max-w-4xl mx-auto w-full overflow-hidden bg-white rounded-xl p-5 md:p-12 shadow-soft space-y-8 animate-editorial-in pb-24 md:pb-40">
                <header className="space-y-4 pb-6 border-b border-muted/20">
                    <Eyebrow className="text-secondary">{technique.eyebrow}</Eyebrow>
                    <H1 className="text-primary">{technique.title}</H1>
                    <p className="font-body text-base leading-[1.7] text-primary/80 max-w-[65ch]">
                        {technique.summary}
                    </p>
                    <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-background/60">
                        <Image
                            src={technique.coverImage}
                            alt={technique.coverAlt}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 896px"
                            className="object-cover"
                        />
                    </div>
                </header>

                <div className="space-y-5 text-primary/90 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:wrap-break-word">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="font-display text-3xl leading-[1.2] font-bold text-primary">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="pt-10 font-display text-2xl leading-tight font-bold text-primary">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="pt-8 font-display text-xl font-bold text-secondary">
                                    {children}
                                </h3>
                            ),
                            h4: ({ children }) => (
                                <h4 className="pt-2 font-display text-lg font-medium text-accent-alt">
                                    {children}
                                </h4>
                            ),
                            p: ({ children }) => (
                                <p className="font-body text-base leading-[1.8] text-primary/90">{children}</p>
                            ),
                            hr: () => (
                                <div className="py-20">
                                    <hr className="border-muted/20" />
                                </div>
                            ),
                            ul: ({ children }) => <ul className="list-disc pl-6 space-y-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2">{children}</ol>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-secondary pl-4 text-primary/80">
                                    {children}
                                </blockquote>
                            ),
                            table: ({ children }) => (
                                <div className="my-8 w-full rounded-xl border border-muted/30 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full table-auto border-collapse text-left text-sm">
                                            {children}
                                        </table>
                                    </div>
                                </div>
                            ),
                            thead: ({ children }) => <thead className="bg-background/70">{children}</thead>,
                            th: ({ children }) => (
                                <th className="border border-muted/40 px-4 py-3 font-en text-xs font-medium tracking-wide text-secondary uppercase whitespace-normal wrap-anywhere">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-muted/30 px-4 py-3 align-top font-body text-sm leading-[1.7] text-primary/90 whitespace-normal wrap-anywhere">
                                    {children}
                                </td>
                            ),
                        }}
                    >
                        {technique.content}
                    </ReactMarkdown>
                </div>
            </article>
        </section>
    );
}