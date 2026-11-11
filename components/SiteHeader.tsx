import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath, siteName, ui, locales } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { AdSlot } from "./AdSlot";
import { Logo } from "./Logo";

export function SiteHeader({ locale, currentSlug }: { locale: Locale; currentSlug?: string }) {
  const t = ui[locale];
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href={localePath(locale)} className="flex items-center gap-2">
          <Logo className="h-9 w-9" />
          <span className="text-lg font-bold text-slate-900">{siteName}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm" aria-label={t.tools}>
          {tools.slice(0, 5).map((tool) => (
            <Link
              key={tool.slug}
              href={localePath(locale, tool.slug)}
              className={
                currentSlug === tool.slug ? "font-semibold text-teal-700" : "text-slate-600 hover:text-teal-600"
              }
            >
              {tool.keyword.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">{t.language}:</span>
          {locales.map((loc) => (
            <Link
              key={loc}
              href={currentSlug ? localePath(loc, currentSlug) : localePath(loc)}
              hrefLang={loc}
              className={loc === locale ? "font-bold text-teal-700" : "text-slate-600"}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto hidden max-w-6xl px-4 pb-3 md:block">
        <AdSlot slot="banner728x90" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <AdSlot slot="banner320x50" className="sticky bottom-0 z-40" />
      </div>
    </header>
  );
}
