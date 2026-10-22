#!/usr/bin/env bun
import { build } from "../build";
import { buildAll } from "../build/all";
import { create } from "../create";
import { update } from "./update";

const usage = `Usage:
  zefpdf-lab build [input.tsx] [--config file] [--engine weasyprint|chromium]
                   [--out file.pdf] [--outdir dir] [--port n] [--dev]
  zefpdf-lab dev   [input.tsx] [flags]   same as build --dev
  zefpdf-lab build-all [--config file] [--engine name]
                                         every src/**/<doc>/index.tsx to <doc>.pdf beside it
  zefpdf-lab create <dir> [--type single|multi]
                                         scaffold a new project (asks the type)
  zefpdf-lab update                      install the latest main`;

const commands: Record<string, (args: string[]) => Promise<void>> = {
  build,
  dev: (args) => build([...args, "--dev"]),
  "build-all": buildAll,
  create,
  update,
};

const [name, ...args] = Bun.argv.slice(2);

if (!name || name == "help" || name == "--help" || name == "-h") {
  console.log(usage);
  process.exit(name ? 0 : 1);
}

const command = commands[name];
if (!command) {
  console.error(`Unknown command "${name}"\n\n${usage}`);
  process.exit(1);
}

try {
  await command(args);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
