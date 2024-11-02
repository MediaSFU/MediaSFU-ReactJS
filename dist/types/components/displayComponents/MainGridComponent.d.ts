import React from 'react';
export interface MainGridComponentOptions {
    children: React.ReactNode;
    backgroundColor: string;
    mainSize: number;
    height: number;
    width: number;
    showAspect?: boolean;
    timeBackgroundColor?: string;
    showTimer?: boolean;
    meetingProgressTime: string;
}
export type MainGridComponentType = (options: MainGridComponentOptions) => JSX.Element;
/**
 * MainGridComponent is a React functional component that renders a main grid container
 * with optional children components and a meeting progress timer.
 *
 * @component
 * @param {MainGridComponentOptions} props - The properties for MainGridComponent.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the main grid.
 * @param {string} props.backgroundColor - The background color of the main grid container.
 * @param {number} props.height - The height of the main grid container.
 * @param {number} props.width - The width of the main grid container.
 * @param {boolean} [props.showAspect=true] - Flag to determine if the aspect ratio should be shown.
 * @param {string} [props.timeBackgroundColor='transparent'] - The background color of the timer.
 * @param {boolean} [props.showTimer=true] - Flag to determine if the timer should be shown.
 * @param {string} props.meetingProgressTime - The time to display on the timer.
 *
 * @returns {JSX.Element} The rendered main grid container with optional children and timer.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainGridComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainGridComponent
 *       backgroundColor="black"
 *       height={100}
 *       width={100}
 *       showAspect={true}
 *       timeBackgroundColor="white"
 *       showTimer={true}
 *       meetingProgressTime="10:00"
 *     >
 *       <ChildComponent />
 *     </MainGridComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MainGridComponent: React.FC<MainGridComponentOptions>;
export default MainGridComponent;
//# sourceMappingURL=MainGridComponent.d.ts.map