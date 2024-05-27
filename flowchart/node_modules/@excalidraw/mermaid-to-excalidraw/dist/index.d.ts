export interface MermaidOptions {
    fontSize?: number;
}
declare const parseMermaidToExcalidraw: (definition: string, options?: MermaidOptions) => Promise<import("./interfaces.js").MermaidToExcalidrawResult>;
export { parseMermaidToExcalidraw };
