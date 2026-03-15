import Link from "next/link";
import { navText, siteText } from "@/data/text";

const footerLinks = [
  { href: "/", label: navText.home },
  { href: "/technique", label: navText.technique },
  { href: "/how-to-use", label: navText.howToUse },
  { href: "/blog", label: navText.blog },
  { href: "/about", label: navText.about },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
          {/* Brand Block */}
          <div className="space-y-4">
            <p className="font-display text-2xl font-bold">
              {siteText.siteName}
            </p>
            <p className="font-en text-xs font-medium tracking-widest uppercase text-white/50">
              {siteText.siteTagline}
            </p>
            <p className="font-body text-sm leading-[1.7] text-white/70 max-w-[45ch]">
              {navText.footerTagline}
            </p>
          </div>

          {/* Links */}
          <nav className="space-y-3">
            <p className="font-en text-xs font-medium tracking-widest uppercase text-white/50 mb-4">
              Pages
            </p>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block font-body text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <hr className="border-t border-white/10 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-en text-xs text-white/40">
            {navText.footerCopyright}
          </p>
          <a
            href="mailto:outegralstudio@gmail.com"
            className="font-en text-xs text-white/50 hover:text-white transition-colors duration-200"
          >
            outegralstudio@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
