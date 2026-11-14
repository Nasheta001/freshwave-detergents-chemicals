import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export function uploadDir(): string {
  return path.resolve(process.env.UPLOAD_DIR || "./uploads");
}

const startsWith = (buf: Buffer, bytes: number[], offset = 0) => bytes.every((b, i) => buf[offset + i] === b);

/** Validates and stores an uploaded file. Returns its public path, or null when no file was sent. */
export async function storeUpload(file: unknown, kind: "image" | "sds"): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const limit = kind === "image" ? 8 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > limit) throw new Error(kind === "image" ? "Image is larger than 8 MB." : "SDS file is larger than 10 MB.");
  let buf: Buffer = Buffer.from(await file.arrayBuffer());
  let ext: string;

  if (kind === "sds") {
    if (!startsWith(buf, [0x25, 0x50, 0x44, 0x46])) throw new Error("The SDS must be a PDF file.");
    ext = "pdf";
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
  }

  const name = `${randomUUID()}.${ext}`;
  await fs.mkdir(uploadDir(), { recursive: true });
  await fs.writeFile(path.join(uploadDir(), name), buf);
  return `/media/${name}`;
}

export async function removeUpload(publicPath: string | null | undefined) {
  if (!publicPath) return;
  const match = /^\/media\/([a-f0-9-]{36}\.(?:jpg|png|webp|pdf))$/.exec(publicPath);
  if (!match) return;
  await fs.unlink(path.join(uploadDir(), match[1])).catch(() => {});
}
