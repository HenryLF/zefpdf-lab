import { mergeStyle, type ComponentProps } from "./utils";

export interface PageProps extends ComponentProps {
  page?: string;
}

export function Page({ page, style, ...props }: PageProps) {
  return <div style={mergeStyle(style, { page })} {...props} />;
}

export function PageBreak({ page, style, ...props }: PageProps) {
  return (
    <div
      style={mergeStyle(style, {
        page,
        height: 0,
        width: 0,
        visibility: "hidden",
        breakBefore: "page",
      })}
      {...props}
    />
  );
}
