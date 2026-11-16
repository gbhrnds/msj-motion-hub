declare module "react-dom/client" {
  export function createRoot(el: Element): { render(node: React.ReactNode): void };
}
declare module "remotion-original" {
  export * from "remotion";
}
declare module "preview-arquivos" {
  const arquivos: Record<string, string>;
  export default arquivos;
}
