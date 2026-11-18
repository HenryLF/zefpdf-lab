import "./Layout.css";
import { cx, mergeStyle, type ComponentProps } from "./utils";
export interface FlexProps extends ComponentProps {
  dir?: "row" | "row-reverse" | "column" | "column-reverse";
  gap?: string | number;
  align?:
    | "normal"
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end";
  justify?:
    | "center"
    | "start"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  wrap?: boolean | "reverse";
}

export function Flex({
  gap,
  align,
  justify,
  dir,
  style,
  wrap = false,
  className,
  ...props
}: FlexProps) {
  return (
    <div
      className={cx(className, "flexbox")}
      style={mergeStyle(style, {
        gap,
        flexDirection: dir,
        justifyContent: justify,
        alignItems: align,
        flexWrap:
          wrap === true
            ? "wrap"
            : wrap === "reverse"
              ? "wrap-reverse"
              : "no-wrap",
      })}
      {...props}
    />
  );
}
