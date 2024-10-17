import React from 'react';

/**
 * AudioGrid - A React JS component for rendering an audio grid with customizable components.
 * @param {Object} props - The props passed to the AudioGrid component.
 * @param {Array} props.componentsToRender - An array of React components to be rendered in the audio grid.
 * @returns {React.Component} - The AudioGrid component.
 */

const AudioGrid = ({ componentsToRender }) => {
  /**
   * renderGrid - Renders componentsToRender array into a grid.
   * @returns {Array} - An array of React components rendered in the grid.
   */
  const renderGrid = () => {
    return componentsToRender.map((component, index) => (
      <div style={{ zIndex: 9 }} key={index}>{component}</div>
    ));
  };

  return (
    <div style={{ zIndex: 9 }}>{renderGrid()}</div>
  );
};

export default AudioGrid;
