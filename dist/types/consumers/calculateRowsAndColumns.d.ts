export interface CalculateRowsAndColumnsOptions {
    n: number;
}
export type CalculateRowsAndColumnsType = (options: CalculateRowsAndColumnsOptions) => [number, number];
/**
 * Calculates the number of rows and columns needed to display a given number of items in a grid.
 *
 * @function
 * @param {CalculateRowsAndColumnsOptions} options - The options for calculating rows and columns.
 * @param {number} options.n - The number of items to display.
 * @returns {[number, number]} A tuple containing the number of rows and columns.
 *
 * @example
 * import { calculateRowsAndColumns } from 'mediasfu-reactjs';
 *
 * const options = {
 *   n: 10,
 * };
 *
 * const [rows, cols] = calculateRowsAndColumns(options);
 * console.log(`Rows: ${rows}, Columns: ${cols}`); // Outputs: Rows: 4, Columns: 3
 */
export declare function calculateRowsAndColumns({ n }: CalculateRowsAndColumnsOptions): [number, number];
//# sourceMappingURL=calculateRowsAndColumns.d.ts.map