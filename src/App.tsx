import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Copy,
  FileText,
  Info,
  MessageSquare,
  Moon,
  PlayCircle,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import {
  archive,
  formatDate,
  normalize,
  sourceUrl,
  type Conversation,
  type Message,
} from "./archive";
function Avatar({ contact }: { contact?: Conversation }) {
  return (
    <span className={`avatar ${contact?.color ?? ""}`}>
      <UserRound size={29} strokeWidth={1.4} />
    </span>
  );
}
function initialLink() {
  return archive.messages.find((m) => `#mensagem=${m.id}` === location.hash);
}
export default function App() {
  const linked = initialLink();
  const [active, setActive] = useState(linked?.conversationId ?? "fabio");
  const [mobileChat, setMobileChat] = useState(Boolean(linked));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<{
    message: Message;
    x: number;
    y: number;
  } | null>(null);
  const [highlight, setHighlight] = useState<string | null>(linked?.id ?? null);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("vorcarozap-theme") ?? "dark";
    } catch {
      return "dark";
    }
  });
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const conversation = archive.conversations.find((c) => c.id === active)!;
  const messages = archive.messages.filter((m) => m.conversationId === active);
  const sourceIds = new Set([...messages.flatMap(m => m.references.map(r => r.sourceId)), ...(conversation.editorialNotes ?? []).map(n => n.sourceId)]);
  const conversationSources = archive.sources.filter(s => sourceIds.has(s.id));
  const term = normalize(query.trim());
  const eligible = (m: Message) =>
    filter === "all" || m.references.some((r) => r.sourceId === filter);
  const results = archive.messages.filter(
    (m) => eligible(m) && normalize(m.text).includes(term),
  );
  const contacts = archive.conversations.filter(
    (c) =>
      archive.messages.some((m) => m.conversationId === c.id && eligible(m)) &&
      (!term ||
        normalize(c.name).includes(term) ||
        c.editorialNotes?.some(n => normalize(n.text).includes(term)) ||
        results.some((m) => m.conversationId === c.id)),
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("vorcarozap-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    if (highlight)
      document.getElementById(highlight)?.scrollIntoView({ block: "center" });
    else document.querySelector(".message-list")?.scrollTo({ top: 0 });
  }, [active, highlight]);
  useEffect(() => {
    const onHash = () => {
      const m = initialLink();
      if (m) {
        setActive(m.conversationId);
        setMobileChat(true);
        setHighlight(m.id);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const outside = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [menu]);
  function select(c: Conversation, m?: Message) {
    setActive(c.id);
    setMobileChat(true);
    setHighlight(m?.id ?? null);
    setMenu(null);
    setDrawer(false);
    if (m) location.hash = `mensagem=${m.id}`;
    else history.replaceState(null, "", location.pathname + location.search);
  }
  function audit(m: Message, element: HTMLElement, x?: number, y?: number) {
    triggerRef.current = element;
    const rect = element.getBoundingClientRect();
    setMenu({
      message: m,
      x: Math.max(8, Math.min(x ?? rect.right - 255, innerWidth - 280)),
      y: Math.max(8, Math.min(y ?? rect.bottom, innerHeight - 260)),
    });
  }
  async function share(m: Message) {
    const url = new URL(location.href);
    url.hash = `mensagem=${m.id}`;
    location.hash = url.hash;
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice("Link copiado");
    } catch {
      setNotice("Copie o link na barra de endereço");
    }
    setMenu(null);
  }
  return (
    <main className={`app-shell ${mobileChat ? "mobile-chat" : ""}`}>
      <nav className="rail" aria-label="Navegação principal">
        <button
          className="rail-button selected"
          aria-label="Conversas"
          onClick={() => {
            setMobileChat(false);
            setDrawer(false);
          }}
        >
          <MessageSquare size={24} />
        </button>
        <button
          className="rail-button"
          aria-label="Fontes documentais"
          onClick={() => setDrawer(!drawer)}
        >
          <BookOpen size={24} />
        </button>
        <div className="rail-bottom">
          <button
            className="rail-button"
            aria-label={
              theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={23} /> : <Moon size={23} />}
          </button>
          <a
            className="rail-button"
            aria-label="Documentação do projeto"
            href="https://github.com/valmojr/VorcaroZap#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Info size={23} />
          </a>
          <Avatar />
        </div>
      </nav>
      <aside className="sidebar">
        <header className="sidebar-title">
          <h1>Conversas</h1>
          <span className="wordmark">VorcaroZap</span>
        </header>
        <div className="search-box">
          <Search size={19} />
          <input
            ref={searchRef}
            aria-label="Pesquisar conversas e mensagens"
            placeholder="Pesquisar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Limpar busca" onClick={() => setQuery("")}>
              <X size={18} />
            </button>
          )}
        </div>
        <div className="filter-row">
          <button
            className={`pill ${filter === "all" ? "selected" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <select
            aria-label="Filtrar por fonte"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Fontes</option>
            {archive.sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="contact-list">
          {contacts.map((c) => {
            const list = archive.messages.filter(
              (m) => m.conversationId === c.id,
            );
            const last = list.at(-1)!;
            return (
              <div key={c.id}>
                <button
                  className={`contact ${active === c.id ? "active" : ""}`}
                  onClick={() => select(c)}
                >
                  <Avatar contact={c} />
                  <span className="contact-copy">
                    <span className="contact-name">
                      {c.name}
                      <time>
                        {last.date?.split("-").reverse().slice(0, 2).join("/")}
                      </time>
                    </span>
                    <span className="contact-preview">
                      {last.sender === "dv" ? "Você: " : ""}
                      {last.text}
                    </span>
                  </span>
                </button>
                {term &&
                  c.editorialNotes?.some(n => normalize(n.text).includes(term)) && <button className="search-result" onClick={() => {select(c);setDrawer(true);}}><Info size={14}/><span>Contexto documental: {query}</span></button>}
                {term &&
                  results
                    .filter((m) => m.conversationId === c.id)
                    .map((m) => (
                      <button
                        key={m.id}
                        className="search-result"
                        onClick={() => select(c, m)}
                      >
                        <Search size={14} />
                        <span>{m.text}</span>
                      </button>
                    ))}
              </div>
            );
          })}
          {!contacts.length && (
            <div className="empty">
              <Search size={30} />
              <p>Nenhum resultado</p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
        <footer className="sidebar-footer">
          Acervo independente · {archive.messages.length} registros
          <button
            aria-label="Informações do acervo"
            onClick={() => setDrawer(true)}
          >
            <Info size={15} />
          </button>
        </footer>
      </aside>
      <section
        className="chat"
        aria-label={`Conversa com ${conversation.name}`}
      >
        <header className="chat-header">
          <button
            className="icon-button back"
            aria-label="Voltar às conversas"
            onClick={() => setMobileChat(false)}
          >
            <ArrowLeft size={24} />
          </button>
          <Avatar contact={conversation} />
          <button
            aria-label="Abrir dados da conversa"
            className="chat-heading"
            onClick={() => setDrawer(!drawer)}
          >
            <h2>{conversation.name}</h2>
            <span>Recorte documental · {messages.length} registros</span>
          </button>
          <button
            className="icon-button"
            aria-label="Pesquisar no acervo"
            onClick={() => {
              setMobileChat(false);
              searchRef.current?.focus();
            }}
          >
            <Search size={23} />
          </button>
          <button
            className="icon-button"
            aria-label="Informações da conversa"
            onClick={() => setDrawer(!drawer)}
          >
            <Info size={23} />
          </button>
        </header>
        <div className="message-list" onScroll={() => setMenu(null)}>
          {messages.map((m, i) => (
            <div key={m.id}>
              {(i === 0 || m.date !== messages[i - 1].date) && (
                <div className="date-divider">
                  <span>{formatDate(m.date)}</span>
                </div>
              )}
              <article
                id={m.id}
                tabIndex={0}
                className={`message ${m.sender === "dv" ? "outgoing" : "incoming"} ${highlight === m.id ? "highlighted" : ""}`}
                aria-label={`Mensagem de ${m.sender === "dv" ? "Daniel Vorcaro" : conversation.name}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  audit(m, e.currentTarget, e.clientX, e.clientY);
                }}
                onKeyDown={(e) => {
                  if (
                    (e.shiftKey && e.key === "F10") ||
                    e.key === "ContextMenu"
                  ) {
                    e.preventDefault();
                    audit(m, e.currentTarget);
                  }
                }}
              >
                <button
                  className="message-action"
                  aria-label={`Ver fonte da mensagem ${m.id}`}
                  onClick={(e) => audit(m, e.currentTarget)}
                >
                  <ChevronDown size={20} />
                </button>
                {m.forwarded && (
                  <span className="forwarded">↪ Encaminhada{m.forwardedAuthor ? ` · ${m.forwardedAuthor}` : ""}</span>
                )}
                {m.kind === "note" && <span className="evidence-label">① Print de nota · {m.evidence === "chat" ? "visualização única" : "vínculo inferido pela PF"}</span>}
                {m.kind === "unavailable" && <span className="evidence-label">① Conteúdo indisponível</span>}
                {m.kind === "deleted" && <span className="evidence-label">⊘ Registro de exclusão</span>}
                {m.evidence === "news-quotation" && m.kind !== "audio-transcript" && <span className="evidence-label">Trecho citado na imprensa</span>}
                {m.kind === "audio-transcript" && <span className="evidence-label">{m.evidence === "news-quotation" ? "Áudio · trecho transcrito pela imprensa" : "Áudio · transcrição da PF · original indisponível"}</span>}
                {m.kind === "image" && <figure className="documentary-photo"><a href={`${import.meta.env.BASE_URL}${m.asset}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir imagem inteira: ${m.text}`}><img src={`${import.meta.env.BASE_URL}${m.asset}`} alt={m.text} loading="lazy"/></a><figcaption>Reprodução no relatório da PF · abrir imagem inteira</figcaption></figure>}
                {m.kind === "attachment" ? (
                  <div className="attachment">
                    <FileText size={32} />
                    <div>
                      <strong>{m.text}</strong>
                      <span>Arquivo indisponível</span>
                    </div>
                  </div>
                ) : (
                  <p className="message-text">{m.text}</p>
                )}
                {m.mediaSourceId && <a className="recording-link" href={sourceUrl(archive.sources.find(s => s.id === m.mediaSourceId)!)} target="_blank" rel="noopener noreferrer"><PlayCircle size={23}/><span>Ouvir áudio na publicação<small>Abre o site da fonte</small></span><ArrowUpRight size={16}/></a>}
                <div className="message-meta">
                  {m.note && (
                    <Info size={12} aria-label="Mensagem com nota documental" />
                  )}
                  <time
                    title={
                      m.time ? (m.timeZone === "unspecified" ? "Horário publicado; fuso não informado" : "UTC−03:00") : "Horário não informado ou não legível na fonte"
                    }
                  >
                    {m.time?.slice(0, 5) ?? "—"}
                  </time>
                </div>
              </article>
            </div>
          ))}
          <div className="end-note">Fim do recorte disponível</div>
        </div>
        <footer className="composer">
          <BookOpen size={22} />
          <span>Acervo em modo de leitura</span>
          <button onClick={() => setDrawer(true)}>
            Fontes <ArrowUpRight size={16} />
          </button>
        </footer>
      </section>
      {drawer && (
        <aside className="info-drawer" aria-label="Informações e fontes">
          <header>
            <button
              className="icon-button"
              aria-label="Fechar painel"
              onClick={() => setDrawer(false)}
            >
              <X size={24} />
            </button>
            <h2>Dados da conversa</h2>
          </header>
          <div className="drawer-content">
            <div className="contact-profile">
              <Avatar contact={conversation} />
              <h3>{conversation.name}</h3>
              <span>Nome conforme a fonte</span>
            </div>
            <section>
              <h3>Sobre este recorte</h3>
              <p>{conversation.context}</p>
              <small>{conversation.coverage}</small>
              {conversation.editorialNotes?.map(n => <p key={n.sourceId}>{n.text} <a href={sourceUrl(archive.sources.find(s => s.id === n.sourceId)!)} target="_blank" rel="noopener noreferrer">Consultar fonte ↗</a></p>)}
            </section>
            <section>
              <h3>Fontes</h3>
              {conversationSources.map((s) => (
                <a
                  key={s.id}
                  className="source-link"
                  href={sourceUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText size={23} />
                  <span>
                    {s.title}
                    <small>{s.host}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </section>
            <section>
              <h3>Notas documentais</h3>
              <p>
                Transcrições de uma amostra pública. Use o botão direito ou a
                seta na mensagem para consultar a página original.
              </p>
              {conversationSources.filter(s => s.context).map(s => (
                <details key={s.id}>
                  <summary>Contexto da fonte</summary>
                  <p>{s.context}</p>
                  <a
                    href={s.contextUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ler na imprensa ↗
                  </a>
                </details>
              ))}
              <p className="fine">Sem vínculo com WhatsApp ou Meta.</p>
            </section>
          </div>
        </aside>
      )}
      {menu && (
        <div
          className="message-menu"
          role="menu"
          aria-label="Ações da mensagem"
          ref={menuRef}
          style={{ left: menu.x, top: menu.y }}
          onKeyDown={(e) => {
            const items = Array.from(
              menuRef.current?.querySelectorAll<HTMLElement>(
                "[role=menuitem]",
              ) ?? [],
            );
            const i = items.indexOf(document.activeElement as HTMLElement);
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              items[
                (i + (e.key === "ArrowDown" ? 1 : items.length - 1)) %
                  items.length
              ]?.focus();
            }
            if (e.key === "Tab") setMenu(null);
          }}
        >
          {menu.message.references.map((r) => (
            <a
              role="menuitem"
              key={`${r.sourceId}-${r.page}`}
              href={sourceUrl(
                archive.sources.find((s) => s.id === r.sourceId)!,
                r,
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenu(null)}
            >
              <FileText size={18} />
              <span>
                {r.page ? `Abrir PDF na página ${r.page}` : "Abrir reportagem"}
                <small>
                  {archive.sources.find((s) => s.id === r.sourceId)?.title}
                  {r.figure ? ` · figura ${r.figure}` : ""}
                </small>
              </span>
              <ArrowUpRight size={15} />
            </a>
          ))}
          <button role="menuitem" onClick={() => share(menu.message)}>
            <Copy size={18} />
            Copiar link da mensagem
          </button>
          {menu.message.note && (
            <p className="menu-note">{menu.message.note}</p>
          )}
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}
