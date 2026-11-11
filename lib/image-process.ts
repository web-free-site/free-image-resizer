/* Modified for Free Image Resizer — based on Squoosh by Google Chrome Labs (Apache-2.0) */

export type OutputFormat = "jpeg" | "png" | "webp" | "avif";

export interface ProcessOptions {
  width?: number;
  height?: number;
  percent?: number;
  quality?: number;
  format?: OutputFormat;
  rotate?: number;
  crop?: { x: number; y: number; w: number; h: number };
}

async function fileToImageData(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function imageDataToCanvas(data: ImageData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;
  canvas.getContext("2d")!.putImageData(data, 0, 0);
  return canvas;
}

async function resizeImageData(
  data: ImageData,
  targetW: number,
  targetH: number,
): Promise<ImageData> {
  const resize = (await import("@jsquash/resize")).default;
  return resize(data, {
    width: targetW,
    height: targetH,
    linearRGB: true,
    premultiply: true,
    method: "triangle",
  });
}

function applyCrop(data: ImageData, crop: ProcessOptions["crop"]): ImageData {
  if (!crop) return data;
  const canvas = imageDataToCanvas(data);
  const out = document.createElement("canvas");
  out.width = crop.w;
  out.height = crop.h;
  out.getContext("2d")!.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
  return out.getContext("2d")!.getImageData(0, 0, crop.w, crop.h);
}

function applyRotate(data: ImageData, degrees: number): ImageData {
  const canvas = imageDataToCanvas(data);
  const out = document.createElement("canvas");
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  out.width = Math.round(canvas.width * cos + canvas.height * sin);
  out.height = Math.round(canvas.width * sin + canvas.height * cos);
  const ctx = out.getContext("2d")!;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return ctx.getImageData(0, 0, out.width, out.height);
}

async function encodeImageData(
  data: ImageData,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  switch (format) {
    case "jpeg": {
      const { encode } = await import("@jsquash/jpeg");
      const buf = await encode(data, { quality });
      return new Blob([buf], { type: "image/jpeg" });
    }
    case "png": {
      const { encode } = await import("@jsquash/png");
      const buf = await encode(data);
      return new Blob([buf], { type: "image/png" });
    }
    case "webp": {
      const { encode } = await import("@jsquash/webp");
      const buf = await encode(data, { quality });
      return new Blob([buf], { type: "image/webp" });
    }
    case "avif": {
      const { encode } = await import("@jsquash/avif");
      const buf = await encode(data, { quality });
      return new Blob([buf], { type: "image/avif" });
    }
  }
}

export async function heicToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  const blob = Array.isArray(result) ? result[0] : result;
  return blob as Blob;
}

export async function processImageFile(
  file: File,
  options: ProcessOptions,
): Promise<Blob> {
  let workingFile = file;
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) {
    workingFile = new File([await heicToJpeg(file)], file.name.replace(/\.heic?$/i, ".jpg"), {
      type: "image/jpeg",
    });
  }

  let data = await fileToImageData(workingFile);

  if (options.rotate) {
    data = applyRotate(data, options.rotate);
  }

  if (options.crop) {
    data = applyCrop(data, options.crop);
  }

  let w = data.width;
  let h = data.height;

  if (options.percent && options.percent > 0 && options.percent !== 100) {
    w = Math.round((w * options.percent) / 100);
    h = Math.round((h * options.percent) / 100);
  }
  if (options.width) w = options.width;
  if (options.height) h = options.height;

  if (w !== data.width || h !== data.height) {
    data = await resizeImageData(data, w, h);
  }

  const format = options.format ?? guessFormat(file.name);
  const quality = options.quality ?? 85;
  return encodeImageData(data, format, quality);
}

function guessFormat(name: string): OutputFormat {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "png";
  if (ext === "webp") return "webp";
  if (ext === "avif") return "avif";
  return "jpeg";
}

export function extForFormat(format: OutputFormat): string {
  const map: Record<OutputFormat, string> = {
    jpeg: "jpg",
    png: "png",
    webp: "webp",
    avif: "avif",
  };
  return map[format];
}
