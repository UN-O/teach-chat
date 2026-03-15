"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "font-en text-sm font-medium tracking-wider",
        "text-primary border-b-2 border-transparent",
        "transition-colors duration-200 pb-0.5",
        isActive && "border-primary",
        !isActive && "hover:border-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}
