import { Document } from "zefpdf-lab/ui/Document";
import { H1, H2 } from "zefpdf-lab/ui/Titles";

export default function Doc() {
  return (
    <Document title="{{name}}">
      <H1>{"{{name}}"}</H1>
      <p>Edit src/index.tsx and save: the preview and the pdf rebuild.</p>
      <H2>Next</H2>
      <p>Components live in zefpdf-lab/ui.</p>
    </Document>
  );
}
