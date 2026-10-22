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

## New project

```bash
zefpdf-lab create my-doc   # asks the project type, or pass --type single|multi
```

**single**: one document in `src/index.tsx`.

```bash
bun run dev     # preview on http://localhost:3000 (pdf at /pdf), rebuilds on save
bun run build   # writes my-doc.pdf
```

**multi**: one folder per document, sharing code through path aliases.

```
assets/        import { logo } from "@assets"   (bun run assets regenerates the barrel)
styles/        import "@styles/base.css"
components/    import { Header } from "@components/Header"
src/<doc>/index.tsx    (any depth: src/reports/q1/index.tsx)
```

```bash
bun run build:all   # every src/**/<doc>/index.tsx -> <doc>.pdf beside the folder
bun run dev         # the document set by input/output in zefpdf-lab.config.ts
bun run build
```

Settings live in `zefpdf-lab.config.ts`, picked up from the current folder
(or pass `--config`). Components are imported from `zefpdf-lab/ui/<Module>`
(e.g. `zefpdf-lab/ui/Titles`) or all at once from `zefpdf-lab/ui`.

## CLI

```
zefpdf-lab build [input.tsx] [--config file] [--engine weasyprint|chromium]
                 [--out file.pdf] [--outdir dir] [--port n] [--dev]
zefpdf-lab dev   [input.tsx] [flags]       same as build --dev
zefpdf-lab build-all [--config file] [--engine name]
                                           every src/**/<doc>/index.tsx to <doc>.pdf beside it
zefpdf-lab assets [dir] [--out file]       barrel of every image in dir (default assets)
zefpdf-lab create <dir> [--type single|multi]
zefpdf-lab update                          install the latest main
```

The entry point (`src/cli`) only dispatches: each command parses its own
arguments, in `src/build` (build, dev, build-all), `src/create` and
`src/cli/update.ts`. Project templates are `template/common` plus
`template/single` or `template/multi`.

## Working on zefpdf-lab itself

```bash
bun install
bun src/cli/index.ts dev --config config.ts
```
