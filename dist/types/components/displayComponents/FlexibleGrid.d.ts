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
 * FlexibleGrid component renders a customizable grid layout with specified dimensions and components.
 *
 * This component arranges a series of components in a grid, with options to set the width, height, and background color of each grid item.
 *
 * @component
 * @param {FlexibleGridOptions} props - The properties object.
 * @param {number} props.customWidth - Custom width for each grid item, in pixels.
 * @param {number} props.customHeight - Custom height for each grid item, in pixels.
 * @param {number} props.rows - Number of rows in the grid layout.
 * @param {number} props.columns - Number of columns in the grid layout.
 * @param {React.ReactNode[]} props.componentsToRender - Array of React components or elements to display in the grid.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 *
 * @returns {JSX.Element} The rendered grid layout.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const componentsToRender = [
 *     <Component1 />,
 *     <Component2 />,
 *     <Component3 />,
 *     <Component4 />,
 *     <Component5 />,
 *     <Component6 />,
 *   ];
 *
 *   return (
 *     <FlexibleGrid
 *       customWidth={100}
 *       customHeight={100}
 *       rows={2}
 *       columns={3}
 *       componentsToRender={componentsToRender}
 *       backgroundColor="white"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const FlexibleGrid: React.FC<FlexibleGridOptions>;
export default FlexibleGrid;
//# sourceMappingURL=FlexibleGrid.d.ts.map