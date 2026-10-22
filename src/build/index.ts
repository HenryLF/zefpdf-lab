#!/usr/bin/env bun
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { buildHTML } from "./html";
import { defaults, engines, isValidEngine, loadConfig } from "./config";
import { buildPDF } from "./pdf";
import { startDev } from "./server";
import type { Context } from "./types";

// No defaults here: an unset flag must stay undefined so the config fills it.
const { positionals, values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    config: { type: "string", short: "c" },
    dev: { type: "boolean" },
    engine: { type: "string" },
    out: { type: "string" },
    outdir: { type: "string" },
    port: { type: "string" },
  },
  allowPositionals: true,
});

let config = defaults;
if (values.config) {
  try {
    config = await loadConfig(values.config, defaults);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

const engine = values.engine ?? config.engine;
if (!isValidEngine(engine)) {
  console.error(`Unknown engine "${engine}", expected one of: ${engines.join(", ")}`);
  process.exit(1);
}

const root = process.cwd();
const outdir = resolve(root, values.outdir ?? config.outdir);

const context: Context = {
  ...config,
  engine,
  dev: values.dev ?? config.dev,
  input: resolve(root, positionals[0] ?? config.input),
  output: resolve(root, values.out ?? config.output),
  outdir,
  port: values.port ? Number(values.port) : config.port,
  root,
  html: resolve(outdir, "index.html"),
  css: [],
};

if (context.dev) {
  await startDev(context);
} else {
  try {
    await buildHTML(context);
    await buildPDF(context);
    console.log(`Wrote ${context.output}`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
