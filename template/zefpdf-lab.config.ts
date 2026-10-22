import { defineConfig } from "zefpdf-lab";

// Paths are relative to this file. CLI flags (--engine, --out, --outdir,
// --port) override these values.
export default defineConfig({
  // entry .tsx whose default export is the document component
  input: "src/index.tsx",
  // where the pdf is written
  output: "{{name}}.pdf",
  // bundle and index.html; wiped on every build
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
