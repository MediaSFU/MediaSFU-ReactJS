import React, { useEffect, useState } from "react";

export interface FlexibleGridOptions {
  customWidth: number;
  customHeight: number;
  rows: number;
  columns: number;
  componentsToRender: React.ReactNode[]; // Array of React components or elements
  backgroundColor?: string;
}

export type FlexibleGridType = (options: FlexibleGridOptions) => JSX.Element;

/**
 * FlexibleGrid component renders a grid layout with customizable dimensions and components.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.customWidth] - Custom width for each grid item.
 * @param {string} [props.customHeight] - Custom height for each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {React.ReactNode[]} props.componentsToRender - Array of components to render in the grid.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 *
 * @returns {JSX.Element} The rendered grid layout.
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
