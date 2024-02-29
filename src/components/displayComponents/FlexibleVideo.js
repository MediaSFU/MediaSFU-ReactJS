import React, { useEffect, useState } from 'react';

/**
 * FlexibleVideo - A React component for rendering a flexible grid layout.
 * @param {Object} props - The props passed to the FlexibleVideo.
 * @param {number} props.customWidth - Custom width for each grid item.
 * @param {number} props.customHeight - Custom height for each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {Array} props.componentsToRender - Array of React components to render in the grid.
 * @param {boolean} props.showAspect - Flag indicating whether to show the aspect ratio.
 * @param {string} props.backgroundColor - Background color for each grid item.
 * @returns {React.Component} - The FlexibleVideo component.
 */
const FlexibleVideo = ({ customWidth, customHeight, rows, columns, componentsToRender, showAspect, backgroundColor }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [columns]);

  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const rowComponents = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];

        rowComponents.push(
          <div key={col} style={{ flex: 1, width: customWidth, height: customHeight, backgroundColor: backgroundColor, margin: '1px', padding: 0, borderRadius: '0px' }}>
            {component}
          </div>
        );
      }

      grid.push(
        <div key={row} style={{ display: 'flex', flexDirection: 'row' }}>
          {rowComponents}
        </div>
      );
    }

    return grid;
  };

  return <div key={key} style={{ padding: 0, flex: 1, margin: 0, display: showAspect ? 'flex' : 'none' }}>{renderGrid()}</div>;

};

export default FlexibleVideo;
