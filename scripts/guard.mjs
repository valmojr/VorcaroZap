import { readdirSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join } from "node:path";
const fail = (message) => {
  console.error(`Proteção: ${message}`);
  process.exitCode = 1;
};
const forbidden = /(^|\/)WhatsAppReal(?:\.html|_files)(\/|$)/i;
function walk(root) {
  return !existsSync(root)
    ? []
    : readdirSync(root, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(root, e.name)) : [join(root, e.name)],
      );
}
let tracked = [];
let candidates = [];
try {
  tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
  candidates = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], { encoding: "utf8" })
    .split("\0").filter(Boolean);
} catch {
  fail("Não foi possível verificar o índice Git.");
}
for (const p of tracked)
  if (forbidden.test(p))
    fail(
      "Exportação pessoal encontrada no índice. Remova-a do índice sem apagar o original.",
    );
try {
  const history = execFileSync(
    "git",
    ["log", "--all", "--format=", "--name-only"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
  if (history.split("\n").some((p) => forbidden.test(p)))
    fail("Exportação pessoal encontrada no histórico.");
} catch {
  fail("Não foi possível verificar o histórico Git.");
}
const sensitive = ["WhatsAppReal.html", ...walk("WhatsAppReal_files")].filter(
  existsSync,
);
const hashes = new Set(
  sensitive.map((p) =>
    createHash("sha256").update(readFileSync(p)).digest("hex"),
  ),
);
// Sem gravar objetos ou divulgar o conteúdo da referência pessoal.
try {
  const privateObjects = new Set(sensitive.map((p) =>
    execFileSync("git", ["hash-object", "--stdin"], {
      input: readFileSync(p), encoding: "utf8",
    }).trim(),
  ));
  const objects = execFileSync("git", ["rev-list", "--objects", "--all"], {
    encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
  });
  if (objects.split("\n").some((line) => privateObjects.has(line.split(" ")[0])))
    fail("Cópia integral da referência pessoal encontrada no histórico, mesmo renomeada.");
} catch {
  fail("Não foi possível verificar cópias pessoais no histórico.");
}
for (const p of tracked.filter((p) => !forbidden.test(p))) {
  try {
    const blob = execFileSync("git", ["show", `:${p}`], {
      maxBuffer: 32 * 1024 * 1024,
    });
    if (hashes.has(createHash("sha256").update(blob).digest("hex")))
      fail(`Cópia pessoal no conteúdo preparado para commit: ${p}`);
  } catch {
    fail(`Não foi possível inspecionar arquivo preparado: ${p}`);
  }
}
for (const p of [
  ...new Set([
    ...tracked.filter((p) => !forbidden.test(p) && existsSync(p)),
    ...candidates,
    ...walk("src"),
    ...walk("public"),
    ...walk("dist"),
  ]),
]) {
  const data = readFileSync(p);
  if (
    forbidden.test(p) ||
    hashes.has(createHash("sha256").update(data).digest("hex"))
  )
    fail(`Cópia de arquivo pessoal detectada: ${p}`);
  if (
    (p.startsWith("dist/") ||
      p.startsWith("public/") ||
      p.startsWith("src/")) &&
    /WhatsAppReal(?:\.html|_files)|web\.whatsapp\.com|static\.whatsapp\.net/.test(
      data.toString(),
    )
  )
    fail(`Referência à exportação pessoal ou runtime do WhatsApp: ${p}`);
  if (
    (p.startsWith("dist/") || p.startsWith("public/assets/")) &&
    data
      .toString("utf8", 0, 80)
      .startsWith("version https://git-lfs.github.com/spec/v1")
  )
    fail(`Ponteiro LFS sem arquivo real: ${p}. Execute git lfs pull.`);
}
if (!process.exitCode)
  console.log(
    "Proteção OK: exportação pessoal fora do índice, do histórico e do build; nenhum ponteiro LFS distribuído.",
  );
