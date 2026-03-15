"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink } from "./NavLink";
import { navText } from "@/data/text";

const navLinks = [
  { href: "/", label: navText.home },
  { href: "/technique", label: navText.technique },
  { href: "/how-to-use", label: navText.howToUse },
  { href: "/blog", label: navText.blog },
  { href: "/about", label: navText.about },
];

export function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="開啟選單"
        className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
      >
        <span
          className={`block w-6 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-[0_8px_24px_0_rgba(0,0,0,0.12)] py-6 px-6 flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base py-2"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            href="/scenario"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center h-11 px-8 bg-[var(--color-secondary)] text-white font-[var(--font-en)] text-sm font-medium tracking-wider uppercase rounded-lg"
          >
            {navText.startPractice}
          </Link>
        </div>
      )}
    </div>
  );
}
