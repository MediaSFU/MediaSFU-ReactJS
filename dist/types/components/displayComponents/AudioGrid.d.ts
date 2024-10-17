import React from 'react';
export interface AudioGridOptions {
    componentsToRender: React.ReactNode[];
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
declare const AudioGrid: React.FC<AudioGridOptions>;
export default AudioGrid;
//# sourceMappingURL=AudioGrid.d.ts.map