import { createContext } from "preact";
import "./List.css";
import { cx, mergeStyle, type ComponentProps } from "./utils";
export interface ListProps extends ComponentProps {
  marker?: ((s: number) => string) | string;
  indent?: string | number;
  markerSpacing?: string | number;
  count?: number;
}

type ListContextType = {
  counter: { value: number };
  marker: ((s: number) => string) | string;
};

export const ListContext = createContext<ListContextType | null>(null);

export function OL({
  marker = (k) => `${k}.`,
  indent,
  markerSpacing,
  count = 0,
  style,
  className,
  children,
}: ListProps) {
  return (
    <div
      className={cx(className, "list--ol")}
      style={mergeStyle(style, {
        "--list--indent": indent,
        "--list--marker-spacing": markerSpacing,
      })}
    >
      <ListContext.Provider
        value={{
          counter: { value: count },
          marker,
        }}
      >
        {children}
      </ListContext.Provider>
    </div>
  );
}

export function UL({
  marker = "•",
  indent,
  markerSpacing,
  style,
  className,
  children,
}: ListProps) {
  return (
    <div
      className={cx(className, "list--ul")}
      style={mergeStyle(style, {
        "--list--indent": indent,
        "--list--marker-spacing": markerSpacing,
      })}
    >
      <ListContext.Provider
        value={{
          counter: { value: 0 },
          marker,
        }}
      >
        {children}
      </ListContext.Provider>
    </div>
  );
}

export function LI({ style, className, children, count, ...props }: ListProps) {
  return (
    <ListContext.Consumer>
      {(ctx) => {
        if (!ctx) return children;
        const context = { ...ctx, ...props };
        const n = (ctx.counter.value = count ?? ctx.counter.value + 1);
        const marker =
          typeof context.marker == "string"
            ? context.marker
            : context.marker(n);
        return (
          <div
            className={cx(className, "list--item")}
            style={mergeStyle(style, {
              "--list--indent": context.indent,
              "--list--marker-spacing": context.markerSpacing,
            })}
            data-marker={marker}
          >
            {children}
          </div>
        );
      }}
    </ListContext.Consumer>
  );
}

export function toUpperAlpha(k: number) {
  if (k < 1) return String(k);
  let s = "";
  while (k > 0) {
    k--;
    s = String.fromCharCode(65 + (k % 26)) + s;
    k = Math.floor(k / 26);
  }
  return s;
}

export function toLowerAlpha(k: number) {
  return toUpperAlpha(k).toLowerCase();
}

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toUpperRoman(k: number) {
  if (k < 1 || k > 3999) return String(k);
  let s = "";
  for (const [value, symbol] of ROMAN) {
    while (k >= value) {
      s += symbol;
      k -= value;
    }
  }
  return s;
}

export function toLowerRoman(k: number) {
  return toUpperRoman(k).toLowerCase();
}
