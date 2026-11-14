import "server-only";
import { del, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

const startsWith = (buf: Buffer, bytes: number[], offset = 0) => bytes.every((b, i) => buf[offset + i] === b);

/** Validates an uploaded file and stores it in Vercel Blob storage. Returns its public URL, or null when no file was sent. */
export async function storeUpload(file: unknown, kind: "image" | "sds"): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const limit = kind === "image" ? 8 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > limit) throw new Error(kind === "image" ? "Image is larger than 8 MB." : "SDS file is larger than 10 MB.");
  let buf: Buffer = Buffer.from(await file.arrayBuffer());
  let ext: string;
  let contentType: string;

  if (kind === "sds") {
    if (!startsWith(buf, [0x25, 0x50, 0x44, 0x46])) throw new Error("The SDS must be a PDF file.");
    ext = "pdf";
    contentType = "application/pdf";
  } else {
    const jpg = startsWith(buf, [0xff, 0xd8, 0xff]);
    const png = startsWith(buf, [0x89, 0x50, 0x4e, 0x47]);
    const webp = startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8);
    if (!jpg && !png && !webp) throw new Error("Product photos must be JPG, PNG or WebP.");
    ext = jpg ? "jpg" : png ? "png" : "webp";
    try {
      // Resize and compress when the sharp library is available.
      const sharp = (await import("sharp")).default;
      buf = await sharp(buf).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      ext = "webp";
    } catch {
      /* keep the original file */
    }
    contentType = ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";
  }

  const folder = kind === "sds" ? "sds" : "products";
  const blob = await put(`${folder}/${randomUUID()}.${ext}`, buf, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function removeUpload(publicUrl: string | null | undefined) {
  if (!publicUrl || !/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(publicUrl)) return;
  await del(publicUrl).catch(() => {});
}
