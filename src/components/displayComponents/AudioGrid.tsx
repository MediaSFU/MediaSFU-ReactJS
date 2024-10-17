import React from 'react';

export interface AudioGridOptions {
  componentsToRender: React.ReactNode[]; // Array of React components or elements
}

export type AudioGridType = (options: AudioGridOptions) => React.ReactNode;

/**
 * AudioGrid component
 * 
 * This component is responsible for rendering a grid of audio components.
 * 
 * @component
 * @param {AudioGridOptions} props - The properties for the AudioGrid component.
 * @param {React.ReactNode[]} props.componentsToRender - An array of React components to be rendered in the grid.
 * 
 * @returns {JSX.Element} The rendered grid of audio components.
 */
const AudioGrid: React.FC<AudioGridOptions> = ({ componentsToRender }) => {
  /**
   * renderGrid - Renders componentsToRender array into a grid.
   * @returns {React.ReactNode[]} - An array of React components rendered in the grid.
   */
  const renderGrid = (): React.ReactNode[] => {
    return componentsToRender.map((component, index) => (
      <div style={{ zIndex: 9 }} key={index}>
        {component}
      </div>
    ));
  };

  return <div style={{ zIndex: 9 }}>{renderGrid()}</div>;
};

export default AudioGrid;
