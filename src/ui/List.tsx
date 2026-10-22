import { createContext } from "preact";
import "./List.css";
import { cx, mergeStyle, type ComponentProps } from "./utils";
interface ListItemProps extends ComponentProps {
  marker?: ((s: number) => string) | string;
  indent?: string | number;
  markerSpacing?: string | number;
  count?: number;
}

export interface OLProps extends ListItemProps {}

export interface ULProps extends ListItemProps {}

type ListContextType = {
  counter: { value: number };
  marker: ((s: number) => string) | string;
};

const ListContext = createContext<ListContextType | null>(null);

export function OL({
  marker = (k) => `${k}.`,
  indent,
  markerSpacing,
  count = 0,
  style,
  className,
  children,
}: OLProps) {
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
}: OLProps) {
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

export function LI({
  style,
  className,
  children,
  count,
  ...props
}: ListItemProps) {
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
