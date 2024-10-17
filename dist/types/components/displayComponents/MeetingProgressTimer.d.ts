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
declare const MeetingProgressTimer: React.FC<MeetingProgressTimerOptions>;
export default MeetingProgressTimer;
//# sourceMappingURL=MeetingProgressTimer.d.ts.map