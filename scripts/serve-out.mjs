// Serveur de test local pour le dossier out/ : reproduit les réécritures de public/web.config (IIS).
// Usage : node scripts/serve-out.mjs [port]   (par défaut 3100)
// Les requêtes PHP (/site/send.php…) sont relayées vers le serveur PHP local s'il tourne (127.0.0.1:8080).
import { createServer, request } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.argv[2] ?? 3100);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".mp4": "video/mp4",
};

// Mêmes règles que public/web.config
const rewrites = [
  [/^\/(index\.html)?$/, "/index.html"],
  [/^\/site\/formulaire\.php$/, "/contact.html"],
  [/^\/Politique(?: |%20)de(?: |%20)confidentialit(?:é|%C3%A9|%c3%a9)\.html$/, "/politique-de-confidentialite.html"],
];
const redirects = [[/^\/Presentation(\.html)?$/, "/"], [/^\/site\/(contact\.php|index-4\.php|formulaire01\.php|index-41\.html)$/, "/site/formulaire.php"]];

createServer(async (req, res) => {
  // Test local : jamais de cache, pour voir chaque modification sans vider le navigateur
  res.setHeader("Cache-Control", "no-store, max-age=0");
  let path = req.url.split("?")[0];
  for (const [re, to] of redirects) if (re.test(path)) return res.writeHead(301, { Location: to }).end();
  if (path.endsWith(".php")) {
    if (path === "/site/formulaire.php") path = "/contact.html";
    else {
      const p = request({ host: "127.0.0.1", port: 8080, path: req.url, method: req.method, headers: req.headers }, (r) => {
        res.writeHead(r.statusCode, r.headers);
        r.pipe(res);
      });
      p.on("error", () => res.writeHead(502).end("Serveur PHP local absent (127.0.0.1:8080)"));
      return req.pipe(p);
    }
  }
  for (const [re, to] of rewrites) if (re.test(path)) path = to;
  let file = normalize(join(root, decodeURIComponent(path)));
  if (!file.startsWith(normalize(root))) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
  } catch {
    try {
      await stat(file + ".html");
      file += ".html";
    } catch {
      const body = await readFile(join(root, "404.html")).catch(() => "404");
      return res.writeHead(404, { "Content-Type": types[".html"] }).end(body);
    }
  }
  try {
    const body = await readFile(file);
    const type = types[extname(file).toLowerCase()] ?? "application/octet-stream";
    // Requêtes partielles (Range) : nécessaires pour se déplacer dans une vidéo, comme sur IIS
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      res.writeHead(206, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${body.length}`, "Content-Length": end - start + 1 });
      return res.end(body.subarray(start, end + 1));
    }
    res.writeHead(200, { "Content-Type": type, "Accept-Ranges": "bytes" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(port, "127.0.0.1", () => console.log(`out/ servi sur http://127.0.0.1:${port}`));
