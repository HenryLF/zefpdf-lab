import "./Titles.css";
import { cx, mergeStyle, type ComponentProps } from "./utils";
export interface TitleProps extends ComponentProps {
  count?: number;
  indent?: string | number;
  marker?: string;
  markerSpacing?: string | number;
  margin?: string | number;
  subsequentSpacing?: string | number;
}

export function H1({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h1
      data-marker={marker}
      className={cx(className, "htitle", "title--h1")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h1 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h1--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h1>
  );
}

export function H2({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h2
      data-marker={marker}
      className={cx(className, "htitle", "title--h2")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h2 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h2--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h2>
  );
}

export function H3({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h3
      data-marker={marker}
      className={cx(className, "htitle", "title--h3")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h3 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h3--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h3>
  );
}

export function H4({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h4
      data-marker={marker}
      className={cx(className, "htitle", "title--h4")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h4 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h4--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h4>
  );
}

export function H5({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h5
      data-marker={marker}
      className={cx(className, "htitle", "title--h5")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h5 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h5--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h5>
  );
}

export function H6({
  count,
  indent,
  marker,
  markerSpacing,
  margin,
  subsequentSpacing,
  children,
  style,
  className,
}: TitleProps) {
  return (
    <h6
      data-marker={marker}
      className={cx(className, "htitle", "title--h6")}
      style={mergeStyle(style, {
        counterSet: count ? `count-h6 ${count}` : undefined,
        counterIncrement: count ? "none" : undefined,
        "--title--h6--indent": indent,
        "--title--marker-spacing": markerSpacing,
        "--title--margin": margin,
        "--title--subsequent-margin": subsequentSpacing,
      })}
    >
      {children}
    </h6>
  );
}
