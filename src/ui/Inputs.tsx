import { Children } from "preact/compat";
import "./Inputs.css";
import { LI, UL } from "./List";
import { cx, mergeStyle, type ComponentProps } from "./utils";
export interface DotLineProps extends ComponentProps {
  count?: number;
  lineHeight?: number | string;
  inline?: boolean;
  width?: number | string;
  lineStyle?: "dashed" | "dotted" | "none";
}

/**
 * - `inline`: inline, fills the remaining width of the line, then breaks it
 * - `width`: inline, with the given width
 * - otherwise: block, full width
 */
export function DotLine({
  count = 1,
  lineHeight,
  inline,
  lineStyle,
  className,
  width,
  style,
}: DotLineProps) {
  const mode = inline ? "fill" : width != null ? "fixed" : "block";
  return (
    <>
      {Array(count).fill(
        <>
          <span
            style={mergeStyle(style, {
              "--dotline--lineheight": lineHeight,
              "--dotline--linestyle": lineStyle,
              width: mode === "fixed" ? width : undefined,
            })}
            className={cx("dotline", `dotline--${mode}`, className)}
          >
            <span className={"dotline--dots"} />
          </span>
          {mode === "fill" && <br />}
        </>,
      )}
    </>
  );
}

export interface OptionsProps extends ComponentProps {
  columns?: number;
}

export function Options({
  columns,
  children,
  style,
  className,
  ...props
}: OptionsProps) {
  return (
    <UL
      indent={0}
      marker="▢"
      className={cx("options", className)}
      style={mergeStyle(style, {
        columnCount: columns ?? Children.count(children),
      })}
      {...props}
    >
      {Children.map(children, (child) => (
        <LI>{child}</LI>
      ))}
    </UL>
  );
}
