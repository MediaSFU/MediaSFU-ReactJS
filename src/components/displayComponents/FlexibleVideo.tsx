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
