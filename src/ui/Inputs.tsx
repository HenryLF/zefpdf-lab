import { Children } from "preact/compat";
import "./Inputs.css";
import { LI, UL } from "./List";
import { cx, mergeStyle, type ComponentProps } from "./utils";
export interface DotLineProps extends ComponentProps {
  count?: number;
  lineHeight?: number | string;
  inline?: boolean;
  width?: number | string;
}

export function DotLine({
  count = 1,
  lineHeight,
  inline,
  className,
  width,
  style,
}: DotLineProps) {
  return (
    <>
      {Array(count).fill(
        <span
          style={mergeStyle(style, {
            "--dotline--lineheight": lineHeight,
            width,
          })}
          className={cx("dotline", inline && "dotline--inline", className)}
        >
          <span className={"dotline--dots"} />
        </span>,
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
