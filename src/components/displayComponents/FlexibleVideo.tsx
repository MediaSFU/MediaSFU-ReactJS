import React, { useEffect, useState } from "react";

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
 * @returns {JSX.Element} The rendered FlexibleVideo component.
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


const FlexibleVideo: React.FC<FlexibleVideoOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  showAspect = false,
  backgroundColor = "transparent",
  Screenboard,
  annotateScreenStream = false,
  localStreamScreen,
}) => {
  const [key, setKey] = useState(0);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [, setCardTop] = useState<number>(0); // We don't seem to be using `cardTop`
  const [cardLeft, setCardLeft] = useState<number>(0);
  const [canvasLeft, setCanvasLeft] = useState<number>(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [columns]);

  useEffect(() => {
    if (annotateScreenStream && localStreamScreen) {
      const videoTrack = localStreamScreen.getVideoTracks()[0];
      const videoHeight = videoTrack.getSettings().height || 0;
      const videoWidth = videoTrack.getSettings().width || 0;
      setCardWidth(videoWidth);
      setCardHeight(videoHeight);
      setCardTop(Math.floor((customHeight - videoHeight) / 2));
      setCardLeft(Math.floor((customWidth - videoWidth) / 2));
      setCanvasLeft(cardLeft < 0 ? cardLeft : 0);
    } else {
      setCardWidth(customWidth);
      setCardHeight(customHeight);
      setCardTop(0);
      setCardLeft(0);
      setCanvasLeft(0);
    }
  }, [
    customWidth,
    customHeight,
    localStreamScreen,
    annotateScreenStream,
    cardLeft,
  ]);

  const renderGrid = (): React.ReactNode[] => {
    const grid: React.ReactNode[] = [];

    for (let row = 0; row < rows; row++) {
      const rowComponents: React.ReactNode[] = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];

        rowComponents.push(
          <div
            key={col}
            style={{
              flex: 1,
              width: cardWidth,
              height: cardHeight,
              backgroundColor: backgroundColor,
              margin: "1px",
              padding: 0,
              borderRadius: "0px",
              left: cardLeft,
            }}
          >
            {component}
          </div>
        );
      }

      grid.push(
        <div key={row} style={{ display: "flex", flexDirection: "row" }}>
          {rowComponents}
        </div>
      );
    }

    return grid;
  };

  return (
    <div
      key={key}
      style={{
        padding: 0,
        flex: 1,
        margin: 0,
        position: "relative",
        display: showAspect ? "flex" : "none",
        maxWidth: customWidth,
        overflowX: "hidden",
        overflowY: "auto",
        left: cardLeft > 0 ? cardLeft : 0,
      }}
    >
      {renderGrid()}
      {Screenboard && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: canvasLeft,
            width: cardWidth,
            height: cardHeight,
            backgroundColor: "rgba(0, 0, 0, 0.005)",
            zIndex: 2,
          }}
        >
          {Screenboard}
        </div>
      )}
    </div>
  );
};

export default FlexibleVideo;
