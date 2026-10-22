import { rm } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import type { BunPlugin } from "bun";
import tailwind from "bun-plugin-tailwind";
import type { Context } from "./types";

/**
 * One preact instance for the document, the ui components and renderToString,
 * or hooks break. All three are bundled, and every preact import resolves to
 * this package's copy, whichever project the document lives in.
 */
const ownPreact: BunPlugin = {
  name: "own-preact",
  setup(build) {
    build.onResolve({ filter: /^preact(\/.*)?$|^preact-render-to-string$/ }, (args) => ({
      path: Bun.resolveSync(args.path, import.meta.dir),
    }));
  },
};

/** In-memory entry, next to the document, whose default export renders it to a string. */
function renderEntry(input: string) {
  const path = join(dirname(input), "__zefpdf-lab__.ts");
  const source = `import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import Doc from ${JSON.stringify("./" + basename(input))};
export default () => renderToString(h(Doc, null));
`;
  return { path, source };
}

/**
 * Bundle the document into `outdir` and record its css outputs. Returns the
 * absolute path of the bundled entry, which default-exports a render function.
 */
export async function bundle(context: Context) {
  // A fresh outdir and hashed names give every rebuild a new module path, so
  // Bun's module cache never serves a previous bundle.
  await rm(context.outdir, { recursive: true, force: true });

  const entry = renderEntry(context.input);
  const result = await Bun.build({
    entrypoints: [entry.path],
    files: { [entry.path]: entry.source },
    outdir: context.outdir,
    target: "bun",
    // Assets resolve next to index.html, for chromium (served) and weasyprint (file).
    publicPath: "./",
    naming: "[name]-[hash].[ext]",
    // Documents may live outside this project and its tsconfig.
    jsx: { runtime: "automatic", importSource: "preact" },
    // Report failures through result.logs, which carry file and line.
    throw: false,
    plugins: [ownPreact, tailwind],
  });

  if (!result.success) {
    const lines = result.logs.map((log) => {
      const at = log.position;
      return at ? `${at.file}:${at.line}:${at.column} ${log.message}\n  ${at.lineText}` : log.message;
    });
    throw new Error(lines.join("\n"));
  }

  const output = result.outputs.find((o) => o.kind == "entry-point" && o.path.endsWith(".js"));
  if (!output) throw new Error("Bundle produced no entry point");

  context.css = result.outputs
    .filter((o) => o.path.endsWith(".css"))
    .map((o) => relative(context.outdir, o.path));

  return output.path;
}

export async function renderHTML(context: Context, entry: string) {
  const render: () => string = (await import(entry)).default;
  const links = context.css.map((href) => `<link rel="stylesheet" href="./${href}">`).join("");
  const html = "<!doctype html>" + render().replace("</head>", `${links}</head>`);

  await Bun.write(context.html, html);
}

export async function buildHTML(context: Context) {
  await renderHTML(context, await bundle(context));
}
