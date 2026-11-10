import { defineConfig } from "zefpdf-lab";

const target = "src/example";

// Paths are relative to this file. CLI flags (--engine, --out, --outdir,
// --port) override these values.
//
// `bun run dev` / `bun run build` work on the one document set by `input`:
// point `target` at another src/<doc> to switch. `bun run build:all` ignores
// `input` and builds every index.tsx under src/, at any depth.
//
// Pdfs go to the `output` directory, which mirrors src/:
// src/reports/q1/index.tsx -> pdf/reports/q1.pdf.
export default defineConfig({
  // entry .tsx whose default export is the document component
  input: `${target}/index.tsx`,
  // pdf directory (a path ending in .pdf writes that single file instead)
  output: "pdf",
  // bundle and index.html; wiped on every build (build:all uses dist/<doc>)
  outdir: "dist",
  // "weasyprint" or "chromium", must be installed
  engine: "chromium",
  // dev server port (`bun run dev`)
  port: 3000,
  // engine binaries, if not on PATH under these names
  // paths: { weasyprint: "weasyprint", chromium: "chromium" },
  // dev rebuild settings
  // watch: { debounceMs: 100, ignore: ["node_modules", "dist", ".git"] },
});
