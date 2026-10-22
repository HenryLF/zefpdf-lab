# zefpdf-lab

Write documents as preact components, get a PDF (through weasyprint or chromium).

## Install / update

Needs [bun](https://bun.com) and `weasyprint` or `chromium` on your PATH.

```bash
curl -fsSL https://raw.githubusercontent.com/HenryLF/zefpdf-lab/main/install.sh | bash
```

Run `zefpdf-lab update` (or the same command again) to update to the latest `main`. It clones the repo
into `~/.local/share/zefpdf-lab` (override with `ZEFPDF_LAB_HOME`) and runs
`bun link`, which puts it in bun's global `node_modules` and the `zefpdf-lab`
command in `~/.bun/bin`. Projects depend on `link:zefpdf-lab`, so they all
pick up the update.

## New document

```bash
zefpdf-lab create my-doc
cd my-doc
bun run dev     # preview on http://localhost:3000 (pdf at /pdf), rebuilds on save
bun run build   # writes my-doc.pdf
```

Settings live in `zefpdf-lab.config.ts`. Components are imported from
`zefpdf-lab/ui/<Module>` (e.g. `zefpdf-lab/ui/Titles`) or all at once from
`zefpdf-lab/ui`.

## CLI

```
zefpdf-lab build [input.tsx] [--config file] [--engine weasyprint|chromium]
                 [--out file.pdf] [--outdir dir] [--port n] [--dev]
zefpdf-lab dev   [input.tsx] [flags]   same as build --dev
zefpdf-lab create <dir>                scaffold a new document project
zefpdf-lab update                      install the latest main
```

The entry point (`src/cli`) only dispatches: each command parses its own
arguments, in `src/build`, `src/create` and `src/cli/update.ts`.

## Working on zefpdf-lab itself

```bash
bun install
bun src/cli/index.ts dev --config config.ts
```
