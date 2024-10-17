import React from 'react';

export interface MeetingProgressTimerOptions {
  meetingProgressTime: string;
  initialBackgroundColor?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  textStyle?: React.CSSProperties;
  showTimer?: boolean;
}

export type MeetingProgressTimerType = (options: MeetingProgressTimerOptions) => JSX.Element;

/**
 * MeetingProgressTimer component displays a timer indicating the progress of a meeting.
 *
 * @param {MeetingProgressTimerOptions} props - The properties for the MeetingProgressTimer component.
 * @param {string} props.meetingProgressTime - The current progress time of the meeting to be displayed.
 * @param {string} [props.initialBackgroundColor='green'] - The initial background color of the timer.
 * @param {string} [props.position='topLeft'] - The position of the timer on the screen.
 * @param {React.CSSProperties} [props.textStyle={}] - Additional styles to apply to the timer text.
 * @param {boolean} [props.showTimer=true] - Flag to determine whether the timer should be displayed.
 *
 * @returns {JSX.Element} The rendered MeetingProgressTimer component.
 */
const MeetingProgressTimer: React.FC<MeetingProgressTimerOptions> = ({
  meetingProgressTime,
  initialBackgroundColor = 'green',
  position = 'topLeft',
  textStyle = {},
  showTimer = true,
}) => {
  return (
    <div style={{ ...styles.badgeContainer, ...positions[position] }}>
      <div
        style={{
          ...styles.progressTimer,
          backgroundColor: initialBackgroundColor,
          display: showTimer ? 'block' : 'none',
        }}
      >
        <span style={{ ...styles.progressTimerText, ...textStyle }}>
          {meetingProgressTime}
        </span>
      </div>
    </div>
  );
};

const positions: Record<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', React.CSSProperties> = {
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
  } as React.CSSProperties,
  progressTimer: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  } as React.CSSProperties,
  progressTimerText: {
    color: 'black',
  } as React.CSSProperties,
};

export default MeetingProgressTimer;
