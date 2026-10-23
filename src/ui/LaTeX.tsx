import { renderToString } from "katex";
import "katex/contrib/mhchem";
import "katex/dist/katex.min.css";
import "./LaTeX.css";
import { cx, type ComponentProps } from "./utils";
export interface LaTeXProps extends ComponentProps {
  tex?: string;
  displayMode?: boolean;
  noFormatNumber?: boolean;
  chemical?: boolean;
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
  tex = "",
  displayMode,
  children,
  chemical,
  className,
  noFormatNumber,
  ...props
}: LaTeXProps) {
  let texString = children?.toString() ?? tex;

  if (chemical) texString = `\\ce{${texString}}`;
  else if (!noFormatNumber) texString = formatNumber(texString);
  return (
    <div
      className={cx(className, "latex")}
      dangerouslySetInnerHTML={{
        __html: renderToString(texString, { displayMode }),
      }}
      {...props}
    />
  );
}
