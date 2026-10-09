"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { mainNav } from "@/lib/nav";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Sulje mobiilivalikko sivun vaihtuessa ja Esc-näppäimellä.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a
        href="#sisalto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Siirry sisältöön
      </a>
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Päävalikko" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-navy-700 hover:bg-mist hover:text-navy-900 aria-[current=page]:text-teal-800 aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/putkimiehen-hinnat#laskuri"
            className="hidden rounded-md px-3 py-2 text-[0.95rem] font-semibold text-navy-900 underline decoration-teal-600 decoration-2 underline-offset-[6px] hover:text-teal-800 sm:inline-block"
          >
            Vertaile hintoja
          </Link>
          <Link
            href="/tarjouspyynto"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[10px] bg-teal-700 px-3 text-[0.9rem] sm:px-4 sm:text-[0.95rem] font-semibold text-white shadow-soft hover:bg-teal-800"
          >
            Pyydä tarjous
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-rule text-navy-900 hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Sulje valikko" : "Avaa valikko"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Mobiilivalikko"
        hidden={!open}
        className="border-t border-rule bg-white lg:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          {[...mainNav, { href: "/putkiliikkeiden-vertailu", label: "Putkiliikkeiden vertailu" }, { href: "/putkimiehen-hinnat#laskuri", label: "Vertaile hintoja" }].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="flex min-h-12 items-center rounded-md px-3 text-[1.05rem] font-medium text-navy-900 hover:bg-mist aria-[current=page]:text-teal-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
