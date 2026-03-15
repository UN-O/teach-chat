import Link from "next/link";
import { NavLink } from "./NavLink";
import { NavbarMobile } from "./NavbarMobile";
import { Button } from "@/components/ui/button";
import { navText, siteText } from "@/data/text";

const navLinks = [
  { href: "/", label: navText.home },
  { href: "/technique", label: navText.technique },
  { href: "/how-to-use", label: navText.howToUse },
  { href: "/blog", label: navText.blog },
  { href: "/about", label: navText.about },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)] shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-6 md:px-16 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-[var(--font-display)] text-lg font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          {siteText.siteName}
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
          <Button variant="deep" size="sm" asChild>
            <Link href="/scenario">{navText.startPractice}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <NavbarMobile />
      </div>
    </header>
  );
}
