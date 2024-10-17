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
}
export type FlexibleVideoType = (options: FlexibleVideoOptions) => JSX.Element;
/**
 * FlexibleVideo component renders a flexible grid of video components with optional screenboard overlay.
 *
 * @component
 * @param {FlexibleVideoOptions} props - The properties for the FlexibleVideo component.
 * @param {number} props.customWidth - The custom width for the video grid.
 * @param {number} props.customHeight - The custom height for the video grid.
 * @param {number} props.rows - The number of rows in the video grid.
 * @param {number} props.columns - The number of columns in the video grid.
 * @param {React.ReactNode[]} props.componentsToRender - The components to render in the grid.
 * @param {boolean} props.showAspect - Flag to show or hide the aspect ratio.
 * @param {string} [props.backgroundColor='transparent'] - The background color for the video components.
 * @param {React.ReactNode} props.Screenboard - The screenboard component to overlay on the video grid.
 * @param {boolean} [props.annotateScreenStream=false] - Flag to annotate the screen stream.
 * @param {MediaStream} props.localStreamScreen - The local screen stream to use for annotation.
 *
 * @returns {JSX.Element} The rendered FlexibleVideo component.
 */
declare const FlexibleVideo: React.FC<FlexibleVideoOptions>;
export default FlexibleVideo;
//# sourceMappingURL=FlexibleVideo.d.ts.map