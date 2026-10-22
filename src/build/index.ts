import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { buildHTML } from "./html";
import { configNames, defaults, engines, findConfig, isValidEngine, loadConfig } from "./config";
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

  const root = process.cwd();
  const configFile = values.config ?? (await findConfig(root));
  const config = configFile ? await loadConfig(configFile, defaults) : defaults;

  const engine = values.engine ?? config.engine;
  if (!isValidEngine(engine)) {
    throw new Error(`Unknown engine "${engine}", expected one of: ${engines.join(", ")}`);
  }

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

  if (!(await Bun.file(context.input).exists())) {
    const hint = positionals[0]
      ? ""
      : configFile
        ? ` (input set in ${configFile})`
        : ` (no ${configNames[0]} in ${root}: pass --config or an input file)`;
    throw new Error(`Input not found: ${context.input}${hint}`);
  }

  if (context.dev) {
    await startDev(context);
  } else {
    await buildHTML(context);
    await buildPDF(context);
    console.log(`Wrote ${context.output}`);
  }
}
