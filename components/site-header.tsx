"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#findings", label: "Findings" },
  { href: "#recommendations", label: "Recommendations" },
  { href: "#methodology", label: "Method" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="site-header">
      <div className="site-shell flex h-[72px] items-center justify-between gap-6">
        <Link
          aria-label="BIT Patna Energy Audit home"
          className="group flex min-w-0 items-center gap-3"
          href="/"
        >
          <BrandMark className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:-rotate-2" />
          <span className="min-w-0 leading-none">
            <span className="block truncate text-[13px] font-semibold tracking-[-0.01em] text-ink">
              BIT Patna
            </span>
            <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Energy audit
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-border" />
          <Link className="nav-link nav-link-admin" href="/admin">
            Admin
          </Link>
        </nav>

        <button
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-soft md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
        </button>
      </div>

      <div className={`mobile-nav md:hidden ${open ? "mobile-nav-open" : ""}`}>
        <nav aria-label="Mobile navigation" className="site-shell grid py-3">
          {navItems.map((item) => (
            <a
              className="flex min-h-12 items-center justify-between border-b border-border/70 text-sm font-medium text-ink"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <span aria-hidden="true" className="text-muted">
                ↘
              </span>
            </a>
          ))}
          <Link
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-forest text-sm font-semibold text-white"
            href="/admin"
            onClick={() => setOpen(false)}
          >
            Open admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
