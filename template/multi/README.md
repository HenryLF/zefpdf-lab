# {{name}}

A multi-document [zefpdf-lab](https://github.com/HenryLF/zefpdf-lab) project.

```
assets/        images, fonts...     import logo from "@assets/logo.svg"
styles/        shared css           import "@styles/base.css"
components/    shared components    import { Header } from "@components/Header"
src/<doc>/     one folder per document, entry index.tsx (folders can nest)
```

```bash
bun run build:all   # every src/**/<doc>/index.tsx -> <doc>.pdf beside the folder
bun run dev         # preview the document set in zefpdf-lab.config.ts
bun run build       # build that document only
```

To work on another document, change `input` and `output` in
`zefpdf-lab.config.ts`, or pass them: `zefpdf-lab dev src/<doc>/index.tsx --out src/<doc>.pdf`.
