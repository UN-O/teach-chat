import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-[var(--font-en)] text-sm font-medium tracking-wider uppercase",
    "rounded-lg transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-white hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.18)] hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-white text-[var(--color-primary)] shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] hover:-translate-y-px active:translate-y-0",
        accent:
          "bg-[var(--color-accent)] text-white hover:shadow-[0_4px_16px_0_rgba(255,90,95,0.35)] hover:-translate-y-px active:translate-y-0",
        deep:
          "bg-[var(--color-secondary)] text-white hover:shadow-[0_4px_16px_0_rgba(42,61,102,0.28)] hover:-translate-y-px active:translate-y-0",
        ghost:
          "bg-transparent text-[var(--color-secondary)] underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        sm: "h-8 px-5 text-xs",
        default: "h-11 px-8",
        lg: "h-13 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
