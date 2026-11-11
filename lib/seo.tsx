import type { Locale } from "./i18n";
import { canonical, pageSeo, homeSeo, getTool } from "./tools";
import { siteName } from "./i18n";

export function buildJsonLd(locale: Locale, slug?: string) {
  const url = canonical(locale, slug);
  const seo = slug ? pageSeo(locale, slug) : homeSeo(locale);
  const tool = slug ? getTool(slug) : undefined;

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: seo.description,
    featureList: tool?.keyword ?? "Image resize, compress, convert",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const crumbs = [
    { name: locale === "fr" ? "Accueil" : "Home", url: canonical(locale) },
  ];
  if (slug) crumbs.push({ name: seo.h1, url });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };

  return [webApp, faq, breadcrumb];
}

export function JsonLdScripts({ locale, slug }: { locale: Locale; slug?: string }) {
  const data = buildJsonLd(locale, slug);
  return (
    <>
      {data.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
