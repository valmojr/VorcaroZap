import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
const guard = resolve("scripts/guard.mjs");
function fixture(run) {
  const dir = mkdtempSync(join(tmpdir(), "vorcarozap-guard-"));
  try {
    execFileSync("git", ["init", "-q"], { cwd: dir });
    writeFileSync(
      join(dir, "WhatsAppReal.html"),
      "SENTINELA SINTETICA: nenhum dado pessoal real.",
    );
    mkdirSync(join(dir, "src"));
    mkdirSync(join(dir, "public"));
    mkdirSync(join(dir, "dist"));
    writeFileSync(join(dir, ".gitignore"), "WhatsAppReal.html\n");
    run(dir, () =>
      spawnSync(process.execPath, [guard], { cwd: dir, encoding: "utf8" }),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
test("referência sintética não rastreada é permitida", () =>
  fixture((_, run) => assert.equal(run().status, 0)));
test("cópia renomeada em src é bloqueada", () =>
  fixture((dir, run) => {
    copyFileSync(
      join(dir, "WhatsAppReal.html"),
      join(dir, "src", "renomeado.html"),
    );
    assert.equal(run().status, 1);
  }));
test("índice é inspecionado mesmo quando cópia sai do arquivo de trabalho", () =>
  fixture((dir, run) => {
    copyFileSync(
      join(dir, "WhatsAppReal.html"),
      join(dir, "src", "renomeado.html"),
    );
    execFileSync("git", ["add", "src/renomeado.html"], { cwd: dir });
    writeFileSync(join(dir, "src", "renomeado.html"), "conteúdo diferente");
    assert.equal(run().status, 1);
  }));
test("ponteiro LFS não pode ser distribuído", () =>
  fixture((dir, run) => {
    writeFileSync(
      join(dir, "dist", "video.mp4"),
      "version https://git-lfs.github.com/spec/v1\noid sha256:fake\nsize 10\n",
    );
    assert.equal(run().status, 1);
  }));
test("cópia renomeada na raiz ainda não adicionada é bloqueada", () =>
  fixture((dir, run) => {
    copyFileSync(join(dir, "WhatsAppReal.html"), join(dir, "copia.html"));
    // A referência é permitida apenas quando ignorada, como no projeto.
    writeFileSync(join(dir, ".gitignore"), "WhatsAppReal.html\n");
    assert.equal(run().status, 1);
  }));
test("cópia renomeada removida do checkout permanece bloqueada no histórico", () =>
  fixture((dir, run) => {
    writeFileSync(join(dir, ".gitignore"), "WhatsAppReal.html\n");
    copyFileSync(join(dir, "WhatsAppReal.html"), join(dir, "copia.html"));
    execFileSync("git", ["add", "copia.html"], { cwd: dir });
    const commit = (message) => execFileSync("git", ["-c", "user.name=Teste", "-c", "user.email=teste@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", message], { cwd: dir });
    commit("fixture sintética");
    execFileSync("git", ["rm", "-q", "copia.html"], { cwd: dir });
    commit("remoção sintética");
    assert.equal(run().status, 1);
  }));
