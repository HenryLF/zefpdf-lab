import { $, Glob } from "bun";
import { readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";

const toolRoot = resolve(import.meta.dir, "../..");
const templateDir = join(toolRoot, "template");

/** `create <dir>`: scaffold a document project from `template/`, then install it. */
export async function create(args: string[]) {
  const { positionals } = parseArgs({ args, allowPositionals: true });
  const dir = positionals[0];
  if (!dir || positionals.length > 1) throw new Error("Usage: zefpdf-lab create <dir>");

  const target = resolve(dir);
  const existing = await readdir(target).catch(() => []);
  if (existing.length > 0) throw new Error(`${target} already exists and is not empty`);

  const pkg = await Bun.file(join(toolRoot, "package.json")).json();
  const vars: Record<string, string> = {
    name: basename(target),
    preact: pkg.dependencies.preact,
  };

  for await (const file of new Glob("**/*").scan({ cwd: templateDir, dot: true })) {
    const text = await Bun.file(join(templateDir, file)).text();
    await Bun.write(
      join(target, file),
      text.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match),
    );
  }

  console.log(`Created ${target}, installing...`);
  await $`bun install`.cwd(target);
  console.log(`\nDone. Next:\n  cd ${dir}\n  bun run dev`);
}
