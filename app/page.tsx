import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ToolPageContent } from "@/components/ToolPageContent";
import { JsonLdScripts } from "@/lib/seo";
import { canonical, homeSeo } from "@/lib/tools";

const locale = "en" as const;
const seo = homeSeo(locale);
const url = canonical(locale);

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: url,
    languages: {
      en: canonical("en"),
      fr: canonical("fr"),
      "x-default": canonical("en"),
    },
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og.png"],
  },
};

export default function RootPage() {
  return (
    <>
      <JsonLdScripts locale={locale} />
      <SiteHeader locale={locale} />
      <main>
        <ToolPageContent locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
