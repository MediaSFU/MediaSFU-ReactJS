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
export type FlexibleVideoType = (options: FlexibleVideoOptions) => React.JSX.Element;
/**
 * FlexibleVideo component renders a flexible grid of video components with optional screenboard overlay and annotation support.
 *
 * This component organizes video components in a grid format with customizable dimensions, and includes options to overlay a screenboard component, apply annotations, and manage aspect ratios.
 *
 * @component
 * @param {FlexibleVideoOptions} props - The properties for the FlexibleVideo component.
 * @param {number} props.customWidth - Custom width for each video component in the grid.
 * @param {number} props.customHeight - Custom height for each video component in the grid.
 * @param {number} props.rows - Number of rows in the video grid.
 * @param {number} props.columns - Number of columns in the video grid.
 * @param {React.ReactNode[]} props.componentsToRender - Array of video components to render within the grid.
 * @param {boolean} props.showAspect - Determines if the aspect ratio should be preserved.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 * @param {React.ReactNode} [props.Screenboard] - Optional screenboard component to overlay on the video grid.
 * @param {boolean} [props.annotateScreenStream=false] - Flag to enable annotation on the screen stream.
 * @param {MediaStream} [props.localStreamScreen] - Local screen stream for annotation.
 *
 * @returns {React.JSX.Element} The rendered FlexibleVideo component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { FlexibleVideo } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const componentsToRender = [
 *     <VideoComponent1 />,
 *     <VideoComponent2 />,
 *     <VideoComponent3 />,
 *     <VideoComponent4 />,
 *     <VideoComponent5 />,
 *     <VideoComponent6 />,
 *   ];
 *
 *   return (
 *     <FlexibleVideo
 *       customWidth={100}
 *       customHeight={100}
 *       rows={2}
 *       columns={3}
 *       componentsToRender={componentsToRender}
 *       showAspect={true}
 *       backgroundColor="white"
 *       Screenboard={<ScreenboardComponent />}
 *       annotateScreenStream={true}
 *       localStreamScreen={localStreamStream}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const FlexibleVideo: React.FC<FlexibleVideoOptions>;
export default FlexibleVideo;
//# sourceMappingURL=FlexibleVideo.d.ts.map