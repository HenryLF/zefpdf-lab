import { defineConfig } from "./src/build/config";

export default defineConfig({
  output: "test.pdf",
  engine: "weasyprint",
});
