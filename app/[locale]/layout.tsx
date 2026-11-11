import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return (
    <>
      <SiteHeader locale={locale as Locale} />
      <main>{children}</main>
      <SiteFooter locale={locale as Locale} />
    </>
  );
}
