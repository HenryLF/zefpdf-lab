import { $ } from "bun";
import { serveDist } from "./server";
import type { Context } from "./types";

export async function buildPDF(context: Context) {
  switch (context.engine) {
    case "chromium":
      await chromiumBuild(context);
      break;
    case "weasyprint":
      await weasyprintBuild(context);
      break;
  }
}

async function chromiumBuild(context: Context) {
  // Outside dev mode there is no server yet: start one just for this print.
  const server = context.url ? null : serveDist(context, 0);
  const url = context.url ?? server!.url.origin;

  try {
    await run(
      $`${context.paths.chromium} --headless --no-pdf-header-footer --print-to-pdf=${context.output} ${url}/index.html`,
    );
  } finally {
    await server?.stop(true);
  }
}

async function weasyprintBuild(context: Context) {
  await run($`${context.paths.weasyprint} ${context.html} ${context.output}`);
}

async function run(cmd: $.ShellPromise) {
  const out = await cmd.quiet().nothrow();
  if (out.exitCode != 0) {
    throw new Error(`PDF engine exited with ${out.exitCode}\n${out.stderr.toString()}`);
  }
}
