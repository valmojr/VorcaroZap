import { describe, expect, it } from "vitest";
import { archive, normalize, sourceUrl, validateArchive } from "./archive";
describe("integridade documental", () => {
  it("todas as mensagens têm fonte e página válida", () =>
    expect(validateArchive(archive)).toEqual([]));
  it("rejeita fonte inexistente e paginação inválida", () => {
    const copy = structuredClone(archive);
    copy.messages[0].references = [
      { sourceId: "ausente" },
      { sourceId: copy.sources[0].id, page: 999 },
    ];
    expect(validateArchive(copy)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Fonte ausente"),
        expect.stringContaining("Página inválida"),
      ]),
    );
  });
  it("rejeita identificadores duplicados e conversa inexistente", () => {
    const copy = structuredClone(archive);
    copy.messages.push(copy.messages[0]);
    copy.messages[1].conversationId = "ausente";
    expect(validateArchive(copy)).toEqual(
      expect.arrayContaining([
        "Identificadores duplicados",
        expect.stringContaining("Conversa ausente"),
      ]),
    );
  });
  it("links citam a página física correta", () =>
    expect(
      sourceUrl(archive.sources[0], archive.messages.find(m => m.id === "fabio-003")!.references[0]),
    ).toMatch(/#page=19$/));
  it("reportagens não recebem paginação fictícia", () =>
    expect(
      sourceUrl(
        {
          ...archive.sources[0],
          kind: "news",
          url: "https://example.org/noticia",
        },
        { sourceId: "x", page: 2 },
      ),
    ).toBe("https://example.org/noticia"));
  it("busca ignora acentuação", () => expect(normalize("Fábio")).toBe("fabio"));
  it("não converte anexo ausente em conteúdo inventado", () => {
    const attachments = archive.messages.filter((m) => m.kind === "attachment");
    expect(attachments.length).toBeGreaterThan(0);
    expect(attachments.every((m) => m.asset === undefined)).toBe(true);
    expect(attachments.every((m) => m.note?.includes("indisponível"))).toBe(
      true,
    );
  });
  it("distingue cinco prints vinculados ao chat das 47 associações forenses", () => {
    const notes = archive.messages.filter(m => m.conversationId === "moraes" && m.kind === "note");
    expect(notes).toHaveLength(52);
    expect(notes.filter(m => m.evidence === "chat" && m.delivery === "view-once")).toHaveLength(5);
    expect(notes.filter(m => m.evidence === "forensic-association" && m.delivery === "view-once-inferred")).toHaveLength(47);
    const copy = structuredClone(archive);
    copy.messages.find(m => m.evidence === "forensic-association")!.delivery = "view-once";
    expect(validateArchive(copy)).toContainEqual(expect.stringContaining("Inferência apresentada como envio direto"));
  });
  it("não inventa o conteúdo das respostas e preserva exclusões", () => {
    const incoming = archive.messages.filter(m => m.conversationId === "moraes" && m.sender === "contact");
    expect(incoming.filter(m => m.kind === "deleted")).toHaveLength(4);
    expect(incoming.filter(m => m.kind === "unavailable")).toHaveLength(4);
    expect(incoming.some(m => m.kind === "text" || m.kind === "note")).toBe(false);
  });
  it("não usa data da notícia nem resolve silenciosamente divergências", () => {
    expect(archive.messages.filter(m => m.references.some(r => r.sourceId === "folha-martha")).every(m => m.date === null && m.time === null)).toBe(true);
    expect(archive.messages.filter(m => m.conversationId === "ana-matos" && m.references.some(r => r.page === 216)).every(m => m.date === null && m.note?.includes("Divergência"))).toBe(true);
  });
  it("preserva data de envio e distingue áudio publicado de arquivo original", () => {
    const audio = archive.messages.find(m => m.id === "flavio-audio-20250908")!;
    expect(audio.date).toBe("2025-09-08");
    expect(audio.asset).toBeUndefined();
    expect(audio.mediaSourceId).toBe("cnn-audio-flavio");
    const copy = structuredClone(archive);
    copy.messages.find(m => m.id === audio.id)!.mediaSourceId = "stf-15556";
    expect(validateArchive(copy)).toContainEqual(expect.stringContaining("Mídia externa sem fonte vinculada"));
  });
  it("mantém relato sobre Lula na conversa com Martha e não inventa fuso", () => {
    const messages = archive.messages.filter(m => m.id.startsWith("martha-lula-"));
    expect(messages).toHaveLength(7);
    expect(messages.every(m => m.conversationId === "martha" && m.date === "2024-12-04" && m.timeZone === "unspecified")).toBe(true);
    expect(archive.conversations.some(c => c.id === "lula")).toBe(false);
  });
  it("contexto viral tem fonte e não vira mensagem fabricada", () => {
    expect(archive.conversations.find(c => c.id === "martha")?.editorialNotes?.[0].sourceId).toBe("folha-martha");
    expect(archive.messages.some(m => normalize(m.text).includes("peleleca"))).toBe(false);
  });
});
