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
 * A React functional component that displays a grid with optional timer and children components.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.backgroundColor - The background color of the grid.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the grid.
 * @param {string | number} props.width - The width of the grid.
 * @param {string | number} props.height - The height of the grid.
 * @param {boolean} [props.showAspect=true] - Flag to determine if the grid should be displayed.
 * @param {string} props.timeBackgroundColor - The background color of the timer.
 * @param {boolean} props.showTimer - Flag to determine if the timer should be displayed.
 * @param {string} props.meetingProgressTime - The time to display on the timer.
 * @returns {JSX.Element} The rendered grid component.
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
