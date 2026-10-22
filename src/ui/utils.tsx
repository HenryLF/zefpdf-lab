import type { CSSProperties, SignalLike, Signalish } from "preact";
import type { PropsWithChildren } from "preact/compat";

export function cx(...s: unknown[]) {
  return s.filter((s) => typeof s === "string").join(" ");
}

type PReactStyleProp = Signalish<string | CSSProperties | undefined>;

export interface ComponentProps extends PropsWithChildren {
  className?: Signalish<string | undefined>;
  style?: PReactStyleProp;
}

/**
 * Merge `extra` over a style prop, which may be a string, an object or a signal
 * of either. A string base stays a string, so declarations keep their order and
 * `extra` wins as the later one.
 */
export function mergeStyle(
  base: PReactStyleProp,
  extra: CSSProperties,
): string | CSSProperties {
  const baseStyle = isSignal(base) ? base.value : base;

  if (typeof baseStyle == "string") {
    const extraText = toCssText(extra);
    if (!extraText) return baseStyle;
    const sep =
      baseStyle.trim() == "" || baseStyle.trim().endsWith(";") ? "" : ";";
    return baseStyle + sep + extraText;
  }

  return { ...baseStyle, ...extra };
}

function isSignal<T>(v: Signalish<T>): v is SignalLike<T> {
  return typeof v == "object" && v !== null && "peek" in v;
}

// Properties preact leaves unitless; every other number gets "px", as it does
// when rendering a style object.
const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

/** Serialize a style object the way preact would: kebab-case names, px on bare numbers. */
function toCssText(style: CSSProperties) {
  return Object.entries(style)
    .filter(([, value]) => value != null && value !== "")
    .map(([name, value]) => {
      const prop = name.startsWith("--")
        ? name
        : name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
      const unit =
        typeof value == "number" &&
        value != 0 &&
        !name.startsWith("--") &&
        !IS_NON_DIMENSIONAL.test(name)
          ? "px"
          : "";
      return `${prop}:${value}${unit};`;
    })
    .join("");
}

export function cssString(s: string | undefined) {
  return s ? `"${s}"` : undefined;
}
