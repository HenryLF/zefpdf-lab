declare module "*.css" {
  const s: string;
  export default s;
}
declare module "*.module.css" {
  const s: Record<string, string>;
  export default s;
}
