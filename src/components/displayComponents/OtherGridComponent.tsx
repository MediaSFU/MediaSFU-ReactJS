import React from "react";
import MeetingProgressTimer, { MeetingProgressTimerOptions } from "./MeetingProgressTimer";

export interface OtherGridComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  width: number;
  height: number;
  showAspect?: boolean;
  timeBackgroundColor?: string;
  showTimer: boolean;
  meetingProgressTime: string;
  timerComponent?: React.ComponentType<MeetingProgressTimerOptions>;
}

export type OtherGridComponentType = React.FC<OtherGridComponentOptions>;

/**
 * OtherGridComponent - A secondary grid container for additional content with integrated timer.
 * 
 * This component provides a structured container for secondary grid content (complementing MainGridComponent)
 * with built-in meeting progress timer integration. It offers fixed dimensions, visibility control, and
 * timer customization for displaying additional participant videos or content grids.
 * 
 * **Key Features:**
 * - **Fixed Dimensions**: Explicit width and height control for consistent grid sizing
 * - **Background Customization**: Configurable background color for grid container
 * - **Timer Integration**: Built-in MeetingProgressTimer component for session tracking
 * - **Timer Customization**: Custom timer component support via timerComponent prop
 * - **Visibility Control**: Toggle grid visibility with showAspect flag
 * - **Timer Styling**: Separate background color control for timer display
 * - **Border Styling**: Fixed 2px border for clear grid boundaries
 * - **Overflow Hidden**: Prevents content from exceeding grid boundaries
 * - **Children Support**: Renders any child components within grid container
 * - **Component Injection**: Replace default timer with custom timer component
 * - **Time Display**: Formatted time string display for meeting duration
 * - **Responsive Timer**: Timer visibility controlled independently from grid
 * 
 * @component
 * 
 * @param {OtherGridComponentOptions} props - Configuration options for OtherGridComponent
 * @param {string} props.backgroundColor - Background color for the grid container
 * @param {React.ReactNode} props.children - Child components rendered inside the grid
 * @param {number} props.width - Width in pixels for the grid container
 * @param {number} props.height - Height in pixels for the grid container
 * @param {boolean} [props.showAspect=true] - Controls visibility of the entire grid container
 * @param {string} [props.timeBackgroundColor] - Background color for timer display
 * @param {boolean} props.showTimer - Controls visibility of meeting progress timer
 * @param {string} props.meetingProgressTime - Formatted time string (e.g., "10:30" or "01:45:20")
 * @param {React.ComponentType<MeetingProgressTimerOptions>} [props.timerComponent=MeetingProgressTimer] - Custom timer component to replace default
 * 
 * @returns {React.JSX.Element} The rendered secondary grid container with timer and children
 * 
 * @example
 * // Basic usage for secondary participant grid
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { OtherGridComponent } from 'mediasfu-reactjs';
 * 
 * const SecondaryParticipantGrid = () => {
 *   const [meetingTime, setMeetingTime] = useState('00:00');
 * 
 *   useEffect(() => {
 *     const startTime = Date.now();
 *     const interval = setInterval(() => {
 *       const elapsed = Math.floor((Date.now() - startTime) / 1000);
 *       const minutes = Math.floor(elapsed / 60);
 *       const seconds = elapsed % 60;
 *       setMeetingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
 *     }, 1000);
 *     return () => clearInterval(interval);
 *   }, []);
 * 
 *   return (
 *     <OtherGridComponent
 *       backgroundColor="#2a2a2a"
 *       width={400}
 *       height={300}
 *       showAspect={true}
 *       showTimer={true}
 *       meetingProgressTime={meetingTime}
 *     >
 *       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', padding: '5px' }}>
 *         <video src="/participant3.mp4" style={{ width: '100%', height: 'auto' }} />
 *         <video src="/participant4.mp4" style={{ width: '100%', height: 'auto' }} />
 *       </div>
 *     </OtherGridComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with conditional visibility
 * ```tsx
 * import React, { useState } from 'react';
 * import { OtherGridComponent } from 'mediasfu-reactjs';
 * 
 * const ConditionalSecondaryGrid = () => {
 *   const [showGrid, setShowGrid] = useState(true);
 *   const [meetingTime, setMeetingTime] = useState('00:05:30');
 * 
 *   return (
 *     <>
 *       <button onClick={() => setShowGrid(!showGrid)}>
 *         {showGrid ? 'Hide' : 'Show'} Secondary Grid
 *       </button>
 *       <OtherGridComponent
 *         backgroundColor="#34495e"
 *         width={600}
 *         height={400}
 *         showAspect={showGrid}
 *         timeBackgroundColor="rgba(231, 76, 60, 0.8)"
 *         showTimer={true}
 *         meetingProgressTime={meetingTime}
 *       >
 *         <div style={{ 
 *           padding: '15px',
 *           color: '#ecf0f1',
 *           display: 'grid',
 *           gridTemplateColumns: 'repeat(3, 1fr)',
 *           gap: '10px'
 *         }}>
 *           <div style={{ backgroundColor: '#7f8c8d', padding: '20px' }}>Participant 1</div>
 *           <div style={{ backgroundColor: '#7f8c8d', padding: '20px' }}>Participant 2</div>
 *           <div style={{ backgroundColor: '#7f8c8d', padding: '20px' }}>Participant 3</div>
 *         </div>
 *       </OtherGridComponent>
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with custom timer
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { OtherGridComponent } from 'mediasfu-reactjs';
 * 
 * const AnalyticsTimer = ({ meetingProgressTime, initialBackgroundColor, showTimer }) => {
 *   useEffect(() => {
 *     analytics.track('Other Grid Timer Updated', {
 *       time: meetingProgressTime,
 *       visible: showTimer
 *     });
 *   }, [meetingProgressTime, showTimer]);
 * 
 *   return showTimer ? (
 *     <div style={{
 *       position: 'absolute',
 *       top: '5px',
 *       left: '5px',
 *       padding: '5px 10px',
 *       backgroundColor: initialBackgroundColor || 'rgba(0,0,0,0.7)',
 *       color: '#fff',
 *       fontSize: '12px',
 *       borderRadius: '3px'
 *     }}>
 *       ⏱️ {meetingProgressTime}
 *     </div>
 *   ) : null;
 * };
 * 
 * const AnalyticsSecondaryGrid = () => {
 *   const [meetingTime, setMeetingTime] = useState('00:00');
 *   const [participantCount, setParticipantCount] = useState(6);
 * 
 *   useEffect(() => {
 *     analytics.track('Secondary Grid Rendered', {
 *       participantCount,
 *       dimensions: { width: 800, height: 600 }
 *     });
 *   }, [participantCount]);
 * 
 *   return (
 *     <OtherGridComponent
 *       backgroundColor="#1a1a1a"
 *       width={800}
 *       height={600}
 *       showAspect={true}
 *       timeBackgroundColor="rgba(52, 152, 219, 0.9)"
 *       showTimer={true}
 *       meetingProgressTime={meetingTime}
 *       timerComponent={AnalyticsTimer}
 *     >
 *       <div>Grid with {participantCount} participants</div>
 *     </OtherGridComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, OtherGridComponent } from 'mediasfu-reactjs';
 * 
 * const CustomOtherGridComponent = (props) => {
 *   const EnhancedTimer = (timerProps) => (
 *     <div style={{
 *       display: 'flex',
 *       alignItems: 'center',
 *       gap: '10px',
 *       position: 'absolute',
 *       top: '10px',
 *       right: '10px',
 *       backgroundColor: 'rgba(0,0,0,0.8)',
 *       padding: '8px 12px',
 *       borderRadius: '6px'
 *     }}>
 *       <span style={{ fontSize: '12px', color: '#95a5a6' }}>Session</span>
 *       <span style={{ fontSize: '14px', color: '#2ecc71', fontWeight: 'bold' }}>
 *         {timerProps.meetingProgressTime}
 *       </span>
 *     </div>
 *   );
 * 
 *   return (
 *     <div style={{ position: 'relative' }}>
 *       <OtherGridComponent
 *         {...props}
 *         backgroundColor="#0a0a0a"
 *         timerComponent={EnhancedTimer}
 *       />
 *       <div style={{
 *         position: 'absolute',
 *         bottom: '10px',
 *         left: '10px',
 *         color: '#fff',
 *         fontSize: '12px',
 *         backgroundColor: 'rgba(0,0,0,0.7)',
 *         padding: '5px 10px',
 *         borderRadius: '4px'
 *       }}>
 *         Secondary Grid
 *       </div>
 *     </div>
 *   );
 * };
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         OtherGridComponent: CustomOtherGridComponent
 *       }}
 *     />
 *   );
 * };
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
  timerComponent: TimerComponent = MeetingProgressTimer,
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
        <TimerComponent
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
