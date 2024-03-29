/**
 * MainGridComponent - A React component for rendering a main grid container with children and an optional meeting progress timer.
 * @param {Object} props - The props passed to the MainGridComponent.
 * @param {ReactNode} props.children - The components to be rendered inside the main grid.
 * @param {string} props.backgroundColor - The background color of the main grid container.
 * @param {number} props.mainSize - The size of the main grid (width or height).
 * @param {number} props.height - The height of the main grid container.
 * @param {number} props.width - The width of the main grid container.
 * @param {boolean} props.showAspect - Flag indicating whether to show or hide the main grid based on the aspect ratio (default is true).
 * @param {string} props.timeBackgroundColor - The background color of the meeting progress timer.
 * @param {boolean} props.showTimer - Flag indicating whether to show the meeting progress timer.
 * @param {number} props.meetingProgressTime - The time duration for the meeting progress timer.
 * @returns {React.Component} - The MainGridComponent.
 */

import React from 'react';
import MeetingProgressTimer from './MeetingProgressTimer';


const MainGridComponent = ({
  children,
  backgroundColor,
  mainSize,
  height,
  width,
  showAspect = true,
  timeBackgroundColor,
  showTimer,
  meetingProgressTime,
}) => {
  const maingridContainerStyle = {
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

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  };

  const progressTimerStyle = {
    width: 50,
    height: 20,
    backgroundColor: 'green',
  };

  return (
    <div style={maingridContainerStyle}>
      <MeetingProgressTimer meetingProgressTime={meetingProgressTime} initialBackgroundColor={timeBackgroundColor} showTimer={showTimer} />
      {children}
    </div>
  );
};

export default MainGridComponent;
