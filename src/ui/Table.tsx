import type { ComponentChild, VNode } from "preact";
import "./Table.css";
import { cx, mergeStyle, type ComponentProps } from "./utils";
interface TableBaseProps {
  cellBg?: string;
  headerBg?: string;
  cellPadding?: string | number;
  borderWidth?: string | number;
  borderColor?: string;
  borderStyle?:
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
}

export interface TableProps extends ComponentProps, TableBaseProps {}

function applyTableStyle(
  base: ComponentProps["style"],
  {
    cellBg,
    cellPadding,
    headerBg,
    borderColor,
    borderStyle,
    borderWidth,
  }: TableBaseProps,
) {
  return mergeStyle(base, {
    "--table--cell-color": cellBg,
    "--table--header-color": headerBg,
    "--table--cell-padding": cellPadding,
    "--table--border-color": borderColor,
    "--table--border-width": borderWidth,
    "--table--border-style": borderStyle,
  });
}

export function Table({ style, className, children, ...props }: TableProps) {
  return (
    <table
      className={cx("table--container", className)}
      style={applyTableStyle(style, props)}
    >
      <tbody>{children}</tbody>
    </table>
  );
}

export interface TableItemsProps extends ComponentProps, TableBaseProps {
  content: ComponentChild[];
  header?: ComponentChild;
}

export function THeader({
  content,
  style,
  className,
  ...props
}: TableItemsProps) {
  return (
    <tr
      className={cx("table--header-row", className)}
      style={applyTableStyle(style, props)}
    >
      {content.map((child) => {
        if ((child as VNode)?.type === TH) {
          return child;
        }
        return <th className="table--header">{child}</th>;
      })}
    </tr>
  );
}

export function TEntry({
  content,
  header,
  className,
  style,
  ...props
}: TableItemsProps) {
  return (
    <tr
      className={cx("table--cell-row", className)}
      style={applyTableStyle(style, props)}
    >
      {header &&
        ((header as VNode)?.type === TH ? (
          header
        ) : (
          <th className="table--header" scope="row">
            {header}
          </th>
        ))}
      {content.map((child) => {
        if ((child as VNode)?.type === TD) {
          return child;
        }
        return <td className="table--cell">{child}</td>;
      })}
    </tr>
  );
}

export interface TDProps extends ComponentProps, TableBaseProps {
  colspan?: number;
  rowspan?: number;
  headers?: string;
}

export function TD({ style, className, ...props }: TDProps) {
  return (
    <td
      className={cx("table--cell", className)}
      style={applyTableStyle(style, props)}
      {...props}
    />
  );
}

export interface THProps extends ComponentProps, TableBaseProps {
  colspan?: number;
  rowspan?: number;
  headers?: string;
  scope?: "row" | "col" | "rowgroup" | "colgroup";
}

export function TH({ style, className, ...props }: THProps) {
  return (
    <th
      className={cx("table--header", className)}
      style={applyTableStyle(style, props)}
      {...props}
    />
  );
}
