import type { Locale } from "./i18n";

export const legalSlugs = ["privacy", "terms", "about", "contact"] as const;
export type LegalSlug = (typeof legalSlugs)[number];

export function legalPage(locale: Locale, slug: LegalSlug) {
  const en: Record<LegalSlug, { title: string; body: string[] }> = {
    privacy: {
      title: "Privacy Policy — Free Image Resizer",
      body: [
        "Free Image Resizer processes images entirely in your browser. We do not receive, store, or analyze your image files.",
        "We may show advertisements from Adsterra; their partners may use cookies per their policy. WASM codecs load lazily when you use a tool.",
        "Contact: gentil@quevvy.com for privacy questions.",
      ],
    },
    terms: {
      title: "Terms of Use — Free Image Resizer",
      body: [
        "Free Image Resizer is provided as-is by Gentil M. You are responsible for complying with laws when editing images you do not own.",
        "Software includes Apache-2.0 components from Squoosh by Google Chrome Labs; see LICENSE and NOTICE.",
      ],
    },
    about: {
      title: "About Free Image Resizer",
      body: [
        "Free Image Resizer is a free, privacy-first suite for resize, compress, convert, crop, and rotate built for everyone, starting from Kigali, Rwanda.",
        "It uses client-side WebAssembly codecs derived from Squoosh. No sign-up required.",
      ],
    },
    contact: {
      title: "Contact",
      body: [
        "Email Gentil M. at gentil@quevvy.com or visit https://gentil.quevvy.com.",
      ],
    },
  };
  const fr: typeof en = {
    privacy: {
      title: "Confidentialité — Free Image Resizer",
      body: [
        "Vos images ne quittent pas votre appareil. Les publicités Adsterra peuvent utiliser des cookies selon leur politique.",
        "Contact : gentil@quevvy.com",
      ],
    },
    terms: {
      title: "Conditions — Free Image Resizer",
      body: ["Service fourni tel quel. Voir LICENSE pour les composants Apache-2.0."],
    },
    about: {
      title: "À propos",
      body: ["Outils photo gratuits et privés, maintenus par Gentil M. à Kigali."],
    },
    contact: {
      title: "Contact",
      body: ["gentil@quevvy.com — https://gentil.quevvy.com"],
    },
  };
  return (locale === "fr" ? fr : en)[slug];
}
