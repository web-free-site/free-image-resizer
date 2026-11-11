import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getTool, tools, pageSeo, canonical } from "@/lib/tools";
import { legalSlugs, legalPage, type LegalSlug } from "@/lib/legal";
import { ToolPageContent } from "@/components/ToolPageContent";
import { JsonLdScripts } from "@/lib/seo";

const allSlugs = [...tools.map((t) => t.slug), ...legalSlugs];

export function generateStaticParams() {
  return locales.flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (legalSlugs.includes(slug as LegalSlug)) {
    const p = legalPage(locale as Locale, slug as LegalSlug);
    const url = canonical(locale as Locale, slug);
    return { title: p.title, description: p.body[0], alternates: { canonical: url } };
  }
  const tool = getTool(slug);
  if (!tool) return {};
  const seo = pageSeo(locale as Locale, slug);
  const url = canonical(locale as Locale, slug);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: {
        en: canonical("en", slug),
        fr: canonical("fr", slug),
      },
    },
    openGraph: { title: seo.title, description: seo.description, url, type: "website" },
    twitter: { card: "summary", title: seo.title, description: seo.description },
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (legalSlugs.includes(slug as LegalSlug)) {
    const p = legalPage(locale as Locale, slug as LegalSlug);
    return (
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">{p.title}</h1>
        {p.body.map((para, i) => (
          <p key={i} className="mt-4 text-slate-600">
            {para}
          </p>
        ))}
      </article>
    );
  }
  const tool = getTool(slug);
  if (!tool) notFound();
  return (
    <>
      <JsonLdScripts locale={locale as Locale} slug={slug} />
      <ToolPageContent locale={locale as Locale} tool={tool} />
    </>
  );
}
