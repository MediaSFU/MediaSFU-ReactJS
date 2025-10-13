import React, { useMemo } from "react";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

export interface FlexibleGridOptions {
  customWidth: number;
  customHeight: number;
  rows: number;
  columns: number;
  componentsToRender: React.ReactNode[]; // Array of React components or elements
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

/**
 * FlexibleGrid component renders a customizable grid layout with specified dimensions, components,
 * and advanced customization hooks.
 *
 * This component is perfect for organizing participant cards, media thumbnails, or any grid-based
 * content with precise control over layout and styling. It supports:
 * - Dynamic grid sizing (rows × columns)
 * - Custom cell, row, and grid renderers
 * - Empty cell fallback content
 * - Per-cell HTML attributes
 * - Override patterns for use in MediaSFU UI components
 *
 * @component
 * @param {FlexibleGridOptions} props - The properties object.
 * @param {number} props.customWidth - Total width for the grid in pixels.
 * @param {number} props.customHeight - Total height for the grid in pixels.
 * @param {number} props.rows - Number of rows in the grid layout.
 * @param {number} props.columns - Number of columns in the grid layout.
 * @param {React.ReactNode[]} props.componentsToRender - Array of React components or elements to display in grid cells.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid cell.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.gridWrapperProps] - HTML props for the main grid wrapper.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.rowProps] - HTML props for row containers.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.cellProps] - HTML props for individual cells.
 * @param {React.ReactNode | Function} [props.emptyCellFallback] - Content to show in empty cells, or function receiving { row, column, index }.
 * @param {Function} [props.renderCell] - Custom render function for individual cells. Receives { defaultCell, component, row, column, index }.
 * @param {Function} [props.renderRow] - Custom render function for rows. Receives { defaultRow, rowIndex, cells }.
 * @param {Function} [props.renderGrid] - Custom render function for the entire grid. Receives { defaultGrid, rows }.
 *
 * @returns {React.JSX.Element} The rendered grid layout.
 *
 * @example
 * **Basic Usage**
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid, AudioCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const audioCards = participants.map(p => (
 *     <AudioCard key={p.id} participant={p} parameters={parameters} />
 *   ));
 *
 *   return (
 *     <FlexibleGrid
 *       customWidth={window.innerWidth}
 *       customHeight={400}
 *       rows={2}
 *       columns={4}
 *       componentsToRender={audioCards}
 *       backgroundColor="#f0f0f0"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Empty Cell Fallback**
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <FlexibleGrid
 *       customWidth={800}
 *       customHeight={600}
 *       rows={3}
 *       columns={3}
 *       componentsToRender={videoCards}
 *       emptyCellFallback={({ row, column }) => (
 *         <div style={{
 *           display: 'flex',
 *           alignItems: 'center',
 *           justifyContent: 'center',
 *           color: '#999',
 *           fontSize: 14
 *         }}>
 *           Empty [{row},{column}]
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Cell Renderer with Hover Effects**
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <FlexibleGrid
 *       customWidth={1200}
 *       customHeight={800}
 *       rows={2}
 *       columns={3}
 *       componentsToRender={participantCards}
 *       renderCell={({ defaultCell, component, index }) => (
 *         <div
 *           style={{
 *             border: '2px solid transparent',
 *             borderRadius: 12,
 *             overflow: 'hidden',
 *             transition: 'all 0.3s ease'
 *           }}
 *           onMouseEnter={(e) => {
 *             e.currentTarget.style.borderColor = '#667eea';
 *             e.currentTarget.style.transform = 'scale(1.05)';
 *             e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.3)';
 *           }}
 *           onMouseLeave={(e) => {
 *             e.currentTarget.style.borderColor = 'transparent';
 *             e.currentTarget.style.transform = 'scale(1)';
 *             e.currentTarget.style.boxShadow = 'none';
 *           }}
 *         >
 *           {defaultCell}
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
 * import { MediasfuGeneric, FlexibleGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomFlexibleGrid = (props: any) => (
 *     <FlexibleGrid
 *       {...props}
 *       backgroundColor="#1a1a2e"
 *       renderGrid={({ defaultGrid }) => (
 *         <div style={{
 *           padding: 16,
 *           background: 'linear-gradient(135deg, #667eea, #764ba2)',
 *           borderRadius: 20,
 *           boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
 *         }}>
 *           {defaultGrid}
 *         </div>
 *       )}
 *       renderCell={({ defaultCell }) => (
 *         <div style={{
 *           border: '2px solid rgba(255,255,255,0.2)',
 *           borderRadius: 10,
 *           overflow: 'hidden'
 *         }}>
 *           {defaultCell}
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
 *         flexibleGrid: CustomFlexibleGrid
 *       }}
 *     />
 *   );
 * }
 * ```
 */


const FlexibleGridComponent: React.FC<FlexibleGridOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  backgroundColor = "transparent", // Default background color
  gridWrapperProps,
  rowProps,
  cellProps,
  emptyCellFallback,
  renderCell,
  renderRow,
  renderGrid,
}) => {
  const {
    className: gridClassName,
    style: gridStyleOverrides,
    ...restGridWrapperProps
  } = gridWrapperProps ?? {};

  const gridClassNames = joinClassNames(
    "mediasfu-flexible-grid",
    gridClassName
  );

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

  const rowClassNames = joinClassNames(
    "mediasfu-flexible-grid__row",
    rowClassName
  );

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

  const cellClassNames = joinClassNames(
    "mediasfu-flexible-grid__cell",
    cellClassName
  );

  const cellStyle: React.CSSProperties = {
    flex: 1,
    width: customWidth,
    height: customHeight,
    backgroundColor,
    margin: "1px",
    padding: 0,
    ...cellStyleOverrides,
  };

  const getEmptyCell = (row: number, column: number, index: number) => {
    if (typeof emptyCellFallback === "function") {
      return emptyCellFallback({ row, column, index });
    }

    return emptyCellFallback ?? null;
  };

  const gridRows = useMemo(() => {
    const rowsNodes: React.ReactNode[] = [];

    for (let row = 0; row < rows; row++) {
      const cells: React.ReactNode[] = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];
        const content = component ?? getEmptyCell(row, col, index);
        const componentKey = React.isValidElement(component) && component.key != null
          ? component.key
          : undefined;
        const cellKey = componentKey ?? `${row}-${col}`;

        const defaultCell = (
          <div
            key={cellKey as React.Key}
            className={cellClassNames}
            style={cellStyle}
            {...restCellProps}
          >
            {content}
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
            <React.Fragment key={`${row}-${col}`}>
              {renderedCell}
            </React.Fragment>
          );
        }
      }

      const defaultRow = (
        <div
          key={row}
          className={rowClassNames}
          style={rowStyle}
          {...restRowProps}
        >
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
        rowsNodes.push(
          <React.Fragment key={row}>{renderedRow}</React.Fragment>
        );
      }
    }

    return rowsNodes;
  }, [
    rows,
    columns,
    componentsToRender,
    cellClassNames,
    cellStyle,
    restCellProps,
    renderCell,
    renderRow,
    rowClassNames,
    rowStyle,
    restRowProps,
    emptyCellFallback,
  ]);

  const defaultGrid = (
    <div
      className={gridClassNames}
      style={gridStyle}
      {...restGridWrapperProps}
    >
      {gridRows}
    </div>
  );

  const gridNode = renderGrid
    ? renderGrid({ defaultGrid, rows: gridRows })
    : defaultGrid;

  return <>{gridNode}</>;
};

const arePropsEqual = (
  prev: Readonly<FlexibleGridOptions>,
  next: Readonly<FlexibleGridOptions>
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
    prev.renderGrid !== next.renderGrid
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

const FlexibleGrid = React.memo(FlexibleGridComponent, arePropsEqual);

export default FlexibleGrid;
