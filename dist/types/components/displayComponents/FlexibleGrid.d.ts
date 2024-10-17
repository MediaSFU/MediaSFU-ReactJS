import React from "react";
export interface FlexibleGridOptions {
    customWidth: number;
    customHeight: number;
    rows: number;
    columns: number;
    componentsToRender: React.ReactNode[];
    backgroundColor?: string;
}
export type FlexibleGridType = (options: FlexibleGridOptions) => JSX.Element;
/**
 * FlexibleGrid component renders a grid layout with customizable dimensions and components.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.customWidth] - Custom width for each grid item.
 * @param {string} [props.customHeight] - Custom height for each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {React.ReactNode[]} props.componentsToRender - Array of components to render in the grid.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 *
 * @returns {JSX.Element} The rendered grid layout.
 */
declare const FlexibleGrid: React.FC<FlexibleGridOptions>;
export default FlexibleGrid;
//# sourceMappingURL=FlexibleGrid.d.ts.map