// Après `next build` : les pages des sites produits gardent leurs adresses d'origine en dossier
// (ex. /divalto.tn/gpao/, /sage.tn/sage-100/). Chaque X.html de ces dossiers est recopié en X/index.html,
// comme sur IIS (document par défaut). divalto.tn.html devient divalto.tn/index.html.
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const out = fileURLToPath(new URL("../out/", import.meta.url));
let n = 0;

async function copyAsIndex(html) {
  const dir = html.slice(0, -".html".length);
  await mkdir(dir, { recursive: true });
  await copyFile(html, join(dir, "index.html"));
  n++;
}

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith(".html") && e.name !== "index.html") await copyAsIndex(p);
  }
}

await copyAsIndex(join(out, "divalto.tn.html"));
await copyAsIndex(join(out, "bitrix24.tn.html"));
for (const site of ["divalto.tn", "sage.tn", "bitrix24.tn"]) await walk(join(out, site));
console.log(`postbuild : ${n} pages servies en dossier (divalto.tn, sage.tn, bitrix24.tn)`);
