// Imports of non-code files resolve to their bundled url, next to index.html.
declare module "*.css" {
  const s: Record<string, string>;
  export default s;
}
declare module "*.svg" {
  const url: string;
  export default url;
}
declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.jpg" {
  const url: string;
  export default url;
}
declare module "*.jpeg" {
  const url: string;
  export default url;
}
declare module "*.gif" {
  const url: string;
  export default url;
}
declare module "*.webp" {
  const url: string;
  export default url;
}
declare module "*.avif" {
  const url: string;
  export default url;
}
declare module "*.woff2" {
  const url: string;
  export default url;
}
