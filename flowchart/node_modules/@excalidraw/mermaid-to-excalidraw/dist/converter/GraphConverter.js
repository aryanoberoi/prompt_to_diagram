import { DEFAULT_FONT_SIZE } from "../constants.js";
export class GraphConverter {
    constructor({ converter, }) {
        this.convert = (graph, options) => {
            return this.converter(graph, {
                ...options,
                fontSize: options.fontSize || DEFAULT_FONT_SIZE,
            });
        };
        this.converter = converter;
    }
}
