import { Glob } from "bun";
import { dirname, join, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { build } from "./index";
import { defaults, findConfig, loadConfig } from "./config";

/**
 * `build-all [--config file] [--engine name]`: build every `index.tsx` under
 * `src/`, at any depth, to a pdf next to its folder (`src/a/b/index.tsx` ->
 * `src/a/b.pdf`), each in its own `<outdir>/a__b`. The config's `input` and
 * `output` are ignored, everything else applies to all documents.
 */
export async function buildAll(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      config: { type: "string", short: "c" },
      engine: { type: "string" },
    },
  });

  const root = process.cwd();
  const configFile = values.config ?? (await findConfig(root));
  const config = configFile ? await loadConfig(configFile, defaults) : defaults;
  const outdir = resolve(root, config.outdir);

  const src = join(root, "src");
  const found = await Array.fromAsync(new Glob("**/index.tsx").scan({ cwd: src, absolute: true }));
  // src/index.tsx has no folder of its own to name its pdf after.
  const inputs = found.filter((input) => dirname(input) != src);
  if (inputs.length == 0) throw new Error(`No src/<doc>/index.tsx found in ${root}`);

  const failed: string[] = [];
  for (const input of inputs.sort()) {
    const dir = dirname(input);
    const name = relative(src, dir);
    console.log(`${name}:`);
    try {
      // Flat, so wiping one document's outdir never wipes a nested one's.
      const docOutdir = join(outdir, name.split(sep).join("__"));
      await build([input, "--out", `${dir}.pdf`, "--outdir", docOutdir, ...args]);
    } catch (err) {
      console.error(`  ${err instanceof Error ? err.message : err}`);
      failed.push(name);
    }
  }

  if (failed.length > 0) throw new Error(`Failed: ${failed.join(", ")}`);
}
