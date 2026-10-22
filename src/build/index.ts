import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { buildHTML } from "./html";
import { defaults, engines, isValidEngine, loadConfig } from "./config";
import { buildPDF } from "./pdf";
import { startDev } from "./server";
import type { Context } from "./types";

/**
 * `build [input] [flags]`: bundle the document and print it, or with `--dev`
 * serve it and rebuild on change (the returned promise then resolves while the
 * server keeps running).
 */
export async function build(args: string[]) {
  // No defaults here: an unset flag must stay undefined so the config fills it.
  const { positionals, values } = parseArgs({
    args,
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

  const config = values.config ? await loadConfig(values.config, defaults) : defaults;

  const engine = values.engine ?? config.engine;
  if (!isValidEngine(engine)) {
    throw new Error(`Unknown engine "${engine}", expected one of: ${engines.join(", ")}`);
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
    await buildHTML(context);
    await buildPDF(context);
    console.log(`Wrote ${context.output}`);
  }
}
