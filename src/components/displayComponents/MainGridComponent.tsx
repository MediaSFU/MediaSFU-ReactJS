import React from 'react';
import MeetingProgressTimer from './MeetingProgressTimer';

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
 * @param {React.ReactNode} children - The child components to be rendered inside the main grid.
 * @param {string} backgroundColor - The background color of the main grid container.
 * @param {string | number} height - The height of the main grid container.
 * @param {string | number} width - The width of the main grid container.
 * @param {boolean} [showAspect=true] - Flag to determine if the aspect ratio should be shown.
 * @param {string} [timeBackgroundColor='transparent'] - The background color of the timer.
 * @param {boolean} showTimer - Flag to determine if the timer should be shown.
 * @param {string} meetingProgressTime - The time to display on the timer.
 *
 * @returns {JSX.Element} The rendered main grid container with optional children and timer.
 */
const MainGridComponent: React.FC<MainGridComponentOptions> = ({
  children,
  backgroundColor,
  height,
  width,
  showAspect = true, // Default value for showAspect
  timeBackgroundColor = 'transparent', // Default value for timeBackgroundColor
  showTimer = true, // Default value for showTimer
  meetingProgressTime,
}) => {
  const maingridContainerStyle: React.CSSProperties = {
    display: showAspect ? 'flex' : 'none',
    backgroundColor,
    height,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 4,
  };

  return (
    <div style={maingridContainerStyle}>
      <MeetingProgressTimer
        meetingProgressTime={meetingProgressTime}
        initialBackgroundColor={timeBackgroundColor}
        showTimer={showTimer}
      />
      {children}
    </div>
  );
};

export default MainGridComponent;