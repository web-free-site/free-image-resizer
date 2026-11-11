# Free Image Resizer

Privacy-first image tools for **Gentil M.** (Kigali, Rwanda): resize, compress, convert, crop, rotate, and batch export—free, no sign-up, all in the browser.

**Based on [Squoosh](https://github.com/GoogleChromeLabs/squoosh) by Google Chrome Labs** (Apache-2.0). WASM codecs via `@jsquash/*`. Original source reference in `vendor/squoosh/`. See `LICENSE` and `NOTICE`.

## Run locally

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4317

## Deploy (Cloudflare Workers + static assets)

```bash
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ACCOUNT_ID=9b2252baefadd95947f73bc833b3234f
npm run deploy
```

Worker name: `free-image-resizer` → `https://free-image-resizer.<your-subdomain>.workers.dev`

## Adsterra (`public/ads.json`)

`public/ads.json` format:

| Key | Format |
|-----|--------|
| `banners.banner728x90` etc. | `key`, `width`, `height` (each banner loads in its own iframe) |
| `nativeBanner` | HTML snippet |
| `popunder` / `socialBar` | Script URL (injected to head / body) |
| `smartlink` | `{ url, label: "Sponsored" }` — plain sponsored text link only |

Slots on site: 728×90 header (desktop), 320×50 mobile sticky, 468×60 + 300×250 mid-page, 160×600 + **160×300** sidebar, native below encode results, social bar + popunder site-wide.

## SEO pages

Per-locale static routes: `/en/resize-image/`, `/fr/heic-to-jpg/`, etc., plus privacy, terms, about, contact.

## License

Apache-2.0; modified files retain copyright notices per `NOTICE`.
