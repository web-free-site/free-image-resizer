export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const siteName = "Free Image Resizer";

export function localePath(locale: Locale, path = ""): string {
  const base = `/${locale}`;
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const ui = {
  en: {
    tagline: "Resize, compress, and convert images free in your browser",
    privacyPitch:
      "No sign-up. Your images never leave your device. Fast WASM codecs.",
    dropImages: "Drop images here or click to browse",
    processing: "Processing…",
    download: "Download",
    downloadZip: "Download ZIP",
    batchMode: "Batch mode",
    width: "Width",
    height: "Height",
    percent: "Percent",
    quality: "Quality",
    format: "Output format",
    apply: "Apply",
    reset: "Reset",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right",
    crop: "Crop",
    language: "Language",
    tools: "Tools",
    footerBy: "by",
    footerLinks: {
      privacy: "Privacy",
      terms: "Terms",
      about: "About",
      contact: "Contact",
    },
    presets: {
      instagram: "Instagram square (1080×1080)",
      whatsapp: "WhatsApp story (1080×1920)",
      passport: "Passport 35×45mm (413×531 px)",
    },
  },
  fr: {
    tagline: "Redimensionnez, compressez et convertissez vos images gratuitement",
    privacyPitch:
      "Sans inscription. Vos images restent sur votre appareil. Codecs WASM rapides.",
    dropImages: "Déposez des images ici ou cliquez pour parcourir",
    processing: "Traitement…",
    download: "Télécharger",
    downloadZip: "Télécharger le ZIP",
    batchMode: "Mode lot",
    width: "Largeur",
    height: "Hauteur",
    percent: "Pourcentage",
    quality: "Qualité",
    format: "Format de sortie",
    apply: "Appliquer",
    reset: "Réinitialiser",
    rotateLeft: "Pivoter à gauche",
    rotateRight: "Pivoter à droite",
    crop: "Rogner",
    language: "Langue",
    tools: "Outils",
    footerBy: "par",
    footerLinks: {
      privacy: "Confidentialité",
      terms: "Conditions",
      about: "À propos",
      contact: "Contact",
    },
    presets: {
      instagram: "Carré Instagram (1080×1080)",
      whatsapp: "Story WhatsApp (1080×1920)",
      passport: "Passeport 35×45 mm (413×531 px)",
    },
  },
} as const;
