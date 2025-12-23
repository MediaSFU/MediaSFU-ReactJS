import React, { useEffect, useState } from "react";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

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

/**
 * FlexibleVideo component renders a flexible grid of video components with optional screenboard
 * overlay, annotation support, and custom rendering hooks.
 *
 * This component is ideal for organizing video streams in a grid layout while supporting advanced
 * features like screen annotations and collaborative whiteboarding. It provides:
 * - Dynamic grid sizing with custom rows/columns
 * - Screenboard overlay for shared annotations
 * - Annotation support on screen streams
 * - Custom cell, row, and grid renderers
 * - Aspect ratio preservation
 * - Override patterns for use in MediaSFU UI components
 *
 * @component
 * @param {FlexibleVideoOptions} props - The properties for the FlexibleVideo component.
 * @param {number} props.customWidth - Total width for the video grid in pixels.
 * @param {number} props.customHeight - Total height for the video grid in pixels.
 * @param {number} props.rows - Number of rows in the video grid.
 * @param {number} props.columns - Number of columns in the video grid.
 * @param {React.ReactNode[]} props.componentsToRender - Array of video components (typically VideoCard instances) to render in the grid.
 * @param {boolean} props.showAspect - Whether to display the grid (useful for toggling visibility).
 * @param {string} [props.backgroundColor='transparent'] - Background color for grid cells.
 * @param {React.ReactNode} [props.Screenboard] - Optional screenboard component to overlay on the grid (for collaborative annotations).
 * @param {boolean} [props.annotateScreenStream=false] - Whether to enable annotation on the screen stream.
 * @param {MediaStream} [props.localStreamScreen] - Local screen MediaStream for annotation purposes.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML props for the main container.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.rowProps] - HTML props for row containers.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.cellProps] - HTML props for individual cells.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.screenboardContainerProps] - HTML props for the screenboard overlay container.
 * @param {Function} [props.renderCell] - Custom render function for individual cells. Receives { defaultCell, component, row, column, index }.
 * @param {Function} [props.renderRow] - Custom render function for rows. Receives { defaultRow, rowIndex, cells }.
 * @param {Function} [props.renderGrid] - Custom render function for the entire grid. Receives { defaultGrid, rows }.
 * @param {Function} [props.renderScreenboard] - Custom render function for the screenboard overlay.
 *
 * @returns {React.JSX.Element} The rendered FlexibleVideo component.
 *
 * @example
 * **Basic Usage**
 * ```tsx
 * import React from 'react';
 * import { FlexibleVideo, VideoCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const videoComponents = participants.map(p => (
 *     <VideoCard key={p.id} participant={p} parameters={parameters} />
 *   ));
 *
 *   return (
 *     <FlexibleVideo
 *       customWidth={window.innerWidth}
 *       customHeight={600}
 *       rows={2}
 *       columns={3}
 *       componentsToRender={videoComponents}
 *       showAspect={true}
 *       backgroundColor="#1a1a1a"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **With Screenboard Overlay**
 * ```tsx
 * import React from 'react';
 * import { FlexibleVideo, Screenboard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <FlexibleVideo
 *       customWidth={1920}
 *       customHeight={1080}
 *       rows={2}
 *       columns={2}
 *       componentsToRender={videoComponents}
 *       showAspect={true}
 *       Screenboard={<Screenboard parameters={parameters} />}
 *       annotateScreenStream={true}
 *       localStreamScreen={screenStream}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Cell Renderer with Borders**
 * ```tsx
 * import React from 'react';
 * import { FlexibleVideo } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <FlexibleVideo
 *       customWidth={1280}
 *       customHeight={720}
 *       rows={3}
 *       columns={3}
 *       componentsToRender={videoComponents}
 *       showAspect={true}
 *       renderCell={({ defaultCell, component, row, column }) => (
 *         <div style={{
 *           border: '2px solid #00ff88',
 *           borderRadius: 8,
 *           overflow: 'hidden',
 *           position: 'relative'
 *         }}>
 *           {defaultCell}
 *           <div style={{
 *             position: 'absolute',
 *             top: 5,
 *             left: 5,
 *             background: 'rgba(0, 255, 136, 0.8)',
 *             color: 'black',
 *             padding: '2px 6px',
 *             borderRadius: 4,
 *             fontSize: 10
 *           }}>
 *             [{row},{column}]
 *           </div>
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Using in uiOverrides (MediasfuGeneric)**
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, FlexibleVideo } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomFlexibleVideo = (props: any) => (
 *     <FlexibleVideo
 *       {...props}
 *       backgroundColor="#0a0a0a"
 *       renderGrid={({ defaultGrid }) => (
 *         <div style={{
 *           border: '4px solid #667eea',
 *           borderRadius: 16,
 *           padding: 12,
 *           background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
 *           boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
 *         }}>
 *           {defaultGrid}
 *         </div>
 *       )}
 *     />
 *   );
 *
 *   return (
 *     <MediasfuGeneric
 *       useLocalUIMode={true}
 *       useSeed={true}
 *       seedData={mySeedData}
 *       uiOverrides={{
 *         flexibleVideo: CustomFlexibleVideo
 *       }}
 *     />
 *   );
 * }
 * ```
 */


const FlexibleVideoComponent: React.FC<FlexibleVideoOptions> = ({
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
  containerProps,
  rowProps,
  cellProps,
  screenboardContainerProps,
  renderCell,
  renderRow,
  renderGrid,
  renderScreenboard,
}) => {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [cardLeft, setCardLeft] = useState<number>(0);
  const [canvasLeft, setCanvasLeft] = useState<number>(0);

  useEffect(() => {
    if (annotateScreenStream && localStreamScreen) {
      const videoTrack = localStreamScreen.getVideoTracks()[0];
      if (videoTrack) {
        const videoHeight = videoTrack.getSettings().height || 0;
        const videoWidth = videoTrack.getSettings().width || 0;
        setCardWidth(videoWidth);
        setCardHeight(videoHeight);
        const computedLeft = Math.floor((customWidth - videoWidth) / 2);
        setCardLeft(computedLeft);
        setCanvasLeft(computedLeft < 0 ? computedLeft : 0);
      }
    } else {
      setCardWidth(customWidth);
      setCardHeight(customHeight);
      setCardLeft(0);
      setCanvasLeft(0);
    }
  }, [
    customWidth,
    customHeight,
    localStreamScreen,
    annotateScreenStream,
  ]);

  const {
    className: containerClassNameProp,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassName = joinClassNames(
    "mediasfu-flexible-video",
    containerClassNameProp
  );

  const containerStyle: React.CSSProperties = {
    padding: 0,
    flex: 1,
    margin: 0,
    position: "relative",
    display: showAspect ? "flex" : "none",
    maxWidth: customWidth,
    overflowX: "hidden",
    overflowY: "auto",
    left: cardLeft > 0 ? cardLeft : 0,
    ...(containerStyleOverrides ?? {}),
  };

  const {
    className: rowClassNameProp,
    style: rowStyleOverrides,
    ...restRowProps
  } = rowProps ?? {};

  const rowClassName = joinClassNames(
    "mediasfu-flexible-video__row",
    rowClassNameProp
  );

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    ...(rowStyleOverrides ?? {}),
  };

  const {
    className: cellClassNameProp,
    style: cellStyleOverrides,
    ...restCellProps
  } = cellProps ?? {};

  const cellClassName = joinClassNames(
    "mediasfu-flexible-video__cell",
    cellClassNameProp
  );

  const cellStyle: React.CSSProperties = {
    flex: 1,
    width: cardWidth,
    height: cardHeight,
    backgroundColor,
    margin: "1px",
    padding: 0,
    borderRadius: "0px",
    left: cardLeft,
    ...(cellStyleOverrides ?? {}),
  };

  const rowsContent: React.ReactNode[] = [];

  for (let row = 0; row < rows; row++) {
    const rowCells: React.ReactNode[] = [];

    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const component = componentsToRender[index];
      const componentKey = React.isValidElement(component) && component.key != null
        ? component.key
        : undefined;
      const cellKey = componentKey ?? `${row}-${col}`;

      const defaultCell = (
        <div
          key={cellKey as React.Key}
          className={cellClassName}
          style={cellStyle}
          {...restCellProps}
        >
          {component}
        </div>
      );

      const renderedCell = renderCell
        ? renderCell({
            defaultCell,
            component,
            row,
            column: col,
            index,
          })
        : defaultCell;

      if (React.isValidElement(renderedCell)) {
        rowCells.push(
          React.cloneElement(renderedCell, {
            key: renderedCell.key ?? cellKey,
          })
        );
      } else {
        rowCells.push(
          <React.Fragment key={`${row}-${col}`}>
            {renderedCell}
          </React.Fragment>
        );
      }
    }

    const defaultRow = (
      <div
        key={row}
        className={rowClassName}
        style={rowStyle}
        {...restRowProps}
      >
        {rowCells}
      </div>
    );

    const renderedRow = renderRow
      ? renderRow({ defaultRow, rowIndex: row, cells: rowCells })
      : defaultRow;

    if (React.isValidElement(renderedRow)) {
      rowsContent.push(
        React.cloneElement(renderedRow, {
          key: renderedRow.key ?? row,
        })
      );
    } else {
      rowsContent.push(
        <React.Fragment key={row}>{renderedRow}</React.Fragment>
      );
    }
  }

  const {
    className: screenboardClassNameProp,
    style: screenboardStyleOverrides,
    ...restScreenboardProps
  } = screenboardContainerProps ?? {};

  const screenboardClassName = joinClassNames(
    "mediasfu-flexible-video__screenboard",
    screenboardClassNameProp
  );

  const screenboardStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: canvasLeft,
    width: cardWidth,
    height: cardHeight,
    backgroundColor: "rgba(0, 0, 0, 0.005)",
    zIndex: 2,
    pointerEvents: annotateScreenStream ? "auto" : "none",
    ...(screenboardStyleOverrides ?? {}),
  };

  const defaultScreenboard = !Screenboard
    ? null
    : (
        <div
          className={screenboardClassName}
          style={screenboardStyle}
          {...restScreenboardProps}
        >
          {Screenboard}
        </div>
      );

  const screenboardNode = renderScreenboard
    ? renderScreenboard({ defaultScreenboard })
    : defaultScreenboard;

  const defaultGrid = (
    <div
      className={containerClassName}
      style={containerStyle}
      {...restContainerProps}
    >
      {rowsContent}
      {screenboardNode}
    </div>
  );

  const gridNode = renderGrid
    ? renderGrid({ defaultGrid, rows: rowsContent })
    : defaultGrid;

  return <>{gridNode}</>;
};

const FlexibleVideo = React.memo(FlexibleVideoComponent);

export default FlexibleVideo;
