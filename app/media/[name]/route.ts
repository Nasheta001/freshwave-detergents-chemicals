import fs from "node:fs/promises";
import path from "node:path";
import { uploadDir } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const match = /^[a-f0-9-]{36}\.(jpg|png|webp|pdf)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(uploadDir(), name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": match[1] === "pdf" ? `inline; filename="safety-data-sheet.pdf"` : "inline",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
