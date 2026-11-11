"use client";

import { useEffect, useId, useRef, useState } from "react";

export type AdSlotId =
  | "banner728x90"
  | "banner468x60"
  | "banner300x250"
  | "banner160x600"
  | "banner160x300"
  | "banner320x50"
  | "nativeBanner";

type BannerMeta = { key: string; width: number; height: number };

type AdsConfig = {
  banners?: Partial<Record<AdSlotId, BannerMeta>>;
  nativeBanner?: string;
  popunder?: string;
  socialBar?: string;
  smartlink?: { url: string; label: string };
  _comment?: string;
};

const MIN_HEIGHT: Record<AdSlotId, number> = {
  banner728x90: 90,
  banner468x60: 60,
  banner300x250: 250,
  banner160x600: 600,
  banner160x300: 300,
  banner320x50: 50,
  nativeBanner: 120,
};

function bannerDocumentHtml(meta: BannerMeta): string {
  const atOptions = JSON.stringify({
    key: meta.key,
    format: "iframe",
    height: meta.height,
    width: meta.width,
    params: {},
  });
  const invoke = `https://www.highrevenueformat.com/${meta.key}/invoke.js`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer-when-downgrade"></head><body style="margin:0;padding:0;overflow:hidden;background:transparent"><script>atOptions = ${atOptions};<\/script><script src="${invoke}"><\/script></body></html>`;
}

function BannerFrame({ meta, label }: { meta: BannerMeta; label: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(bannerDocumentHtml(meta));
    doc.close();
  }, [meta]);

  return (
    <iframe
      ref={frameRef}
      title={label}
      width={meta.width}
      height={meta.height}
      className="max-w-full border-0"
      style={{ overflow: "hidden" }}
    />
  );
}

export function AdSlot({
  slot,
  className = "",
  label = "Advertisement",
}: {
  slot: AdSlotId;
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slotDomId = useId();
  const [banner, setBanner] = useState<BannerMeta | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const isBanner = slot.startsWith("banner");

  useEffect(() => {
    let cancelled = false;
    fetch("/ads.json")
      .then((r) => r.json())
      .then((cfg: AdsConfig) => {
        if (cancelled) return;
        if (isBanner) {
          setBanner(cfg.banners?.[slot] ?? null);
          return;
        }
        const code = (cfg.nativeBanner ?? "").trim();
        setHtml(code || null);
      })
      .catch(() => {
        setBanner(null);
        setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slot, isBanner]);

  useEffect(() => {
    if (!html || !containerRef.current || isBanner) return;
    containerRef.current.innerHTML = html;
    containerRef.current.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      for (const attr of Array.from(old.attributes)) s.setAttribute(attr.name, attr.value);
      s.text = old.text;
      old.replaceWith(s);
    });
  }, [html, isBanner]);

  const minH = MIN_HEIGHT[slot];
  const loaded = isBanner ? Boolean(banner?.key) : Boolean(html);

  return (
    <aside
      className={`ad-slot flex w-full flex-col items-center justify-center ${loaded ? "" : "rounded-lg border border-dashed border-teal-200/40 bg-slate-50/80"} ${className}`}
      style={{ minHeight: minH }}
      aria-label={label}
      data-ad-slot={slot}
    >
      {loaded && (
        <span className="mb-1 w-full text-center text-[10px] uppercase tracking-wide text-slate-400">
          {label}
        </span>
      )}
      {isBanner && banner ? <BannerFrame meta={banner} label={label} /> : null}
      {!isBanner && html ? (
        <div ref={containerRef} id={slotDomId} className="w-full overflow-hidden" />
      ) : null}
      {!loaded && (
        <span className="px-3 py-2 text-xs text-slate-400">Ad slot ({slot})</span>
      )}
    </aside>
  );
}

export function SponsoredLink() {
  const [link, setLink] = useState<{ url: string; label: string } | null>(null);

  useEffect(() => {
    fetch("/ads.json")
      .then((r) => r.json())
      .then((cfg: AdsConfig) => setLink(cfg.smartlink ?? null))
      .catch(() => setLink(null));
  }, []);

  if (!link?.url) return null;

  return (
    <p className="mt-4 text-center text-sm text-slate-500">
      <a
        href={link.url}
        rel="noopener noreferrer sponsored"
        target="_blank"
        className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
      >
        {link.label}
      </a>
    </p>
  );
}

export function GlobalAdScripts() {
  return null;
}
