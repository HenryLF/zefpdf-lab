import { defineConfig } from "zefpdf-lab";

// Paths are relative to this file. CLI flags (--engine, --out, --outdir,
// --port) override these values.
//
// `bun run dev` / `bun run build` work on the one document set by `input` and
// `output`: point them at another src/<doc> to switch. `bun run build:all`
// ignores both and builds every index.tsx under src/, at any depth, to a pdf
// next to its folder (src/reports/q1/index.tsx -> src/reports/q1.pdf).
export default defineConfig({
  // entry .tsx whose default export is the document component
  input: "src/example/index.tsx",
  // where the pdf is written
  output: "src/example.pdf",
  // bundle and index.html; wiped on every build (build:all uses dist/<doc>)
  outdir: "dist",
  // "weasyprint" or "chromium", must be installed
  engine: "weasyprint",
  // dev server port (`bun run dev`)
  port: 3000,
  // engine binaries, if not on PATH under these names
  // paths: { weasyprint: "weasyprint", chromium: "chromium" },
  // dev rebuild settings
  // watch: { debounceMs: 100, ignore: ["node_modules", "dist", ".git"] },
});
