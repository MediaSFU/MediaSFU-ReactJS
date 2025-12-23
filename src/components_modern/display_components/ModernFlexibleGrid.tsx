/**
 * ModernFlexibleGrid - A modern styled flexible grid component.
 *
 * This component provides glassmorphic styling and modern visual treatment
 * while maintaining API compatibility with the original FlexibleGrid.
 * Uses the same FlexibleGridOptions interface as the original component.
 *
 * @example
 * ```tsx
 * <ModernFlexibleGrid
 *   customWidth={800}
 *   customHeight={600}
 *   rows={3}
 *   columns={4}
 *   componentsToRender={videoCards}
 *   isDarkMode={true}
 *   enableGlassmorphism={true}
 * />
 * ```
 */

import React, { useMemo } from "react";
import { FlexibleGridOptions } from "../../components/displayComponents/FlexibleGrid";

// Extended options for modern styling
export interface ModernFlexibleGridOptions extends FlexibleGridOptions {
  /** Use dark mode styling (default: true) */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects for empty cells (default: true) */
  enableGlassmorphism?: boolean;
  /** Border radius for cells in pixels (default: 8) */
  cellBorderRadius?: number;
}

export type ModernFlexibleGridType = React.FC<ModernFlexibleGridOptions>;

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

/**
 * ModernFlexibleGrid component renders a flexible grid of components
 * with modern glassmorphic styling.
 *
 * This component maintains the same layout behavior as the original FlexibleGrid
 * (using flex: 1 for cell distribution) while adding modern visual styling.
 *
 * @component
 * @param {ModernFlexibleGridOptions} props - The properties for the component.
 * @returns {React.JSX.Element} The rendered component.
 */
const ModernFlexibleGridComponent: React.FC<ModernFlexibleGridOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  backgroundColor = "transparent",
  gridWrapperProps,
  rowProps,
  cellProps,
  emptyCellFallback,
  renderCell,
  renderRow,
  renderGrid,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  cellBorderRadius = 8,
}) => {
  // Early return if invalid dimensions (matches original FlexibleGrid)
  if (rows <= 0 || columns <= 0) {
    return <></>;
  }

  // Extract props for customization
  const {
    className: gridClassName,
    style: gridStyleOverrides,
    ...restGridWrapperProps
  } = gridWrapperProps ?? {};

  const gridClassNames = joinClassNames("modern-flexible-grid", gridClassName);

  // Grid wrapper style - matches original FlexibleGrid
  const gridStyle: React.CSSProperties = {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    ...gridStyleOverrides,
  };

  const {
    className: rowClassName,
    style: rowStyleOverrides,
    ...restRowProps
  } = rowProps ?? {};

  const rowClassNames = joinClassNames("modern-flexible-grid__row", rowClassName);

  // Row style - matches original FlexibleGrid
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    ...rowStyleOverrides,
  };

  const {
    className: cellClassName,
    style: cellStyleOverrides,
    ...restCellProps
  } = cellProps ?? {};

  const cellClassNames = joinClassNames("modern-flexible-grid__cell", cellClassName);

  // Theme-based colors for modern styling
  const emptyCellBgColor = useMemo(() => {
    if (enableGlassmorphism) {
      return isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)";
    }
    return backgroundColor;
  }, [isDarkMode, enableGlassmorphism, backgroundColor]);

  const borderColor = useMemo(() => {
    if (!enableGlassmorphism) return undefined;
    return isDarkMode ? "rgba(102, 126, 234, 0.1)" : "rgba(102, 126, 234, 0.05)";
  }, [isDarkMode, enableGlassmorphism]);

  // Get cell style based on whether it has content
  // Uses flex: 1 for distribution (matching original FlexibleGrid)
  // with customWidth/customHeight as constraints
  const getCellStyle = (hasContent: boolean): React.CSSProperties => ({
    flex: 1,
    width: customWidth,
    height: customHeight,
    backgroundColor: hasContent ? backgroundColor : emptyCellBgColor,
    margin: "1px",
    padding: 0,
    borderRadius: `${cellBorderRadius}px`,
    // overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Modern styling additions (only for empty cells with glassmorphism)
    ...(!hasContent &&
      enableGlassmorphism &&
      borderColor && {
        border: `1px solid ${borderColor}`,
      }),
    ...cellStyleOverrides,
  });

  // Build modern empty cell content
  const buildEmptyCell = (
    row: number,
    column: number,
    index: number
  ): React.ReactNode => {
    if (typeof emptyCellFallback === "function") {
      return emptyCellFallback({ row, column, index });
    }
    if (emptyCellFallback) {
      return emptyCellFallback;
    }

    // Default modern empty cell with user icon
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
            width: 40,
            height: 40,
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
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDarkMode ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    );
  };

  // Build grid rows
  const gridRows = useMemo(() => {
    const rowsNodes: React.ReactNode[] = [];

    for (let row = 0; row < rows; row++) {
      const cells: React.ReactNode[] = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];
        const hasContent = component !== undefined && component !== null;
        const content = hasContent ? component : buildEmptyCell(row, col, index);
        const componentKey =
          React.isValidElement(component) && component.key != null
            ? component.key
            : undefined;
        const cellKey = componentKey ?? `${row}-${col}`;

        const defaultCell = (
          <div
            key={cellKey as React.Key}
            className={cellClassNames}
            style={getCellStyle(hasContent)}
            {...restCellProps}
          >
            {hasContent ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: `${cellBorderRadius}px`,
                  // overflow: "hidden",
                  // Center content (like MiniCard) within the cell
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {content}
              </div>
            ) : (
              content
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
          cells.push(
            React.cloneElement(renderedCell, {
              key: renderedCell.key ?? cellKey,
            })
          );
        } else {
          cells.push(
            <React.Fragment key={`${row}-${col}`}>{renderedCell}</React.Fragment>
          );
        }
      }

      const defaultRow = (
        <div key={row} className={rowClassNames} style={rowStyle} {...restRowProps}>
          {cells}
        </div>
      );

      const renderedRow = renderRow
        ? renderRow({ defaultRow, rowIndex: row, cells })
        : defaultRow;

      if (React.isValidElement(renderedRow)) {
        rowsNodes.push(
          React.cloneElement(renderedRow, {
            key: renderedRow.key ?? row,
          })
        );
      } else {
        rowsNodes.push(<React.Fragment key={row}>{renderedRow}</React.Fragment>);
      }
    }

    return rowsNodes;
  }, [
    rows,
    columns,
    componentsToRender,
    customWidth,
    customHeight,
    backgroundColor,
    emptyCellBgColor,
    borderColor,
    cellBorderRadius,
    cellClassNames,
    restCellProps,
    renderCell,
    rowClassNames,
    rowStyle,
    restRowProps,
    renderRow,
    emptyCellFallback,
    isDarkMode,
    enableGlassmorphism,
  ]);

  const defaultGrid = (
    <div className={gridClassNames} style={gridStyle} {...restGridWrapperProps}>
      {gridRows}
    </div>
  );

  const gridNode = renderGrid
    ? renderGrid({ defaultGrid, rows: gridRows })
    : defaultGrid;

  return <>{gridNode}</>;
};

const arePropsEqual = (
  prev: Readonly<ModernFlexibleGridOptions>,
  next: Readonly<ModernFlexibleGridOptions>
): boolean => {
  if (
    prev.customWidth !== next.customWidth ||
    prev.customHeight !== next.customHeight ||
    prev.rows !== next.rows ||
    prev.columns !== next.columns ||
    prev.backgroundColor !== next.backgroundColor ||
    prev.gridWrapperProps !== next.gridWrapperProps ||
    prev.rowProps !== next.rowProps ||
    prev.cellProps !== next.cellProps ||
    prev.emptyCellFallback !== next.emptyCellFallback ||
    prev.renderCell !== next.renderCell ||
    prev.renderRow !== next.renderRow ||
    prev.renderGrid !== next.renderGrid ||
    prev.isDarkMode !== next.isDarkMode ||
    prev.enableGlassmorphism !== next.enableGlassmorphism ||
    prev.cellBorderRadius !== next.cellBorderRadius
  ) {
    return false;
  }

  const prevComponents = prev.componentsToRender;
  const nextComponents = next.componentsToRender;

  if (prevComponents.length !== nextComponents.length) {
    return false;
  }

  for (let index = 0; index < prevComponents.length; index++) {
    if (prevComponents[index] !== nextComponents[index]) {
      return false;
    }
  }

  return true;
};

export const ModernFlexibleGrid = React.memo(
  ModernFlexibleGridComponent,
  arePropsEqual
);
export default ModernFlexibleGrid;