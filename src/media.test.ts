import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { archive } from "./archive";
import manifest from "../public/assets/manifest.json";

describe("procedência das imagens documentais", () => {
  it("cada imagem tem arquivo íntegro e manifesto vinculado à mesma página e figura", () => {
    const images = archive.messages.filter(m => m.kind === "image");
    expect(manifest).toHaveLength(images.length);
    for (const message of images) {
      const entry = manifest.find(item => item.messageId === message.id)!;
      expect(entry).toBeDefined();
      expect(entry.path).toBe(message.asset);
      expect(entry.path).toMatch(/^assets\/documentos\/[a-z0-9-]+\.jpg$/);
      expect(message.references).toContainEqual(expect.objectContaining({
        sourceId: entry.sourceId, page: entry.page, figure: entry.figure,
      }));
      const bytes = readFileSync(`public/${entry.path}`);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(entry.sha256);
      expect(bytes.subarray(0, 2).toString("hex")).toBe("ffd8");
    }
  });
});
