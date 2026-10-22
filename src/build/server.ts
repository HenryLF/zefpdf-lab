import { watch } from "node:fs";
import { join, relative, sep } from "node:path";
import { buildHTML } from "./html";
import { buildPDF } from "./pdf";
import type { Context } from "./types";

const reloadScript = `<script>
new WebSocket("ws://" + location.host + "/__reload").onmessage = () => location.reload();
</script>`;

const noStore = { "Cache-Control": "no-store" };

/** Serve a file from outdir, refusing anything that escapes it. */
async function fromDist(context: Context, pathname: string) {
  const path = join(context.outdir, decodeURIComponent(pathname));
  if (!path.startsWith(context.outdir + sep)) return new Response("Forbidden", { status: 403 });

  const file = Bun.file(path);
  if (!(await file.exists())) return new Response("Not found", { status: 404 });
  return new Response(file, { headers: noStore });
}

/** Static server over outdir; `/index.html` is the raw page chromium prints. */
export function serveDist(context: Context, port: number) {
  return Bun.serve({
    port,
    fetch: (req) => fromDist(context, new URL(req.url).pathname),
  });
}

export async function startDev(context: Context) {
  const server = Bun.serve({
    port: context.port,
    routes: {
      // The preview gets the live-reload script; `/index.html` stays untouched for printing.
      "/": async () => {
        const html = await Bun.file(context.html).text();
        return new Response(html.replace("</body>", `${reloadScript}</body>`), {
          headers: { ...noStore, "Content-Type": "text/html" },
        });
      },
      "/pdf": () => new Response(Bun.file(context.output), { headers: noStore }),
      "/__reload": (req, server) =>
        server.upgrade(req) ? undefined : new Response("Upgrade failed", { status: 400 }),
    },
    fetch: (req) => fromDist(context, new URL(req.url).pathname),
    websocket: {
      open: (ws) => {
        ws.subscribe("reload");
      },
      message: () => {},
    },
  });

  context.url = server.url.origin;
  console.log(`Serving ${context.url}`);

  let running = false;
  let dirty = false;

  async function rebuild() {
    if (running) {
      dirty = true;
      return;
    }
    running = true;
    try {
      do {
        dirty = false;
        await step("html", () => buildHTML(context));
        server.publish("reload", "reload");
        await step(context.engine, () => buildPDF(context));
      } while (dirty);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    } finally {
      running = false;
    }
  }

  await rebuild();

  // The whole project, not just the input folder: documents import shared
  // components and styles from elsewhere in it.
  const dir = context.root;
  let timer: Timer | undefined;
  watch(dir, { recursive: true }, (_, file) => {
    if (!file) return;
    const abs = join(dir, file);
    const ignored =
      abs == context.output ||
      // Pdfs of other documents (build-all) are outputs, never sources.
      abs.endsWith(".pdf") ||
      abs.startsWith(context.outdir + sep) ||
      file.split(sep).some((part) => context.watch.ignore.includes(part));
    if (ignored) return;

    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`Changed ${relative(dir, abs)}`);
      rebuild();
    }, context.watch.debounceMs);
  });
}

async function step(name: string, fn: () => Promise<void>) {
  const start = performance.now();
  await fn();
  console.log(`  ${name} ${(performance.now() - start).toFixed(0)}ms`);
}
