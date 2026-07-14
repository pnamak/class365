"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navSections } from "./nav";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className="mb-8 px-2">
        <Link href="/" className="block" onClick={() => setOpen(false)}>
          <p className="display text-2xl text-white">Atrium</p>
          <p className="mt-1 text-xs tracking-[0.14em] text-white/55 uppercase">
            Campus OS
          </p>
        </Link>
      </div>

      <nav className="space-y-6 overflow-y-auto pb-8">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-2 text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${active ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded-xl bg-ink p-2.5 text-white shadow-lg lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-[linear-gradient(180deg,#102a43_0%,#0f3d3a_55%,#0f766e_140%)] px-4 py-6 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-white">Harbor Academy</p>
          <p className="mt-1 text-xs text-white/55">
            Spring 2026 · Unified campus workspace
          </p>
        </div>
      </aside>
    </>
  );
}
