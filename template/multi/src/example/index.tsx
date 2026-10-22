import "@styles/base.css";
import { Header } from "@components/Header";
import { Document } from "zefpdf-lab/ui/Document";

export default function Doc() {
  return (
    <Document title="Example">
      <Header title="Example" />
      <p>
        Each folder in src/ with an index.tsx is a document. Copy this one to
        start another, and share code through @components, @styles and @assets.
      </p>
    </Document>
  );
}
