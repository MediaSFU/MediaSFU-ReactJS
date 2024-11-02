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
 * This component renders a customizable timer with options for background color, position, and styling. It can be positioned in any corner of the screen and shows the meeting's progress time.
 *
 * @component
 * @param {MeetingProgressTimerOptions} props - The properties for the MeetingProgressTimer component.
 * @param {string} props.meetingProgressTime - The current progress time of the meeting to be displayed.
 * @param {string} [props.initialBackgroundColor='green'] - The initial background color of the timer badge.
 * @param {string} [props.position='topLeft'] - The corner position of the timer on the screen.
 * @param {React.CSSProperties} [props.textStyle={}] - Additional styles to apply to the timer text.
 * @param {boolean} [props.showTimer=true] - Flag to determine whether the timer should be displayed.
 *
 * @returns {JSX.Element} The rendered MeetingProgressTimer component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MeetingProgressTimer } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MeetingProgressTimer
 *       meetingProgressTime="10:00"
 *       initialBackgroundColor="green"
 *       position="topLeft"
 *       textStyle={{ fontSize: 16 }}
 *       showTimer={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MeetingProgressTimer: React.FC<MeetingProgressTimerOptions>;
export default MeetingProgressTimer;
//# sourceMappingURL=MeetingProgressTimer.d.ts.map