import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { homeSeo } from "@/lib/tools";
import { canonical } from "@/lib/tools";
import { ToolPageContent } from "@/components/ToolPageContent";
import { JsonLdScripts } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = homeSeo(locale as Locale);
  const url = canonical(locale as Locale);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: { en: canonical("en"), fr: canonical("fr") },
    },
    openGraph: { title: seo.title, description: seo.description, url, type: "website" },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScripts locale={locale as Locale} />
      <ToolPageContent locale={locale as Locale} />
    </>
  );
}
