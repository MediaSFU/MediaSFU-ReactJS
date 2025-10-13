import { GridSizes, ComponentSizes, EventType } from "../@types/types";
export interface GridLayoutMeta {
    rows: number;
    cols: number;
    actualRows: number;
}
export interface UpdateMiniCardsGridParameters {
    updateGridRows: (rows: number) => void;
    updateGridCols: (cols: number) => void;
    updateAltGridRows: (rows: number) => void;
    updateAltGridCols: (cols: number) => void;
    updateGridSizes: (gridSizes: GridSizes) => void;
    gridSizes: GridSizes;
    paginationDirection: string;
    paginationHeightWidth: number;
    doPaginate: boolean;
    componentSizes: ComponentSizes;
    eventType: EventType;
    getUpdatedAllParams: () => UpdateMiniCardsGridParameters;
    updatePrimaryGridLayoutMeta?: (layout: GridLayoutMeta) => void;
    updateAltGridLayoutMeta?: (layout: GridLayoutMeta) => void;
    [key: string]: any;
}
export interface UpdateMiniCardsGridOptions {
    rows: number;
    cols: number;
    defal?: boolean;
    actualRows?: number;
    parameters: UpdateMiniCardsGridParameters;
}
export type UpdateMiniCardsGridType = (options: UpdateMiniCardsGridOptions) => Promise<void>;
/**
 * Updates the mini cards grid based on the specified rows and columns.
 *
 * @param {UpdateMiniCardsGridOptions} options - The function parameters.
 * @param {number} options.rows - The number of rows in the grid.
 * @param {number} options.cols - The number of columns in the grid.
 * @param {boolean} [options.defal] - Flag indicating whether to update the default grid or an alternative grid.
 * @param {number} [options.actualRows] - The actual number of rows in the grid.
 * @param {UpdateMiniCardsGridParameters} options.parameters - Additional parameters needed for the function.
 * @returns {Promise<void>} A promise that resolves when the mini cards grid is updated.
 *
 * @throws Will throw an error if the update operation fails.
 *
 * @example
 * ```typescript
 * const options = {
 *   rows: 2,
 *   cols: 3,
 *   defal: true,
 *   actualRows: 2,
 *   parameters: {
 *     updateGridRows: updateGridRowsFunction,
 *     updateGridCols: updateGridColsFunction,
 *     updateAltGridRows: updateAltGridRowsFunction,
 *     updateAltGridCols: updateAltGridColsFunction,
 *     updateGridSizes: updateGridSizesFunction,
 *     gridSizes: { gridWidth: 100, gridHeight: 100 },
 *     paginationDirection: 'horizontal',
 *     paginationHeightWidth: 50,
 *     doPaginate: true,
 *     componentSizes: { otherWidth: 300, otherHeight: 200 },
 *     eventType: 'chat',
 *     getUpdatedAllParams: getUpdatedAllParamsFunction,
 *   },
 * };
 *
 * await updateMiniCardsGrid(options);
 * ```
 */
export declare function updateMiniCardsGrid({ rows, cols, defal, actualRows, parameters, }: UpdateMiniCardsGridOptions): Promise<void>;
//# sourceMappingURL=updateMiniCardsGrid.d.ts.map