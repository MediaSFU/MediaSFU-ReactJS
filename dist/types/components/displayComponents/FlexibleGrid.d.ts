import React from "react";
export interface FlexibleGridOptions {
    customWidth: number;
    customHeight: number;
    rows: number;
    columns: number;
    componentsToRender: React.ReactNode[];
    backgroundColor?: string;
    gridWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    rowProps?: React.HTMLAttributes<HTMLDivElement>;
    cellProps?: React.HTMLAttributes<HTMLDivElement>;
    emptyCellFallback?: React.ReactNode | ((context: {
        row: number;
        column: number;
        index: number;
    }) => React.ReactNode);
    renderCell?: (options: {
        defaultCell: React.ReactNode;
        component: React.ReactNode | undefined;
        row: number;
        column: number;
        index: number;
    }) => React.ReactNode;
    renderRow?: (options: {
        defaultRow: React.ReactNode;
        rowIndex: number;
        cells: React.ReactNode[];
    }) => React.ReactNode;
    renderGrid?: (options: {
        defaultGrid: React.ReactNode;
        rows: React.ReactNode[];
    }) => React.ReactNode;
}
export type FlexibleGridType = (options: FlexibleGridOptions) => React.JSX.Element;
declare const FlexibleGrid: React.NamedExoticComponent<FlexibleGridOptions>;
export default FlexibleGrid;
//# sourceMappingURL=FlexibleGrid.d.ts.map