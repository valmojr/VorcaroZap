import { test, expect } from "@playwright/test";
test("consulta, auditoria, link direto e temas", async ({ page }, info) => {
  const requests: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4173")) requests.push(r.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Fábio Faria/ }).click();
  await page
    .getByRole("button", {
      name: "Ver fonte da mensagem fabio-003",
      exact: true,
    })
    .click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "Abrir PDF na página 19" }),
  ).toHaveAttribute("href", /#page=19$/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).not.toBeVisible();
  await page.goto("/#mensagem=vivi-001");
  await expect(page.locator("#vivi-001")).toBeInViewport();
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Voltar às conversas" }).click();
  await page.getByRole("button", { name: "Ativar tema claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(requests).toEqual([]);
});
test("pesquisa e interface sem resultados", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: /Pesquisar conversas/ })
    .fill("prestacao");
  await page.getByRole("button", { name: /Prezado Daniel/ }).click();
  await expect(page.locator("#vivi-001")).toBeInViewport();
  await page.locator("#vivi-001").click({ button: "right" });
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
});

test("notas auditáveis, mídia documental e contexto pesquisável", async ({ page }, info) => {
  await page.goto("/#mensagem=moraes-nota-139");
  const direct = page.locator("#moraes-nota-139");
  await expect(direct).toBeInViewport();
  await expect(page.getByRole("button", { name: "Informações da conversa", exact: true })).toBeInViewport();
  await expect(page.getByText("Acervo em modo de leitura", { exact: true })).toBeInViewport();
  await expect(direct).toContainText("Print de nota · visualização única");
  await direct.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: /Abrir PDF na página 139 / })).toHaveAttribute("href", /#page=139$/);
  await expect(page.getByRole("menuitem", { name: /Abrir PDF na página 2 / })).toHaveAttribute("href", /#page=2$/);
  await page.keyboard.press("Escape");
  await page.goto("/#mensagem=moraes-nota-045");
  await expect(page.locator("#moraes-nota-045")).toContainText("vínculo inferido pela PF");
  await page.goto("/#mensagem=ciro-foto-216");
  const photo = page.locator("#ciro-foto-216 img");
  await expect(photo).toBeInViewport();
  await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(183);
  await page.screenshot({ path: `tmp/qa/${info.project.name}-foto.png` });
  await page.goto("/#mensagem=luiz-renno-fig191-04");
  const invite = page.locator("#luiz-renno-fig191-04");
  await expect(invite).toBeInViewport();
  await expect(invite.getByRole("link", { name: /Abrir imagem inteira/ })).toHaveAttribute("href", "./assets/documentos/pf-fig191-convite.jpg");
  await expect.poll(() => invite.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(160);
  await invite.getByRole("button", { name: /Ver fonte/ }).click();
  await expect(page.getByRole("menuitem", { name: /Abrir PDF na página 185/ })).toHaveAttribute("href", /#page=185$/);
  await page.keyboard.press("Escape");
  await page.screenshot({ path: `tmp/qa/${info.project.name}-convite.png` });
  if (info.project.name === "mobile") await page.getByRole("button", { name: "Voltar às conversas" }).click();
  await page.getByRole("textbox", { name: /Pesquisar conversas/ }).fill("peleleca");
  await page.getByRole("button", { name: "Contexto documental: peleleca" }).click();
  await expect(page.getByText(/Sobre “peleleca”/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Consultar fonte" }).first()).toHaveAttribute("href", /folha.uol.com.br/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `tmp/qa/${info.project.name}-contexto.png` });
});

test("Flávio e relato sobre Lula têm gravação, fontes e atribuição corretas", async ({ page }, info) => {
  const external: string[] = [];
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:4173")) external.push(r.url()); });
  await page.goto("/#mensagem=flavio-audio-20250908");
  const audio = page.locator("#flavio-audio-20250908");
  await expect(audio).toContainText("trecho transcrito pela imprensa");
  await expect(audio).not.toContainText("transcrição da PF");
  await expect(audio.getByRole("link", {name: /Ouvir áudio/})).toHaveAttribute("href", /cnnbrasil.com.br\/politica\/ouca-o-audio/);
  await audio.click({button: "right"});
  await expect(page.getByRole("menuitem", {name: /Abrir reportagem.*CNN/})).toHaveAttribute("href", /cnnbrasil.com.br/);
  await page.keyboard.press("Escape");
  await page.screenshot({path: `tmp/qa/${info.project.name}-flavio.png`});
  await page.goto("/#mensagem=martha-lula-006");
  await expect(page.getByRole("region", {name: "Conversa com Martha Graeff"})).toBeVisible();
  await expect(page.locator("#martha-lula-006 time")).toHaveAttribute("title", "Horário publicado; fuso não informado");
  if (info.project.name === "mobile") await page.getByRole("button", {name: "Voltar às conversas"}).click();
  await page.getByRole("textbox", {name: /Pesquisar conversas/}).fill("Lula");
  await page.getByRole("button", {name: "Contexto documental: Lula"}).click();
  await expect(page.getByText(/Reunião com Lula no Palácio do Planalto:/)).toBeVisible();
  expect(external).toEqual([]);
});
