/**
 * MeetingProgressTimer component displays a timer with customizable background color
 * and position on the screen. It can be used to show the elapsed time of a meeting,
 * with different background colors indicating different states (e.g., recording, paused).
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.meetingProgressTime - The elapsed time of the meeting in seconds.
 * @param {string} [props.initialBackgroundColor='green'] - The initial background color of the timer.
 * @param {string} [props.position='topLeft'] - The position on the screen where the timer should be displayed.
 * Possible values are 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
 * @param {Object} [props.textStyle] - Additional styles for the timer text.
 * @param {boolean} [props.showTimer=true] - Flag indicating whether to show the timer.
 * @returns {JSX.Element} - The rendered component.
 */

import React, { useState, useEffect } from 'react';

const MeetingProgressTimer = ({ meetingProgressTime, initialBackgroundColor = 'green', position = 'topLeft', textStyle, showTimer = true }) => {
  return (
    <div style={{ ...styles.badgeContainer, ...positions[position] }}>
      <div style={{ ...styles.progressTimer, backgroundColor: initialBackgroundColor, display: showTimer ? 'block' : 'none' }}>
        <span style={{ ...styles.progressTimerText, ...textStyle }}>{meetingProgressTime}</span>
      </div>
    </div>
  );
};

const positions = {
  topLeft: { position: 'absolute', top: 0, left: 0 },
  topRight: { position: 'absolute', top: 0, right: 0 },
  bottomLeft: { position: 'absolute', bottom: 0, left: 0 },
  bottomRight: { position: 'absolute', bottom: 0, right: 0 },
};

const styles = {
  badgeContainer: {
    padding: 5,
    position: 'relative',
    zIndex: 1000,
  },
  progressTimer: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  progressTimerText: {
    color: 'black',
  },
};

export default MeetingProgressTimer;
