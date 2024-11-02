import React from "react";
import MeetingProgressTimer from "./MeetingProgressTimer";

export interface OtherGridComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  width: number;
  height: number;
  showAspect?: boolean;
  timeBackgroundColor?: string;
  showTimer: boolean;
  meetingProgressTime: string;
}

export type OtherGridComponentType = React.FC<OtherGridComponentOptions>;

/**
 * OtherGridComponent is a React functional component that displays a grid container with customizable dimensions, background color, and optional timer.
 * 
 * This component serves as a flexible grid layout with the option to display a timer for meeting progress. Child components can be passed to populate the grid, making it versatile for various layout needs.
 * 
 * @component
 * @param {Object} props - The properties for the OtherGridComponent.
 * @param {string} props.backgroundColor - The background color for the grid container.
 * @param {React.ReactNode} props.children - Child components to render within the grid.
 * @param {number} props.width - The width of the grid.
 * @param {number} props.height - The height of the grid.
 * @param {boolean} [props.showAspect=true] - Controls the visibility of the grid.
 * @param {string} [props.timeBackgroundColor] - The background color of the timer component.
 * @param {boolean} props.showTimer - Determines whether the meeting progress timer should be displayed.
 * @param {string} props.meetingProgressTime - The meeting progress time to display on the timer.
 *
 * @returns {JSX.Element} A styled grid container with optional timer and child components.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { OtherGridComponent } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   return (
 *     <OtherGridComponent
 *       backgroundColor="black"
 *       width={100}
 *       height={100}
 *       showAspect={true}
 *       timeBackgroundColor="white"
 *       showTimer={true}
 *       meetingProgressTime="10:00"
 *     >
 *       <ChildComponent />
 *     </OtherGridComponent>
 *   );
 * }
 * 
 * export default App;
 * ```
 */

const OtherGridComponent: React.FC<OtherGridComponentOptions> = ({
  backgroundColor,
  children,
  width,
  height,
  showAspect = true,
  timeBackgroundColor,
  showTimer,
  meetingProgressTime,
}) => {
  return (
    <div
      style={{
        backgroundColor,
        width,
        height,
        display: showAspect ? "block" : "none",
        overflow: "hidden",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Render the meeting progress timer */}
      {showTimer && (
        <MeetingProgressTimer
          meetingProgressTime={meetingProgressTime}
          initialBackgroundColor={timeBackgroundColor}
          showTimer={showTimer}
        />
      )}
      {/* Render the children */}
      {children}
    </div>
  );
};

export default OtherGridComponent;
