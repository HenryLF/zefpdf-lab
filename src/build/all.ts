import { Glob } from "bun";
import { dirname, join, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { build } from "./index";
import { defaults, findConfig, isPdfFile, loadConfig, mirroredPdf } from "./config";

/** Pdf directory when the config's `output` is a single pdf (or there is no config). */
const defaultPdfDir = "pdf";

/**
 * `build-all [--config file] [--engine name] [--out dir]`: build every
 * `index.tsx` under `src/`, at any depth, into a pdf directory mirroring `src/`
 * (`src/a/b/index.tsx` -> `pdf/a/b.pdf`), each bundled in its own
 * `<outdir>/a__b`. The pdf directory is `--out`, else the config's `output`,
 * else `pdf/` if `output` is a `.pdf` file. The config's `input` is ignored,
 * everything else applies to all documents.
 */
export async function buildAll(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      config: { type: "string", short: "c" },
      engine: { type: "string" },
      out: { type: "string" },
    },
  });

  const root = process.cwd();
  const configFile = values.config ?? (await findConfig(root));
  const config = configFile ? await loadConfig(configFile, defaults) : defaults;
  const outdir = resolve(root, config.outdir);
  const output = values.out ?? config.output;
  const pdfDir = resolve(root, isPdfFile(output) ? defaultPdfDir : output);

  const src = join(root, "src");
  const found = await Array.fromAsync(new Glob("**/index.tsx").scan({ cwd: src, absolute: true }));
  // src/index.tsx has no folder of its own to name its pdf after.
  const inputs = found.filter((input) => dirname(input) != src);
  if (inputs.length == 0) throw new Error(`No src/<doc>/index.tsx found in ${root}`);

  const passed = [
    ...(values.config ? ["--config", values.config] : []),
    ...(values.engine ? ["--engine", values.engine] : []),
  ];

  const failed: string[] = [];
  for (const input of inputs.sort()) {
    const name = relative(src, dirname(input));
    console.log(`${name}:`);
    try {
      // Flat, so wiping one document's outdir never wipes a nested one's.
      const docOutdir = join(outdir, name.split(sep).join("__"));
      const pdf = mirroredPdf(pdfDir, input, root);
      await build([input, "--out", pdf, "--outdir", docOutdir, ...passed]);
    } catch (err) {
      console.error(`  ${err instanceof Error ? err.message : err}`);
      failed.push(name);
    }
  }

  if (failed.length > 0) throw new Error(`Failed: ${failed.join(", ")}`);
}
