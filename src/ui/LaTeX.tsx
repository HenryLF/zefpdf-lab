import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import { cx, type ComponentProps } from "./utils";
export interface LaTeXProps extends ComponentProps {
  tex: string;
  displayMode?: boolean;
  noFormatNumber?: boolean;
}

function formatNumber(s: string) {
  return s
    .replaceAll(/(\d+)(?:\.(\d+))?/g, (_, int: string, dec?: string) => {
      const intPart = int.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
      if (!dec) return intPart;
      return intPart + "{,}" + dec.replace(/(\d{3})(?=\d)/g, "$1\\,");
    })
    .replaceAll(/\s(?=[a-zA-Z])/g, "\\:");
}

export function LaTeX({
  tex,
  displayMode,
  children,
  className,
  noFormatNumber,
  ...props
}: LaTeXProps) {
  const childString = children?.toString() ?? tex;
  const texString = noFormatNumber ? childString : formatNumber(childString);
  return (
    <>
      <div
        className={cx(className, "latex")}
        dangerouslySetInnerHTML={{
          __html: renderToString(texString, { displayMode }),
        }}
        {...props}
      />
    </>
  );
}
