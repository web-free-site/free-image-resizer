"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ToolId } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/i18n";
import {
  extForFormat,
  processImageFile,
  type OutputFormat,
  type ProcessOptions,
} from "@/lib/image-process";
import { AdSlot } from "./AdSlot";
import JSZip from "jszip";
import { Download, ImagePlus, Loader2 } from "lucide-react";

type Props = {
  locale: Locale;
  toolId: ToolId;
  defaultOptions: Partial<ProcessOptions>;
  batch?: boolean;
};

export function ImageWorkbench({ locale, toolId, defaultOptions, batch }: Props) {
  const t = ui[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<ProcessOptions>({
    quality: defaultOptions.quality ?? 85,
    format: defaultOptions.format ?? "jpeg",
    width: defaultOptions.width,
    height: defaultOptions.height,
    percent: defaultOptions.percent,
    rotate: defaultOptions.rotate ?? 0,
  });

  const showResize = ["resize-image", "home", "batch-image"].includes(toolId);
  const showQuality = !["heic-to-jpg", "webp-to-jpg", "png-to-jpg"].includes(toolId) || true;
  const forcedFormat = useMemo<OutputFormat | undefined>(() => {
    if (toolId === "heic-to-jpg" || toolId === "webp-to-jpg" || toolId === "png-to-jpg") return "jpeg";
    if (toolId === "jpg-to-webp") return "webp";
    return undefined;
  }, [toolId]);

  const onPick = (list: FileList | null) => {
    if (!list?.length) return;
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.heic$/i.test(f.name));
    setFiles(batch ? arr : [arr[0]]);
    if (!batch && arr[0]) {
      setPreview(URL.createObjectURL(arr[0]));
    }
    setDownloadUrl(null);
    setResultSize(null);
  };

  const mergedOptions = useMemo(
    () => ({
      ...options,
      format: forcedFormat ?? options.format ?? "jpeg",
    }),
    [options, forcedFormat],
  );

  const resolveOptions = async (): Promise<ProcessOptions> => {
    const opts = { ...mergedOptions };
    if (toolId === "crop-image" && files[0]) {
      const bmp = await createImageBitmap(files[0]);
      const m = 0.08;
      opts.crop = {
        x: Math.round(bmp.width * m),
        y: Math.round(bmp.height * m),
        w: Math.round(bmp.width * (1 - 2 * m)),
        h: Math.round(bmp.height * (1 - 2 * m)),
      };
      bmp.close();
    }
    return opts;
  };

  const processAll = useCallback(async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const opts = await resolveOptions();
      if (batch && files.length > 1) {
        const zip = new JSZip();
        for (const file of files) {
          const blob = await processImageFile(file, opts);
          const base = file.name.replace(/\.[^.]+$/, "");
          zip.file(`${base}-free.${extForFormat(mergedOptions.format ?? "jpeg")}`, blob);
        }
        const z = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(z);
        setDownloadUrl(url);
        setResultSize(z.size);
      } else {
        const blob = await processImageFile(files[0], opts);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setPreview(url);
        setResultSize(blob.size);
      }
    } finally {
      setBusy(false);
    }
  }, [batch, files, mergedOptions]);

  const applyPreset = (w: number, h: number) => setOptions((o) => ({ ...o, width: w, height: h }));

  return (
    <div className="space-y-6">
      <DropZone
        onDrop={(e) => {
          e.preventDefault();
          onPick(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          id="fir-image-upload"
          name="images"
          type="file"
          accept="image/*,.heic,.heif"
          multiple={batch}
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
        <button
          type="button"
          className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-teal-500/50 bg-white px-6 py-12 text-center transition hover:border-teal-600 hover:bg-teal-50/50"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-10 w-10 text-teal-600" aria-hidden />
          <span className="text-lg font-medium text-slate-800">{t.dropImages}</span>
          <span className="text-sm text-slate-500">{t.privacyPitch}</span>
        </button>
        {preview && !batch && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={locale === "fr" ? "Aperçu de l’image" : "Image preview"}
            className="mx-auto mt-6 max-h-64 rounded-lg shadow-md"
          />
        )}
        {batch && files.length > 0 && (
          <p className="mt-4 text-sm text-slate-600">{files.length} file(s) selected</p>
        )}
      </DropZone>

      {showResize && (
        <div className="grid gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label htmlFor="fir-width" className="flex flex-col gap-1 text-sm">
            {t.width} (px)
            <input
              id="fir-width"
              name="width"
              type="number"
              min={1}
              className="rounded border border-slate-200 px-3 py-2"
              value={options.width ?? ""}
              onChange={(e) => setOptions((o) => ({ ...o, width: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </label>
          <label htmlFor="fir-height" className="flex flex-col gap-1 text-sm">
            {t.height} (px)
            <input
              id="fir-height"
              name="height"
              type="number"
              min={1}
              className="rounded border border-slate-200 px-3 py-2"
              value={options.height ?? ""}
              onChange={(e) => setOptions((o) => ({ ...o, height: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </label>
          <label htmlFor="fir-percent" className="flex flex-col gap-1 text-sm">
            {t.percent}
            <input
              id="fir-percent"
              name="percent"
              type="number"
              min={1}
              max={500}
              className="rounded border border-slate-200 px-3 py-2"
              value={options.percent ?? ""}
              onChange={(e) => setOptions((o) => ({ ...o, percent: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </label>
          {showQuality && (
            <label htmlFor="fir-quality" className="flex flex-col gap-1 text-sm">
              {t.quality}
              <input
                id="fir-quality"
                name="quality"
                type="range"
                min={30}
                max={100}
                value={options.quality ?? 85}
                onChange={(e) => setOptions((o) => ({ ...o, quality: Number(e.target.value) }))}
              />
            </label>
          )}
        </div>
      )}

      {showResize && (
        <div className="flex flex-wrap gap-2">
          <PresetButton label={t.presets.instagram} onClick={() => applyPreset(1080, 1080)} />
          <PresetButton label={t.presets.whatsapp} onClick={() => applyPreset(1080, 1920)} />
          <PresetButton label={t.presets.passport} onClick={() => applyPreset(413, 531)} />
        </div>
      )}

      {toolId === "rotate-image" && (
        <div className="flex flex-wrap gap-2">
          <PresetButton label={t.rotateLeft} onClick={() => setOptions((o) => ({ ...o, rotate: (o.rotate ?? 0) - 90 }))} />
          <PresetButton label={t.rotateRight} onClick={() => setOptions((o) => ({ ...o, rotate: (o.rotate ?? 0) + 90 }))} />
        </div>
      )}

      {!forcedFormat && (
        <label htmlFor="fir-format" className="flex flex-col gap-1 text-sm">
          {t.format}
          <select
            id="fir-format"
            name="format"
            className="max-w-xs rounded border border-slate-200 px-3 py-2"
            value={options.format ?? "jpeg"}
            onChange={(e) => setOptions((o) => ({ ...o, format: e.target.value as OutputFormat }))}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
        </label>
      )}

      <button
        type="button"
        disabled={!files.length || busy}
        onClick={() => processAll()}
        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-semibold text-white shadow hover:bg-teal-700 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {t.apply}
      </button>

      {downloadUrl && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4">
          <p className="mb-2 text-sm text-slate-700">
            {resultSize ? `Output: ${(resultSize / 1024).toFixed(1)} KB` : null}
          </p>
          <AdSlot slot="nativeBanner" className="mb-4" />
          <a
            href={downloadUrl}
            download={batch ? "free-images.zip" : `free-image.${extForFormat(mergedOptions.format ?? "jpeg")}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            <Download className="h-4 w-4" />
            {batch ? t.downloadZip : t.download}
          </a>
        </div>
      )}
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-teal-500"
    >
      {label}
    </button>
  );
}

function DropZone({
  children,
  onDrop,
}: {
  children: React.ReactNode;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      {children}
    </div>
  );
}
