import React from 'react';
export interface AudioGridOptions {
    componentsToRender: React.ReactNode[];
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
 * @returns {JSX.Element} A JSX element containing the rendered grid of audio components.
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
declare const AudioGrid: React.FC<AudioGridOptions>;
export default AudioGrid;
//# sourceMappingURL=AudioGrid.d.ts.map