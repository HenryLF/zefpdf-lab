export type PdfEngine = "weasyprint" | "chromium";

/**
 * Everything a run can be told: `config.ts` holds the defaults, a `--config`
 * file is merged over them, and CLI flags override both.
 */
export type Config = {
  engine: PdfEngine;
  /** entry .tsx whose default export is the document component */
  input: string;
  /** pdf path */
  output: string;
  /** where the bundle and index.html are written */
  outdir: string;
  /** dev server port; build mode uses a random one */
  port: number;
  dev: boolean;
  /** engine binaries */
  paths: { weasyprint: string; chromium: string };
  watch: { debounceMs: number; ignore: string[] };
};

/**
 * What a config file passed with `--config` default-exports. Nested objects are
 * merged key by key, so `{ paths: { chromium: "google-chrome" } }` keeps the
 * default weasyprint path.
 */
export type UserConfig = Partial<Omit<Config, "paths" | "watch">> & {
  paths?: Partial<Config["paths"]>;
  watch?: Partial<Config["watch"]>;
};

/** Config resolved for a run: absolute paths, plus what the pipeline fills in as it goes. */
export type Context = Config & {
  root: string;
  /** absolute path of outdir/index.html */
  html: string;
  /** css outputs of the last bundle, relative to outdir */
  css: string[];
  /** base url of the running server; chromium prints from it */
  url?: string;
};
