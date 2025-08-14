import React, { useEffect, useState } from "react";

export interface FlexibleGridOptions {
  customWidth: number;
  customHeight: number;
  rows: number;
  columns: number;
  componentsToRender: React.ReactNode[]; // Array of React components or elements
  backgroundColor?: string;
}

export type FlexibleGridType = (options: FlexibleGridOptions) => React.JSX.Element;

/**
 * FlexibleGrid component renders a customizable grid layout with specified dimensions and components.
 *
 * This component arranges a series of components in a grid, with options to set the width, height, and background color of each grid item.
 *
 * @component
 * @param {FlexibleGridOptions} props - The properties object.
 * @param {number} props.customWidth - Custom width for each grid item, in pixels.
 * @param {number} props.customHeight - Custom height for each grid item, in pixels.
 * @param {number} props.rows - Number of rows in the grid layout.
 * @param {number} props.columns - Number of columns in the grid layout.
 * @param {React.ReactNode[]} props.componentsToRender - Array of React components or elements to display in the grid.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 *
 * @returns {React.JSX.Element} The rendered grid layout.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const componentsToRender = [
 *     <Component1 />,
 *     <Component2 />,
 *     <Component3 />,
 *     <Component4 />,
 *     <Component5 />,
 *     <Component6 />,
 *   ];
 *
 *   return (
 *     <FlexibleGrid
 *       customWidth={100}
 *       customHeight={100}
 *       rows={2}
 *       columns={3}
 *       componentsToRender={componentsToRender}
 *       backgroundColor="white"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */


const FlexibleGrid: React.FC<FlexibleGridOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  backgroundColor = "transparent", // Default background color
}) => {
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [columns]);

  const renderGrid = () => {
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
              width: customWidth,
              height: customHeight,
              backgroundColor: backgroundColor,
              margin: "1px",
              padding: 0,
              borderRadius: "8px",
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
    <div key={key} style={{ padding: 0 }}>
      {renderGrid()}
    </div>
  );
};

export default FlexibleGrid;
