import React from "react";
export interface FlexibleVideoOptions {
    customWidth: number;
    customHeight: number;
    rows: number;
    columns: number;
    componentsToRender: React.ReactNode[];
    showAspect: boolean;
    backgroundColor?: string;
    Screenboard?: React.ReactNode;
    annotateScreenStream?: boolean;
    localStreamScreen?: MediaStream;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    rowProps?: React.HTMLAttributes<HTMLDivElement>;
    cellProps?: React.HTMLAttributes<HTMLDivElement>;
    screenboardContainerProps?: React.HTMLAttributes<HTMLDivElement>;
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
    renderScreenboard?: (options: {
        defaultScreenboard: React.ReactNode;
    }) => React.ReactNode;
    /** Dark mode toggle (default: true) - Used by Modern UI components */
    isDarkMode?: boolean;
    /** Enable glassmorphic styling (default: true) - Used by Modern UI components */
    enableGlassmorphism?: boolean;
    /** Custom cell border radius - Used by Modern UI components */
    cellBorderRadius?: number;
    /** Enable glow effects - Used by Modern UI components */
    enableGlow?: boolean;
}
export type FlexibleVideoType = (options: FlexibleVideoOptions) => React.JSX.Element;
declare const FlexibleVideo: React.NamedExoticComponent<FlexibleVideoOptions>;
export default FlexibleVideo;
//# sourceMappingURL=FlexibleVideo.d.ts.map