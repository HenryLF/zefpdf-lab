import { rm } from "node:fs/promises";
import { relative } from "node:path";
import tailwind from "bun-plugin-tailwind";
import type { ComponentType } from "preact";
import { renderToString } from "preact-render-to-string";
import type { Context } from "./types";

/**
 * Bundle the document into `outdir` and record its css outputs. Returns the
 * absolute path of the bundled entry.
 */
export async function bundle(context: Context) {
  // A fresh outdir and hashed names give every rebuild a new module path, so
  // Bun's module cache never serves a previous bundle.
  await rm(context.outdir, { recursive: true, force: true });

  const result = await Bun.build({
    entrypoints: [context.input],
    outdir: context.outdir,
    target: "bun",
    // Assets resolve next to index.html, for chromium (served) and weasyprint (file).
    publicPath: "./",
    naming: "[name]-[hash].[ext]",
    // Documents may live outside this project and its tsconfig.
    jsx: { runtime: "automatic", importSource: "preact" },
    // Report failures through result.logs, which carry file and line.
    throw: false,
    // One preact instance shared with renderToString, or hooks break.
    external: ["preact", "preact/*", "preact-render-to-string"],
    plugins: [tailwind],
  });

  if (!result.success) {
    const lines = result.logs.map((log) => {
      const at = log.position;
      return at ? `${at.file}:${at.line}:${at.column} ${log.message}\n  ${at.lineText}` : log.message;
    });
    throw new Error(lines.join("\n"));
  }

  const entry = result.outputs.find((o) => o.kind == "entry-point" && o.path.endsWith(".js"));
  if (!entry) throw new Error("Bundle produced no entry point");

  context.css = result.outputs
    .filter((o) => o.path.endsWith(".css"))
    .map((o) => relative(context.outdir, o.path));

  return entry.path;
}

export async function renderHTML(context: Context, entry: string) {
  const Doc: ComponentType = (await import(entry)).default;
  const links = context.css.map((href) => `<link rel="stylesheet" href="./${href}">`).join("");
  const html = "<!doctype html>" + renderToString(<Doc />).replace("</head>", `${links}</head>`);

  await Bun.write(context.html, html);
}

export async function buildHTML(context: Context) {
  await renderHTML(context, await bundle(context));
}
