import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { archive } from "./archive";
import manifest from "../public/assets/manifest.json";

it("a imagem exibida corresponde ao arquivo e à página registrados no manifesto", () => {
  const images = archive.messages.filter(m => m.kind === "image");
  expect(manifest).toHaveLength(images.length);
  for (const media of manifest) {
    const message = images.find(m => m.id === media.messageId);
    expect(message?.asset).toBe(media.path);
    expect(message?.references).toContainEqual(expect.objectContaining({ sourceId: media.sourceId, page: media.page }));
    const bytes = readFileSync(`public/${media.path}`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(media.sha256);
  }
});
