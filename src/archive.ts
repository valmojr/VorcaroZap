import raw from "./data/archive.json";
export interface Source {
  id: string;
  kind: "pdf" | "news";
  title: string;
  publisher: string;
  host: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  pageCount?: number;
  sha256?: string;
  description: string;
  context?: string;
  contextUrl?: string;
}
export interface Reference {
  sourceId: string;
  page?: number;
  printedPage?: string;
  figure?: string;
}
export interface Message {
  id: string;
  conversationId: string;
  sender: "dv" | "contact";
  text: string;
  date: string | null;
  time: string | null;
  kind: "text" | "attachment" | "note" | "unavailable" | "deleted" | "audio-transcript" | "image";
  asset?: string;
  mediaSourceId?: string;
  timeZone?: "unspecified";
  forwardedAuthor?: string;
  evidence?: "chat" | "forensic-association" | "news-quotation";
  delivery?: "view-once" | "view-once-inferred";
  references: Reference[];
  note?: string;
  forwarded?: boolean;
}
export interface Conversation {
  id: string;
  name: string;
  initials: string;
  color: string;
  subtitle: string;
  context: string;
  coverage: string;
  editorialNotes?: { text: string; sourceId: string }[];
}
export interface Archive {
  updatedAt: string;
  sources: Source[];
  conversations: Conversation[];
  messages: Message[];
}
export const archive = raw as Archive;
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function sourceUrl(source: Source, reference?: Reference) {
  const url = new URL(source.url);
  if (source.kind === "pdf" && reference?.page)
    url.hash = `page=${reference.page}`;
  return url.href;
}
export function validateArchive(data: Archive) {
  const errors: string[] = [];
  for (const list of [data.sources, data.conversations, data.messages])
    if (new Set(list.map((x) => x.id)).size !== list.length)
      errors.push("Identificadores duplicados");
  for (const s of data.sources) {
    try {
      if (new URL(s.url).protocol !== "https:")
        errors.push(`URL insegura: ${s.id}`);
    } catch {
      errors.push(`URL inválida: ${s.id}`);
    }
  }
  for (const m of data.messages) {
    if (!data.conversations.some((c) => c.id === m.conversationId))
      errors.push(`Conversa ausente: ${m.id}`);
    if (!m.text.trim() || !m.references.length)
      errors.push(`Mensagem sem texto ou fonte: ${m.id}`);
    if (
      !["dv", "contact"].includes(m.sender) ||
      !["text", "attachment", "note", "unavailable", "deleted", "audio-transcript", "image"].includes(m.kind)
    )
      errors.push(`Tipo inválido: ${m.id}`);
    if (m.kind === "note" && (!m.evidence || !m.delivery || !m.note))
      errors.push(`Nota sem classificação documental: ${m.id}`);
    if (m.evidence === "forensic-association" && (m.kind !== "note" || m.delivery !== "view-once-inferred"))
      errors.push(`Inferência apresentada como envio direto: ${m.id}`);
    if (m.delivery === "view-once-inferred" && m.evidence !== "forensic-association")
      errors.push(`Visualização inferida sem evidência: ${m.id}`);
    if (m.kind === "unavailable" && !m.note)
      errors.push(`Mídia indisponível sem explicação: ${m.id}`);
    if (m.kind === "image" && (!m.asset || !/^assets\/[a-z0-9/-]+\.(jpg|png|webp)$/.test(m.asset) || !m.note))
      errors.push(`Imagem sem procedência ou caminho seguro: ${m.id}`);
    if (m.kind === "audio-transcript" && !m.note)
      errors.push(`Áudio sem nota de transcrição: ${m.id}`);
    if (m.mediaSourceId && (m.kind !== "audio-transcript" || !m.references.some(r => r.sourceId === m.mediaSourceId) || !data.sources.some(s => s.id === m.mediaSourceId)))
      errors.push(`Mídia externa sem fonte vinculada: ${m.id}`);
    if (m.timeZone && m.timeZone !== "unspecified")
      errors.push(`Fuso inválido: ${m.id}`);
    if (m.date && !/^\d{4}-\d{2}-\d{2}$/.test(m.date))
      errors.push(`Data inválida: ${m.id}`);
    if (m.time && !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(m.time))
      errors.push(`Horário inválido: ${m.id}`);
    for (const r of m.references) {
      const s = data.sources.find((s) => s.id === r.sourceId);
      if (!s) errors.push(`Fonte ausente: ${m.id}`);
      else if (
        s.kind === "pdf" &&
        (!Number.isInteger(r.page) ||
          r.page! < 1 ||
          r.page! > (s.pageCount ?? 0))
      )
        errors.push(`Página inválida: ${m.id}`);
    }
  }
  for (const c of data.conversations)
    for (const n of c.editorialNotes ?? [])
      if (!data.sources.some(s => s.id === n.sourceId) || !n.text.trim())
        errors.push(`Contexto editorial sem fonte: ${c.id}`);
  return errors;
}
export function formatDate(date: string | null) {
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))
    : "Data não informada";
}
