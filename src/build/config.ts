import { dirname, resolve } from "node:path";
import type { Config, PdfEngine, UserConfig } from "./types";

export const defaults: Config = {
  engine: "weasyprint",
  input: "./test/index.tsx",
  output: "output.pdf",
  outdir: "./dist",
  port: 3000,
  dev: false,
  paths: {
    weasyprint: "weasyprint",
    chromium: "chromium",
  },
  watch: {
    debounceMs: 100,
    ignore: ["node_modules", "dist", ".git"],
  },
};

export const engines: PdfEngine[] = ["weasyprint", "chromium"];

export function isValidEngine(s: unknown): s is PdfEngine {
  return typeof s == "string" && (engines as string[]).includes(s);
}

/** Typed identity, so a config file gets completion: `export default defineConfig({...})`. */
export function defineConfig(config: UserConfig) {
  return config;
}

/**
 * Load a config file (.ts, .js or .json with a default export) and merge it
 * over `base`. Its `input`, `output` and `outdir` are resolved against the
 * file's own folder, so the file works from any cwd.
 */
export async function loadConfig(path: string, base: Config): Promise<Config> {
  const file = resolve(path);
  if (!(await Bun.file(file).exists())) {
    throw new Error(`Config file not found: ${file}`);
  }

  const mod = await import(file);
  const user: UserConfig = mod.default ?? mod;
  const dir = dirname(file);
  const at = (p: string | undefined) => (p === undefined ? undefined : resolve(dir, p));

  const merged: Config = {
    ...base,
    ...user,
    paths: { ...base.paths, ...user.paths },
    watch: { ...base.watch, ...user.watch },
    input: at(user.input) ?? base.input,
    output: at(user.output) ?? base.output,
    outdir: at(user.outdir) ?? base.outdir,
  };

  if (!isValidEngine(merged.engine)) {
    throw new Error(`Unknown engine "${merged.engine}" in ${file}, expected one of: ${engines.join(", ")}`);
  }
  return merged;
}
