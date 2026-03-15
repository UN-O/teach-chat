import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ── Eyebrow ───────────────────────────────────────────────────────────────────
// Uppercase label above headings. Pass color via className.
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-en text-xs font-medium tracking-widest uppercase",
        className,
      )}
      {...props}
    />
  );
}

// ── H1 ────────────────────────────────────────────────────────────────────────
const h1Variants = cva("font-display font-bold", {
  variants: {
    size: {
      // Large hero/display heading
      display: "text-[clamp(2.5rem,8vw,5.25rem)] leading-[1.05]",
      // Standard page title
      page: "text-5xl md:text-6xl leading-[1.1]",
    },
  },
  defaultVariants: { size: "page" },
});

function H1({
  className,
  size,
  ...props
}: React.ComponentProps<"h1"> & VariantProps<typeof h1Variants>) {
  return <h1 className={cn(h1Variants({ size }), className)} {...props} />;
}

// ── H2 ────────────────────────────────────────────────────────────────────────
const h2Variants = cva("font-display font-bold", {
  variants: {
    size: {
      // Large section headings: text-4xl md:text-5xl
      xl: "text-4xl md:text-5xl leading-[1.15]",
      // Standard section headings: text-3xl md:text-4xl
      lg: "text-3xl md:text-4xl leading-[1.2]",
      // Sub-section headings: text-2xl md:text-3xl
      md: "text-2xl md:text-3xl leading-snug",
    },
  },
  defaultVariants: { size: "md" },
});

function H2({
  className,
  size,
  ...props
}: React.ComponentProps<"h2"> & VariantProps<typeof h2Variants>) {
  return <h2 className={cn(h2Variants({ size }), className)} {...props} />;
}

// ── H3 ────────────────────────────────────────────────────────────────────────
const h3Variants = cva("font-display leading-snug", {
  variants: {
    size: {
      xl: "text-xl",
      lg: "text-lg",
    },
    weight: {
      bold: "font-bold",
      medium: "font-medium",
    },
  },
  defaultVariants: { size: "lg", weight: "bold" },
});

function H3({
  className,
  size,
  weight,
  ...props
}: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>) {
  return (
    <h3 className={cn(h3Variants({ size, weight }), className)} {...props} />
  );
}

// ── P ─────────────────────────────────────────────────────────────────────────
const pVariants = cva("font-body leading-[1.7]", {
  variants: {
    size: {
      base: "text-base",
      sm: "text-sm",
    },
  },
  defaultVariants: { size: "base" },
});

function P({
  className,
  size,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof pVariants>) {
  return <p className={cn(pVariants({ size }), className)} {...props} />;
}

// ── UL / OL / LI ──────────────────────────────────────────────────────────────
function UL({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "font-body list-disc list-outside pl-6 space-y-1.5 text-base leading-[1.7]",
        className,
      )}
      {...props}
    />
  );
}

function OL({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "font-body list-decimal list-outside pl-6 space-y-1.5 text-base leading-[1.7]",
        className,
      )}
      {...props}
    />
  );
}

function LI({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("pl-1", className)} {...props} />;
}

// ── Blockquote ────────────────────────────────────────────────────────────────
function Blockquote({
  className,
  children,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("flex gap-4 my-8 first:mt-0 last:mb-0", className)}
      {...props}
    >
      <div className="shrink-0 my-1 w-0.5 bg-secondary rounded-full" />
      <div className="min-w-0 w-full font-body text-base leading-[1.7] text-primary/80">
        {children}
      </div>
    </blockquote>
  );
}

// ── Code ──────────────────────────────────────────────────────────────────────
function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 bg-background font-mono text-[0.875em] text-primary border border-muted/20 rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { Eyebrow, H1, H2, H3, P, UL, OL, LI, Blockquote, Code };
