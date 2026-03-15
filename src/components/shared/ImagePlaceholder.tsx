import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

// 插畫嵌入規則（style.md §6）：
// - 無 rounded-*、無 shadow、無 border
// - 使用 mix-blend-multiply 讓插畫融入背景色
// - object-contain 保持比例
export function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImagePlaceholderProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="w-full h-auto object-contain mix-blend-multiply"
      />
    </div>
  );
}
