"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { NavbarMobile } from "./NavbarMobile";
import { Button } from "@/components/ui/button";
import { navText, siteText } from "@/data/text";

const navLinks = [
  { href: "/", label: navText.home },
  { href: "/technique", label: navText.technique },
  { href: "/how-to-use", label: navText.howToUse },
  { href: "/about", label: navText.about },
];

export function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/scenario/") && pathname !== "/scenario") {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-soft">
      <div className="max-w-6xl mx-auto px-6 xl:px-0 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-lg font-bold text-primary hover:opacity-80 transition-opacity"
        >
            {/* logo */}
            <img
              src="/logo.svg"
              alt={siteText.siteName}
              className="h-8 w-8"
            />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="deep" asChild>
            <Link href="/scenario">{navText.startPractice}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <NavbarMobile />
      </div>
    </header>
  );
}
