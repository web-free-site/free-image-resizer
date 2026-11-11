import type { Locale } from "./i18n";
import type { ProcessOptions } from "./image-process";

export type ToolId =
  | "home"
  | "resize-image"
  | "compress-image"
  | "crop-image"
  | "rotate-image"
  | "heic-to-jpg"
  | "webp-to-jpg"
  | "png-to-jpg"
  | "jpg-to-webp"
  | "batch-image";

export interface ToolPage {
  id: ToolId;
  slug: string;
  keyword: string;
  defaultOptions: Partial<ProcessOptions>;
  batch?: boolean;
}

export const tools: ToolPage[] = [
  { id: "resize-image", slug: "resize-image", keyword: "resize image", defaultOptions: { format: "jpeg" } },
  { id: "compress-image", slug: "compress-image", keyword: "compress image", defaultOptions: { quality: 75, format: "jpeg" } },
  { id: "crop-image", slug: "crop-image", keyword: "crop image", defaultOptions: { format: "jpeg" } },
  { id: "rotate-image", slug: "rotate-image", keyword: "rotate image", defaultOptions: { rotate: 90, format: "jpeg" } },
  { id: "heic-to-jpg", slug: "heic-to-jpg", keyword: "HEIC to JPG", defaultOptions: { format: "jpeg" } },
  { id: "webp-to-jpg", slug: "webp-to-jpg", keyword: "WebP to JPG", defaultOptions: { format: "jpeg" } },
  { id: "png-to-jpg", slug: "png-to-jpg", keyword: "PNG to JPG", defaultOptions: { format: "jpeg" } },
  { id: "jpg-to-webp", slug: "jpg-to-webp", keyword: "JPG to WebP", defaultOptions: { format: "webp", quality: 85 } },
  { id: "batch-image", slug: "batch-image", keyword: "batch image", defaultOptions: { format: "jpeg" }, batch: true },
];

export function getTool(slug: string): ToolPage | undefined {
  return tools.find((t) => t.slug === slug);
}

const SITE = "https://free-image-resizer.web-free.site";

export function canonical(locale: Locale, slug?: string): string {
  if (!slug) return `${SITE}/${locale}/`;
  return `${SITE}/${locale}/${slug}/`;
}

type FaqItem = { q: string; a: string };

const seoEn: Record<string, { title: string; description: string; h1: string; body: string[]; faq: FaqItem[] }> = {
  "resize-image": {
    title: "Free Resize Image Online — Pixels, Percent & Presets | Free Image Resizer",
    description:
      "Resize image free in your browser. Set exact pixels, scale by percent, or use Instagram, WhatsApp, and passport presets. No upload to servers.",
    h1: "Free resize image tool",
    body: [
      "Need to resize image free without uploading to a random server? Free Image Resizer runs entirely in your browser using fast WebAssembly codecs derived from Squoosh by Google Chrome Labs. Your photos stay on your device from the first click to the final download.",
      "Enter width and height in pixels, scale by percentage, or pick a preset for Instagram squares, WhatsApp stories, or passport-style photos. The tool keeps aspect ratio unless you unlock dimensions. Batch resize is available on our batch page when you need many files at once.",
      "Because processing is local, you can resize sensitive documents, family pictures, or client assets with confidence. There is no account, no watermark, and no file-size quota beyond what your browser can handle.",
    ],
    faq: [
      { q: "Is this resize image tool really free?", a: "Yes. Free Image Resizer is free to use with no sign-up." },
      { q: "Do my images get uploaded?", a: "No. All resizing happens locally in your browser." },
      { q: "Which formats are supported?", a: "JPG, PNG, WebP, AVIF, and HEIC input with JPG, PNG, WebP, or AVIF output." },
    ],
  },
  "compress-image": {
    title: "Free Compress Image — JPG, PNG, WebP, AVIF | Free Image Resizer",
    description:
      "Compress image free online with quality control for JPG, PNG, WebP, and AVIF. Client-side only; your files never leave your device.",
    h1: "Free compress image tool",
    body: [
      "Large photos slow down websites and fill storage. Our free compress image workflow shrinks file size while you control quality. Pick an output format—JPEG for photos, PNG for graphics, WebP or AVIF for modern web—and adjust the quality slider before you download.",
      "Compression uses the same family of WASM encoders popularized by Squoosh, running locally so you can compress confidential scans or product shots safely.",
      "Try compressing a few versions at different quality levels and compare file size in the results panel before you save.",
    ],
    faq: [
      { q: "Will compression reduce image quality?", a: "Lossy formats trade some detail for smaller files; you choose the quality level." },
      { q: "Can I compress PNG?", a: "Yes. Export as optimized PNG or convert to JPEG or WebP for smaller sizes." },
    ],
  },
  "crop-image": {
    title: "Free Crop Image Online | Free Image Resizer",
    description: "Crop image free in your browser. Drag to select the area you need and download instantly. No sign-up.",
    h1: "Free crop image tool",
    body: [
      "Use the crop image free tool to trim borders, focus on a subject, or match an aspect ratio before you resize or compress. Everything runs client-side with canvas preview so you see the result immediately.",
      "Pair cropping with our resize and compress tools via the footer links when you are preparing social graphics or thumbnails.",
    ],
    faq: [
      { q: "How do I crop?", a: "Upload an image, adjust the crop box, then click Apply and Download." },
    ],
  },
  "rotate-image": {
    title: "Free Rotate Image — 90° & Custom | Free Image Resizer",
    description: "Rotate image free online. Fix orientation in one click. Private, browser-based processing.",
    h1: "Free rotate image tool",
    body: [
      "Phone photos often arrive sideways. Rotate image free by 90° left or right, or enter a custom angle. Output stays on your device—ideal for quick fixes before email or chat.",
    ],
    faq: [
      { q: "Does rotation change quality?", a: "Rotation re-encodes once at your chosen quality; there is no server re-compression." },
    ],
  },
  "heic-to-jpg": {
    title: "Free HEIC to JPG Converter | Free Image Resizer",
    description: "Convert HEIC to JPG free in your browser. iPhone photos to JPEG without cloud upload.",
    h1: "Free HEIC to JPG converter",
    body: [
      "Apple devices save photos as HEIC. When you need JPEG for sharing or editing, convert HEIC to JPG free here. Conversion runs locally—nothing is sent to our servers.",
    ],
    faq: [
      { q: "Why HEIC?", a: "HEIC saves space on iPhones; JPG is more widely supported on the web and Windows." },
    ],
  },
  "webp-to-jpg": {
    title: "Free WebP to JPG Converter | Free Image Resizer",
    description: "Convert WebP to JPG free online. Client-side WebP decoder with instant JPEG download.",
    h1: "Free WebP to JPG converter",
    body: [
      "WebP is efficient but not everywhere supported. Convert WebP to JPG free for email attachments, print shops, or legacy software. All decoding uses WASM in your tab.",
    ],
    faq: [
      { q: "Is transparency preserved?", a: "JPG has no transparency; transparent areas are flattened on white." },
    ],
  },
  "png-to-jpg": {
    title: "Free PNG to JPG Converter | Free Image Resizer",
    description: "Convert PNG to JPG free to reduce file size. Browser-based, no account required.",
    h1: "Free PNG to JPG converter",
    body: [
      "PNG is great for graphics but heavy for photos. Convert PNG to JPG free when you need a smaller attachment. Tune quality before download.",
    ],
    faq: [
      { q: "Will text stay sharp?", a: "For UI screenshots, keep PNG or use high JPEG quality." },
    ],
  },
  "jpg-to-webp": {
    title: "Free JPG to WebP Converter | Free Image Resizer",
    description: "Convert JPG to WebP free for smaller web images. Private client-side encoding.",
    h1: "Free JPG to WebP converter",
    body: [
      "WebP often produces smaller files than JPEG at similar quality. Convert JPG to WebP free before publishing to your site or CDN.",
    ],
    faq: [
      { q: "Do all browsers support WebP?", a: "All modern browsers do; keep a JPEG fallback for very old clients." },
    ],
  },
  "batch-image": {
    title: "Free Batch Image Resizer — ZIP Download | Free Image Resizer",
    description: "Batch resize and compress images free. Process multiple files and download one ZIP.",
    h1: "Free batch image processing",
    body: [
      "Upload several images at once, apply the same resize or compress settings, and download a single ZIP. Batch image processing runs entirely in your browser—feasible for dozens of files depending on device memory.",
    ],
    faq: [
      { q: "How many files can I batch?", a: "Depends on your device; start with 10–20 images and add more if memory allows." },
    ],
  },
};

const seoFr: typeof seoEn = {
  "resize-image": {
    title: "Redimensionner image gratuit — pixels et présélections | Free Image Resizer",
    description:
      "Redimensionnez vos images gratuitement dans le navigateur. Pixels, pourcentage, presets Instagram et WhatsApp. Aucun envoi serveur.",
    h1: "Outil gratuit pour redimensionner une image",
    body: [
      "Redimensionnez vos photos sans les envoyer sur Internet. Free Image Resizer utilise des codecs WASM inspirés de Squoosh, directement sur votre appareil.",
      "Choisissez largeur et hauteur, un pourcentage ou un preset pour Instagram, WhatsApp ou passeport.",
    ],
    faq: [
      { q: "Est-ce vraiment gratuit ?", a: "Oui, sans inscription." },
      { q: "Mes images sont-elles envoyées ?", a: "Non, tout est local." },
    ],
  },
  "compress-image": {
    title: "Compresser image gratuit — JPG, WebP, AVIF | Free Image Resizer",
    description: "Compressez vos images gratuitement avec contrôle de qualité. 100 % dans le navigateur.",
    h1: "Compresser une image gratuitement",
    body: ["Réduisez la taille des fichiers pour le web ou l'email tout en gardant la confidentialité."],
    faq: [{ q: "Perte de qualité ?", a: "Vous réglez le curseur de qualité." }],
  },
  "crop-image": {
    title: "Rogner image gratuit | Free Image Resizer",
    description: "Rognez une image en ligne gratuitement, sans inscription.",
    h1: "Rogner une image gratuitement",
    body: ["Sélectionnez la zone à garder puis téléchargez le résultat."],
    faq: [{ q: "Comment rogner ?", a: "Importez, ajustez la zone, appliquez." }],
  },
  "rotate-image": {
    title: "Pivoter image gratuit | Free Image Resizer",
    description: "Faites pivoter une image gratuitement dans le navigateur.",
    h1: "Pivoter une image gratuitement",
    body: ["Corrigez l'orientation des photos en un clic."],
    faq: [{ q: "Angles supportés ?", a: "90° et angle personnalisé." }],
  },
  "heic-to-jpg": {
    title: "HEIC en JPG gratuit | Free Image Resizer",
    description: "Convertissez HEIC en JPG gratuitement, sans cloud.",
    h1: "Convertisseur HEIC vers JPG gratuit",
    body: ["Idéal pour les photos iPhone à partager en JPEG."],
    faq: [{ q: "Fichiers iPhone ?", a: "Oui, HEIC et HEIF." }],
  },
  "webp-to-jpg": {
    title: "WebP en JPG gratuit | Free Image Resizer",
    description: "Convertissez WebP en JPG gratuitement en local.",
    h1: "Convertisseur WebP vers JPG gratuit",
    body: ["Obtenez un JPEG compatible partout."],
    faq: [{ q: "Transparence ?", a: "Le JPG aplatit sur fond blanc." }],
  },
  "png-to-jpg": {
    title: "PNG en JPG gratuit | Free Image Resizer",
    description: "Convertissez PNG en JPG pour des fichiers plus légers.",
    h1: "Convertisseur PNG vers JPG gratuit",
    body: ["Réduisez la taille des captures et photos."],
    faq: [{ q: "Texte net ?", a: "Préférez PNG pour les interfaces." }],
  },
  "jpg-to-webp": {
    title: "JPG en WebP gratuit | Free Image Resizer",
    description: "Convertissez JPG en WebP pour le web.",
    h1: "Convertisseur JPG vers WebP gratuit",
    body: ["Des fichiers souvent plus petits que le JPEG."],
    faq: [{ q: "Compatibilité ?", a: "Tous les navigateurs récents." }],
  },
  "batch-image": {
    title: "Lot d'images gratuit — ZIP | Free Image Resizer",
    description: "Traitez plusieurs images et téléchargez un ZIP.",
    h1: "Traitement par lot gratuit",
    body: ["Appliquez les mêmes réglages à plusieurs fichiers."],
    faq: [{ q: "Combien de fichiers ?", a: "Selon la mémoire de l'appareil." }],
  },
};

export function pageSeo(locale: Locale, slug: string) {
  const pack = locale === "fr" ? seoFr : seoEn;
  return pack[slug] ?? seoEn["resize-image"];
}

export function homeSeo(locale: Locale) {
  if (locale === "fr") {
    return {
      title: "Free Image Resizer — Outils photo gratuits et privés",
      description:
        "Redimensionnez, compressez et convertissez des images gratuitement. Aucune inscription, traitement local.",
      h1: "Free Image Resizer — gratuit et privé",
      body: [
        "Tous les outils photo gratuits dont vous avez besoin : redimensionnement, compression, conversion HEIC, WebP, rognage et lot. Vos fichiers restent sur votre appareil.",
      ],
      faq: [
        { q: "Qui crée ce site ?", a: "Free Image Resizer est maintenu par Gentil M. à Kigali." },
      ],
    };
  }
  return {
    title: "Free Image Resizer — Resize, Compress & Convert Images Free",
    description:
      "Free online image tools: resize, compress, crop, rotate, convert HEIC/WebP/PNG/JPG. No sign-up; images stay on your device.",
    h1: "Free Image Resizer",
    body: [
      "One privacy-first suite for everyday image work. Built on browser WASM codecs from Squoosh by Google Chrome Labs. No uploads, no account, fast downloads.",
    ],
    faq: [
      { q: "Who built Free Image Resizer?", a: "Gentil M. in Kigali, Rwanda—free tools for everyone." },
    ],
  };
}
