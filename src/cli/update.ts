import { $ } from "bun";
import { join, resolve } from "node:path";

const toolRoot = resolve(import.meta.dir, "../..");

/**
 * `update`: rerun install.sh on the checkout this CLI runs from, which pulls
 * the latest main, reinstalls dependencies and relinks.
 */
export async function update(args: string[]) {
  if (args.length > 0) throw new Error("Usage: zefpdf-lab update");

  const out = await $`bash ${join(toolRoot, "install.sh")}`
    .env({ ...process.env, ZEFPDF_LAB_HOME: toolRoot })
    .nothrow();
  if (out.exitCode != 0) throw new Error(`Update failed (exit ${out.exitCode})`);
}
