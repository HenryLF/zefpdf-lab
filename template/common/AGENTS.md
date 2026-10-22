# AGENTS.md

This project builds PDFs with [zefpdf-lab](https://github.com/HenryLF/zefpdf-lab).
Each document is a preact component. It is rendered to static HTML and then
printed to PDF by `chromium` or `weasyprint`.

## How a build works

1. The entry `.tsx` (`input` in `zefpdf-lab.config.ts`) is bundled with Bun into
   `outdir` (default `dist/`). The folder is wiped on every build, so never
   edit anything in it.
2. Its default export is rendered **once, on the server**, with
   `renderToString`, and the result is written to `dist/index.html` with the
   bundled css linked in.
3. The PDF engine prints that page:
   - `chromium`: headless print of the page served over http.
   - `weasyprint`: reads `dist/index.html` from disk. It has better support for
     paged-media CSS (`@page` margin boxes, running headers, page counters).

What this means when you write a document:

- **No browser JavaScript runs.** `useState`, `useEffect`, event handlers and
  `fetch` in the browser do nothing. Compute everything while rendering: plain
  top-level `await` in the module or synchronous code in the component.
- The default export must be the document component, and its root should be
  `<Document>` (from `zefpdf-lab/ui/Document`), which renders
  `<html>/<head>/<body>`.
- Importing a `.css` file bundles it. Importing an image or font gives its url
  (declared in `src/global.d.ts`).
- Tailwind is available: `<Document>` imports it, so `className="..."` utility
  classes work.
- Layout is print CSS: use `@page { size: A4; margin: 2cm; }`, `break-before`,
  `break-inside: avoid`, and `mm`/`cm`/`pt` units.

## Commands

Run them from the project root (the folder holding `zefpdf-lab.config.ts`).

```bash
bun run dev         # preview on http://localhost:3000, pdf at /pdf, rebuilds on save
bun run build       # build the document set by input/output in the config
bun run typecheck   # tsc --noEmit
```

Multi-document projects also have:

```bash
bun run build:all   # every src/**/<doc>/index.tsx -> src/**/<doc>.pdf
bun run assets      # regenerate assets/index.tsx after adding or renaming images
```

The CLI can be called directly. Flags override the config:

```
zefpdf-lab build [input.tsx] [--config file] [--engine weasyprint|chromium]
                 [--out file.pdf] [--outdir dir] [--port n] [--dev]
zefpdf-lab dev   [input.tsx] [flags]        same as build --dev
zefpdf-lab build-all [--config file] [--engine name]
zefpdf-lab assets [dir] [--out file]        image barrel (default dir: assets)
zefpdf-lab update                           update zefpdf-lab itself
```

`bun run dev` keeps running. To check a change as an agent, use
`bun run build` (or `build:all`): a bundle error comes back with file, line
and column, and a non-zero exit code means the build failed.

## Configuration

`zefpdf-lab.config.ts` default-exports `defineConfig({...})`. Paths are relative
to that file.

| key       | meaning                                                   |
| --------- | --------------------------------------------------------- |
| `input`   | entry `.tsx` whose default export is the document         |
| `output`  | pdf path                                                  |
| `outdir`  | bundle + `index.html` (wiped on every build)              |
| `engine`  | `"chromium"` or `"weasyprint"`, must be installed          |
| `port`    | dev server port                                           |
| `paths`   | engine binaries, e.g. `{ chromium: "google-chrome" }`     |
| `watch`   | `{ debounceMs, ignore }` for dev rebuilds                 |

`build-all` ignores `input` and `output`. Everything else applies to every
document.

## Project layouts

**single**: one document in `src/index.tsx`.

**multi**: one folder per document, plus shared code through path aliases
(see `tsconfig.json`):

```
assets/        import { logo } from "@assets"   or  import logo from "@assets/logo.svg"
styles/        import "@styles/base.css"
components/    import { Header } from "@components/Header"
src/<doc>/index.tsx    a document; folders can nest (src/reports/q1/index.tsx)
```

- To add a document, create `src/<doc>/index.tsx`. Copying `src/example` is the
  quickest start. `src/index.tsx` itself is not picked up by `build:all`.
- `assets/index.tsx` is generated, so do not edit it: run `bun run assets`. Names
  come from the camelCased path (`icons/arrow-left.svg` -> `iconsArrowLeft`).
- To point `dev`/`build` at another document, change `target` in the config,
  or pass `zefpdf-lab dev src/<doc>/index.tsx --out src/<doc>.pdf`.

## Components (`zefpdf-lab/ui`)

Import a module directly (`zefpdf-lab/ui/Titles`) to keep the bundle small.
`zefpdf-lab/ui` imports all of them, which also pulls in katex and chart.js.
Every component accepts `className` and `style` (a string or an object).

| module     | exports                     | notes |
| ---------- | --------------------------- | ----- |
| `Document` | `Document`                  | `title` (also shown at the page top center), `lang`. Root of every document. |
| `Titles`   | `H1`…`H6`                   | auto-numbered (I., 1., A., a., 1., 1.). `marker` replaces the number, `count` sets it, plus `indent`, `margin`, `markerSpacing`, `subsequentSpacing`. |
| `List`     | `OL`, `UL`, `LI`            | `marker` is a string or `(n) => string`. Also `indent`, `markerSpacing`, `count` (start). |
| `Table`    | `Table`, `THeader`, `TEntry`, `TD`, `TH` | `<THeader content={[...]} />`, `<TEntry header="row" content={[...]} />`. Styling props: `cellBg`, `headerBg`, `cellPadding`, `borderWidth`, `borderColor`, `borderStyle`. |
| `Layout`   | `Flex`                      | `dir`, `gap`, `align`, `justify`. |
| `Pages`    | `Page`, `PageBreak`         | `PageBreak` forces a new page. `page` sets a named `@page`. |
| `Inputs`   | `DotLine`, `Options`        | fill-in lines (`lineStyle` is required: `"dotted"`, `"dashed"` or `"none"`; `inline` fills the rest of the line, `width` fixes it, `count` repeats). `Options` renders checkbox choices in `columns`. |
| `LaTeX`    | `LaTeX`                     | KaTeX: `<LaTeX displayMode>{"\\frac{a}{b}"}</LaTeX>`. Numbers get French-style formatting unless you pass `noFormatNumber`. |
| `Chart`    | `Chart`, `ChartObj`         | chart.js rendered to a PNG at build time: `config` (a chart.js config), `width`, `height`. |
| `QRCode`   | `QrCode`                    | `href`, `size`. |

## Rules of thumb

- Do not edit `dist/`, `node_modules/` or the generated `assets/index.tsx`.
  PDFs are build outputs and are gitignored.
- Keep preact as the only JSX runtime. The build forces every `preact` import
  to zefpdf-lab's copy, so do not add React.
- To check a layout, run `bun run build` and open the PDF. Chromium and
  weasyprint can paginate differently, so test with the engine set in the
  config.
- If a build fails with "Input not found", you are not in the project root or
  `input` in the config is wrong.
