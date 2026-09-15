import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
describe("consulta e auditoria", () => {
  it("mostra contexto do termo viral com fonte sem inventar balão", () => {
    window.location.hash = "";
    render(<App />);
    fireEvent.change(screen.getByRole("textbox", { name: /Pesquisar conversas/ }), {target: {value: "peleleca"}});
    fireEvent.click(screen.getByRole("button", { name: "Contexto documental: peleleca" }));
    expect(screen.getByRole("complementary", {name: "Informações e fontes"})).toBeVisible();
    expect(screen.getAllByRole("link", {name: "Consultar fonte ↗"})[0]).toHaveAttribute("href", expect.stringContaining("folha.uol.com.br"));
  });
  it("abre evidência pelo botão direito", () => {
    render(<App />);
    fireEvent.contextMenu(screen.getByText("Chego 11 cravado?"));
    const dialog = screen.getByRole("menu");
    expect(
      within(dialog).getByRole("menuitem", { name: /Abrir PDF na página 19/ }),
    ).toHaveAttribute("href", expect.stringContaining("#page=19"));
  });
  it("busca sem acentos encontra conteúdo e navega ao resultado", () => {
    render(<App />);
    fireEvent.change(
      screen.getByRole("textbox", { name: /Pesquisar conversas/ }),
      { target: { value: "prestacao" } },
    );
    fireEvent.click(screen.getByRole("button", { name: /Prezado Daniel/ }));
    expect(
      screen.getByRole("region", { name: /Conversa com Vivi/ }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe("#mensagem=vivi-001");
  });
  it("permite abrir fonte pelo teclado", () => {
    window.location.hash = "";
    render(<App />);
    const message = screen.getByText("Chego 11 cravado?").closest("article")!;
    fireEvent.keyDown(message, { key: "F10", shiftKey: true });
    expect(screen.getByRole("menu")).toBeVisible();
  });
  it("explica fonte sem mensagens e limpa filtros", () => {
    window.location.hash = "";
    render(<App />);
    fireEvent.change(
      screen.getByRole("combobox", { name: "Filtrar por fonte" }),
      { target: { value: "stf-15556" } },
    );
    expect(screen.getByText("Nenhum resultado")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(
      screen.getByRole("button", { name: /Fábio Faria/ }),
    ).toBeInTheDocument();
  });
});
