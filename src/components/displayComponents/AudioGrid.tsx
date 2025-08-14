import React from 'react';

export interface AudioGridOptions {
  componentsToRender: React.ReactNode[]; // Array of React components or elements
}

export type AudioGridType = (options: AudioGridOptions) => React.ReactNode;

/**
 * AudioGrid component renders a grid of audio components.
 * 
 * This component organizes an array of React elements or components into a structured grid layout.
 * 
 * @component
 * @param {AudioGridOptions} props - The properties for the AudioGrid component.
 * @param {React.ReactNode[]} props.componentsToRender - An array of React components to be rendered in the grid layout.
 * 
 * @returns {React.JSX.Element} A JSX element containing the rendered grid of audio components.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioGrid } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const componentsToRender = [
 *     <AudioComponent1 />,
 *     <AudioComponent2 />,
 *     <AudioComponent3 />,
 *   ];
 *
 *   return (
 *     <AudioGrid componentsToRender={componentsToRender} />
 *   );
 * }
 *
 * export default App;
 * ```
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
