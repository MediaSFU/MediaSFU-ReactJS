import React, { useEffect, useState } from 'react';
/**
 * Represents a flexible video component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.customWidth - The custom width of the video component.
 * @param {number} props.customHeight - The custom height of the video component.
 * @param {number} props.rows - The number of rows in the video grid.
 * @param {number} props.columns - The number of columns in the video grid.
 * @param {Array} props.componentsToRender - The components to render in the video grid.
 * @param {boolean} props.showAspect - Determines whether to display the aspect ratio of the video.
 * @param {string} props.backgroundColor - The background color of the video component.
 * @param {ReactNode} props.Screenboard - The screenboard component to display.
 * @param {boolean} props.annotateScreenStream - Determines whether to annotate the screen stream.
 * @param {MediaStream} props.localStreamScreen - The local screen stream.
 * @returns {ReactNode} The rendered FlexibleVideo component.
 */
const FlexibleVideo = ({ customWidth, customHeight, rows, columns, componentsToRender, showAspect, backgroundColor, Screenboard, annotateScreenStream, localStreamScreen }) => {
  const [key, setKey] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [cardTop, setCardTop] = useState(0);
  const [cardLeft, setCardLeft] = useState(0);
  const [canvasLeft, setCanvasLeft] = useState(0);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [columns]);

  useEffect(() => {
    if (annotateScreenStream && localStreamScreen) {
      const videoHeight = localStreamScreen.getVideoTracks()[0].getSettings().height;
      const videoWidth = localStreamScreen.getVideoTracks()[0].getSettings().width;
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

  }, [customWidth, customHeight, localStreamScreen, annotateScreenStream]);

  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const rowComponents = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];

        rowComponents.push(
          <div key={col} style={{ flex: 1, width: cardWidth, height:cardHeight, backgroundColor: backgroundColor, margin: '1px', padding: 0, borderRadius: '0px', left: cardLeft }}>
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

  return (
    <div key={key} style={{ padding: 0, flex: 1, margin: 0, position: 'relative', display: showAspect ? 'flex' : 'none', maxWidth: customWidth, overflowX: 'hidden', overflowY: 'auto', left: cardLeft > 0 ? cardLeft : 0 }}>
      {renderGrid()}
      {Screenboard && (
        <div style={{ position: 'absolute', top: 0, left:canvasLeft, width:cardWidth, height: cardHeight, backgroundColor: 'rgba(0, 0, 0, 0.005)', zIndex: 2 }}>
          {Screenboard}
        </div>
      )}
    </div>
  );
};

export default FlexibleVideo;
