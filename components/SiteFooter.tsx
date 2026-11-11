import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath, siteName, ui } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const legal = ["privacy", "terms", "about", "contact"] as const;
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{siteName}</p>
          <p className="mt-2 text-sm">
            {t.footerBy}{" "}
            <a href="https://gentil.quevvy.com" className="text-teal-400 hover:underline">
              Gentil M.
            </a>
            {" · Kigali, Rwanda"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Based on Squoosh by Google Chrome Labs (Apache-2.0). See NOTICE.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          {legal.map((key) => (
            <Link key={key} href={localePath(locale, key)} className="hover:text-white">
              {t.footerLinks[key]}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
