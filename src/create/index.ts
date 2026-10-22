import { $, Glob } from "bun";
import { readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";

const toolRoot = resolve(import.meta.dir, "../..");
const templateDir = join(toolRoot, "template");

const types = {
  single: "single document",
  multi: "multiple documents sharing assets, styles and components",
} as const;
type ProjectType = keyof typeof types;

const usage = `Usage: zefpdf-lab create <dir> [--type ${Object.keys(types).join("|")}]`;

function isType(s: unknown): s is ProjectType {
  return typeof s == "string" && s in types;
}

/** Ask on a terminal, default to `single` otherwise (scripts, CI). */
function askType(): ProjectType {
  if (!process.stdin.isTTY) return "single";

  const names = Object.keys(types) as ProjectType[];
  console.log("Project type:");
  names.forEach((name, i) => console.log(`  ${i + 1}. ${name}: ${types[name]}`));

  for (;;) {
    const answer = prompt("Choose [1]:")?.trim() || "1";
    const picked = names[Number(answer) - 1] ?? answer;
    if (isType(picked)) return picked;
    console.log(`Answer 1-${names.length} or a type name.`);
  }
}

/**
 * `create <dir> [--type single|multi]`: scaffold a document project from
 * `template/common` plus `template/<type>`, then install it.
 */
export async function create(args: string[]) {
  const { positionals, values } = parseArgs({
    args,
    options: { type: { type: "string", short: "t" } },
    allowPositionals: true,
  });
  const dir = positionals[0];
  if (!dir || positionals.length > 1) throw new Error(usage);
  if (values.type !== undefined && !isType(values.type)) {
    throw new Error(`Unknown type "${values.type}"\n${usage}`);
  }

  const target = resolve(dir);
  const existing = await readdir(target).catch(() => []);
  if (existing.length > 0) throw new Error(`${target} already exists and is not empty`);

  const type = values.type ?? askType();
  const pkg = await Bun.file(join(toolRoot, "package.json")).json();
  const vars: Record<string, string> = {
    name: basename(target),
    preact: pkg.dependencies.preact,
  };

  // The type's files are written last, so they win over common ones.
  for (const layer of ["common", type]) {
    const from = join(templateDir, layer);
    for await (const file of new Glob("**/*").scan({ cwd: from, dot: true })) {
      const text = await Bun.file(join(from, file)).text();
      await Bun.write(
        join(target, file),
        text.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match),
      );
    }
  }

  console.log(`Created a ${type} project in ${target}, installing...`);
  await $`bun install`.cwd(target);
  const next = type == "multi" ? "bun run build:all" : "bun run dev";
  console.log(`\nDone. Next:\n  cd ${dir}\n  ${next}`);
}
