import "./Document.css";
import { cssString, mergeStyle, type ComponentProps } from "./utils";
export interface DocumentProps extends ComponentProps {
  title?: string;
  lang?: string;
}

export function Document({
  title = "Document",
  lang = "en",
  style,
  children,
}: DocumentProps) {
  return (
    <html
      lang={lang}
      style={mergeStyle(style, {
        "--document-title": cssString(title),
      })}
    >
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
