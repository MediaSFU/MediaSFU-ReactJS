/**
 * ModernFlexibleVideo - A modern styled flexible video grid component.
 *
 * This component provides glassmorphic styling and modern visual treatment
 * while maintaining API compatibility with the original FlexibleVideo.
 * Uses the same FlexibleVideoOptions interface as the original component.
 *
 * @example
 * ```tsx
 * <ModernFlexibleVideo
 *   customWidth={1280}
 *   customHeight={720}
 *   rows={2}
 *   columns={3}
 *   componentsToRender={videoComponents}
 *   showAspect={true}
 *   isDarkMode={true}
 *   enableGlassmorphism={true}
 * />
 * ```
 */

import React, { useEffect, useState } from "react";
import { FlexibleVideoOptions } from "../../components/displayComponents/FlexibleVideo";

// Extended options for modern styling - re-export as ModernFlexibleVideoOptions
export interface ModernFlexibleVideoOptions extends FlexibleVideoOptions {
  // Note: isDarkMode, enableGlassmorphism, cellBorderRadius, enableGlow are already
  // defined in FlexibleVideoOptions for Modern UI compatibility
}

export type ModernFlexibleVideoType = React.FC<ModernFlexibleVideoOptions>;

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

/**
 * ModernFlexibleVideo component renders a flexible grid of video components
 * with modern glassmorphic styling.
 *
 * This component maintains the same layout behavior as the original FlexibleVideo
 * (using flex: 1 for cell distribution) while adding modern visual styling.
 *
 * @component
 * @param {ModernFlexibleVideoOptions} props - The properties for the component.
 * @returns {React.JSX.Element} The rendered component.
 */
const ModernFlexibleVideoComponent: React.FC<ModernFlexibleVideoOptions> = ({
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
  // Modern-specific props (from FlexibleVideoOptions)
  isDarkMode = true,
  enableGlassmorphism = true,
  cellBorderRadius = 0,
  enableGlow = false,
}) => {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [cardLeft, setCardLeft] = useState<number>(0);
  const [canvasLeft, setCanvasLeft] = useState<number>(0);

  // Derive card size from stream or dimensions (matches original FlexibleVideo)
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
  }, [customWidth, customHeight, localStreamScreen, annotateScreenStream]);

  // Extract props for customization
  const {
    className: containerClassNameProp,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassName = joinClassNames(
    "modern-flexible-video",
    containerClassNameProp
  );

  // Container style - matches original FlexibleVideo with modern additions
  const containerStyle: React.CSSProperties = {
    padding: 0,
    flex: 1,
    margin: 0,
    position: "relative",
    display: showAspect ? "flex" : "none",
    flexDirection: "column",
    maxWidth: customWidth,
    overflowX: "hidden",
    overflowY: "auto",
    left: cardLeft > 0 ? cardLeft : 0,
    borderRadius: cellBorderRadius > 0 ? `${cellBorderRadius}px` : "0px",
    ...(containerStyleOverrides ?? {}),
  };

  const {
    className: rowClassNameProp,
    style: rowStyleOverrides,
    ...restRowProps
  } = rowProps ?? {};

  const rowClassName = joinClassNames(
    "modern-flexible-video__row",
    rowClassNameProp
  );

  // Row style - matches original FlexibleVideo
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
    "modern-flexible-video__cell",
    cellClassNameProp
  );

  // Theme-based colors for modern styling
  const getCellBgColor = (hasContent: boolean): string => {
    if (hasContent) return backgroundColor;
    if (enableGlassmorphism) {
      return isDarkMode ? "rgba(30, 30, 40, 0.6)" : "rgba(255, 255, 255, 0.6)";
    }
    return backgroundColor;
  };

  const borderColor = enableGlassmorphism
    ? isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
    : undefined;

  // Cell style - matches original FlexibleVideo with modern additions
  // Uses flex: 1 for distribution with cardWidth/cardHeight as constraints
  const getCellStyle = (hasContent: boolean): React.CSSProperties => ({
    flex: 1,
    width: cardWidth,
    height: cardHeight,
    backgroundColor: getCellBgColor(hasContent),
    margin: "1px",
    padding: 0,
    borderRadius: cellBorderRadius > 0 ? `${cellBorderRadius}px` : "0px",
    left: cardLeft,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Modern styling additions (only for empty cells with glassmorphism)
    ...(!hasContent &&
      enableGlassmorphism &&
      borderColor && {
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }),
    // Glow effect
    ...(enableGlow && {
      boxShadow: `0 0 20px ${isDarkMode ? "rgba(79, 172, 254, 0.2)" : "rgba(102, 126, 234, 0.2)"}`,
    }),
    ...(cellStyleOverrides ?? {}),
  });

  // Build modern empty cell content with video icon
  const buildEmptyCell = (): React.ReactNode => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))"
              : "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDarkMode
              ? "0 0 8px rgba(102, 126, 234, 0.15)"
              : "0 0 12px rgba(102, 126, 234, 0.2)",
          }}
        >
          {/* Videocam off icon */}
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDarkMode ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
            <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        </div>
      </div>
    );
  };

  // Build rows content
  const rowsContent: React.ReactNode[] = [];

  for (let row = 0; row < rows; row++) {
    const rowCells: React.ReactNode[] = [];

    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const component = componentsToRender[index];
      const hasContent = component !== undefined && component !== null;
      const componentKey =
        React.isValidElement(component) && component.key != null
          ? component.key
          : undefined;
      const cellKey = componentKey ?? `${row}-${col}`;

      const defaultCell = (
        <div
          key={cellKey as React.Key}
          className={cellClassName}
          style={getCellStyle(hasContent)}
          {...restCellProps}
        >
          {hasContent ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: cellBorderRadius > 0 ? `${cellBorderRadius}px` : "0px",
                overflow: "hidden",
              }}
            >
              {component}
            </div>
          ) : (
            buildEmptyCell()
          )}
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
          <React.Fragment key={`${row}-${col}`}>{renderedCell}</React.Fragment>
        );
      }
    }

    const defaultRow = (
      <div key={row} className={rowClassName} style={rowStyle} {...restRowProps}>
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
      rowsContent.push(<React.Fragment key={row}>{renderedRow}</React.Fragment>);
    }
  }

  // Screenboard handling
  const {
    className: screenboardClassNameProp,
    style: screenboardStyleOverrides,
    ...restScreenboardProps
  } = screenboardContainerProps ?? {};

  const screenboardClassName = joinClassNames(
    "modern-flexible-video__screenboard",
    screenboardClassNameProp
  );

  // Screenboard style - matches original FlexibleVideo with modern additions
  const screenboardStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: canvasLeft,
    width: cardWidth,
    height: cardHeight,
    backgroundColor: "rgba(0, 0, 0, 0.005)",
    zIndex: 2,
    pointerEvents: annotateScreenStream ? "auto" : "none",
    borderRadius: cellBorderRadius > 0 ? `${cellBorderRadius}px` : "0px",
    overflow: "hidden",
    ...(screenboardStyleOverrides ?? {}),
  };

  const defaultScreenboard = !Screenboard ? null : (
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

export const ModernFlexibleVideo = React.memo(ModernFlexibleVideoComponent);
export default ModernFlexibleVideo;