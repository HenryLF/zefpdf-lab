import { $ } from "bun";
import { resolve } from "node:path";

const toolRoot = resolve(import.meta.dir, "../..");

/**
 * `update`: run the latest install.sh from origin/main on the checkout this
 * CLI runs from, which pulls main, reinstalls dependencies and relinks. The
 * script comes from origin, not this checkout, so fixes to it apply at once.
 */
export async function update(args: string[]) {
  if (args.length > 0) throw new Error("Usage: zefpdf-lab update");

  const fetched = await $`git -C ${toolRoot} fetch --quiet origin main`.nothrow();
  if (fetched.exitCode != 0) throw new Error(`Could not fetch origin main in ${toolRoot}`);

  const script = await $`git -C ${toolRoot} show origin/main:install.sh`.text();
  const out = await $`bash -s < ${new Response(script)}`
    .env({ ...process.env, ZEFPDF_LAB_HOME: toolRoot })
    .nothrow();
  if (out.exitCode != 0) throw new Error(`Update failed (exit ${out.exitCode})`);
}
