// Imports of non-code files resolve to their bundled url, next to index.html.
declare module "*.css" {
  const s: string;
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
declare module "*.woff2" {
  const url: string;
  export default url;
}
