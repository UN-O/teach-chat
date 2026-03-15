import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TECHNIQUES_DIR = path.join(process.cwd(), "docs/techniques");
const DEFAULT_TECHNIQUE_IMAGE = "/images/techniques/shared-cover.svg";

export interface TechniqueMeta {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  coverImage: string;
  coverAlt: string;
  order: number;
  fileName: string;
}

export interface TechniqueDoc extends TechniqueMeta {
  content: string;
}

function parseFileName(fileName: string) {
  const matched = fileName.match(/^(\d+)-(.+)\.md$/u);
  if (!matched) {
    return null;
  }

  const id = matched[1].padStart(2, "0");
  const title = matched[2];

  return { id, title };
}

async function readTechniqueDoc(fileName: string): Promise<TechniqueDoc | null> {
  const fallback = parseFileName(fileName);
  if (!fallback) {
    return null;
  }

  const filePath = path.join(TECHNIQUES_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  const id = String(parsed.data.id ?? fallback.id).padStart(2, "0");
  const title = String(parsed.data.title ?? fallback.title);

  let coverImage = parsed.data.coverImage as string | undefined;

  if (!coverImage) {
    const numericId = parseInt(id, 10);
    const imageFilename = `${numericId}.svg`;
    const absoluteImagePath = path.join(
      process.cwd(),
      "public",
      "images",
      "techniques",
      imageFilename,
    );

    try {
      await fs.access(absoluteImagePath);
      coverImage = `/images/techniques/${imageFilename}`;
    } catch {
      coverImage = DEFAULT_TECHNIQUE_IMAGE;
    }
  }

  return {
    id,
    title,
    eyebrow: String(parsed.data.eyebrow ?? `技巧 ${id}`),
    summary: String(
      parsed.data.summary ?? `${title}：提供情境說明、實作步驟與可直接套用的訊息範例。`,
    ),
    coverImage,
    coverAlt: String(parsed.data.coverAlt ?? `${title} 文章封面圖`),
    order: Number(parsed.data.order ?? Number(id)),
    fileName,
    content: parsed.content.trim(),
  };
}

export async function getAllTechniqueDocs(): Promise<TechniqueMeta[]> {
  const files = await fs.readdir(TECHNIQUES_DIR);
  const docs = await Promise.all(files.map((fileName) => readTechniqueDoc(fileName)));

  return docs
    .filter((doc): doc is TechniqueDoc => doc !== null)
    .sort((a, b) => a.order - b.order)
    .map(({ content: _content, ...meta }) => meta);
}

export async function getTechniqueDocById(id: string): Promise<TechniqueDoc | null> {
  const docs = await getAllTechniqueDocs();
  const target = docs.find((doc) => doc.id === id);

  if (!target) {
    return null;
  }

  return readTechniqueDoc(target.fileName);
}