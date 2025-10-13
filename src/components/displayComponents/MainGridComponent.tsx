import React from 'react';
import MeetingProgressTimer, { MeetingProgressTimerOptions } from './MeetingProgressTimer';

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
  timerComponent?: React.ComponentType<MeetingProgressTimerOptions>;
}

export type MainGridComponentType = (options: MainGridComponentOptions) => React.JSX.Element;

/**
 * MainGridComponent - A container component for the main content grid with integrated timer display.
 * 
 * This component provides a structured container for main grid content with built-in meeting progress
 * timer integration. It offers flexible sizing, visibility control, and timer customization for
 * displaying video grids or other main content areas during sessions.
 * 
 * **Key Features:**
 * - **Fixed Dimensions**: Explicit width and height control for consistent grid sizing
 * - **Background Customization**: Configurable background color for grid container
 * - **Timer Integration**: Built-in MeetingProgressTimer component for session tracking
 * - **Timer Customization**: Custom timer component support via timerComponent prop
 * - **Visibility Control**: Toggle grid visibility with showAspect flag
 * - **Timer Styling**: Separate background color control for timer display
 * - **Border Styling**: Fixed 4px border for clear grid boundaries
 * - **Flexbox Layout**: Row-based flex layout with center alignment
 * - **Children Support**: Renders any child components within grid container
 * - **Component Injection**: Replace default timer with custom timer component
 * - **Time Display**: Formatted time string display for meeting duration
 * - **Responsive Timer**: Timer visibility controlled independently from grid
 * 
 * @component
 * 
 * @param {MainGridComponentOptions} props - Configuration options for MainGridComponent
 * @param {React.ReactNode} props.children - Child components rendered inside the main grid
 * @param {string} props.backgroundColor - Background color for the grid container
 * @param {number} props.mainSize - Size parameter for grid scaling (passed to children)
 * @param {number} props.height - Height in pixels for the grid container
 * @param {number} props.width - Width in pixels for the grid container
 * @param {boolean} [props.showAspect=true] - Controls visibility of the entire grid container
 * @param {string} [props.timeBackgroundColor='transparent'] - Background color for timer display
 * @param {boolean} [props.showTimer=true] - Controls visibility of meeting progress timer
 * @param {string} props.meetingProgressTime - Formatted time string (e.g., "10:30" or "01:45:20")
 * @param {React.ComponentType<MeetingProgressTimerOptions>} [props.timerComponent=MeetingProgressTimer] - Custom timer component to replace default
 * 
 * @returns {React.JSX.Element} The rendered main grid container with timer and children
 * 
 * @example
 * // Basic usage for video grid display
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MainGridComponent } from 'mediasfu-reactjs';
 * 
 * const VideoGridDisplay = () => {
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
 *     <MainGridComponent
 *       backgroundColor="#1a1a1a"
 *       mainSize={100}
 *       height={600}
 *       width={800}
 *       showAspect={true}
 *       showTimer={true}
 *       meetingProgressTime={meetingTime}
 *     >
 *       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
 *         <video src="/participant1.mp4" style={{ width: '100%', height: 'auto' }} />
 *         <video src="/participant2.mp4" style={{ width: '100%', height: 'auto' }} />
 *       </div>
 *     </MainGridComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with themed timer
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainGridComponent } from 'mediasfu-reactjs';
 * 
 * const ThemedGridDisplay = () => {
 *   const [meetingTime, setMeetingTime] = useState('00:15:30');
 * 
 *   return (
 *     <MainGridComponent
 *       backgroundColor="#2c3e50"
 *       mainSize={100}
 *       height={720}
 *       width={1280}
 *       showAspect={true}
 *       timeBackgroundColor="rgba(52, 152, 219, 0.8)"
 *       showTimer={true}
 *       meetingProgressTime={meetingTime}
 *     >
 *       <div style={{ 
 *         padding: '20px',
 *         color: '#ecf0f1',
 *         display: 'flex',
 *         flexDirection: 'column',
 *         gap: '15px'
 *       }}>
 *         <h2>Conference Room A</h2>
 *         <div style={{ 
 *           display: 'grid',
 *           gridTemplateColumns: 'repeat(3, 1fr)',
 *           gap: '10px'
 *         }}>
 *           <div style={{ aspectRatio: '16/9', backgroundColor: '#34495e' }}>Video 1</div>
 *           <div style={{ aspectRatio: '16/9', backgroundColor: '#34495e' }}>Video 2</div>
 *           <div style={{ aspectRatio: '16/9', backgroundColor: '#34495e' }}>Video 3</div>
 *         </div>
 *       </div>
 *     </MainGridComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with custom timer
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MainGridComponent } from 'mediasfu-reactjs';
 * 
 * const CustomTimer = ({ meetingProgressTime, initialBackgroundColor, showTimer }) => {
 *   useEffect(() => {
 *     analytics.track('Timer Display Updated', {
 *       time: meetingProgressTime,
 *       visible: showTimer
 *     });
 *   }, [meetingProgressTime, showTimer]);
 * 
 *   return showTimer ? (
 *     <div style={{ 
 *       position: 'absolute',
 *       top: '10px',
 *       right: '10px',
 *       padding: '8px 16px',
 *       backgroundColor: initialBackgroundColor,
 *       borderRadius: '4px',
 *       fontSize: '14px',
 *       fontWeight: 'bold'
 *     }}>
 *       🕐 {meetingProgressTime}
 *     </div>
 *   ) : null;
 * };
 * 
 * const AnalyticsGridDisplay = () => {
 *   const [meetingTime, setMeetingTime] = useState('00:00');
 *   const [participantCount, setParticipantCount] = useState(4);
 * 
 *   useEffect(() => {
 *     analytics.track('Grid Displayed', {
 *       participantCount,
 *       dimensions: { width: 1024, height: 768 }
 *     });
 *   }, [participantCount]);
 * 
 *   return (
 *     <MainGridComponent
 *       backgroundColor="#000"
 *       mainSize={100}
 *       height={768}
 *       width={1024}
 *       showAspect={true}
 *       timeBackgroundColor="rgba(46, 204, 113, 0.9)"
 *       showTimer={true}
 *       meetingProgressTime={meetingTime}
 *       timerComponent={CustomTimer}
 *     >
 *       <div>Grid content with {participantCount} participants</div>
 *     </MainGridComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, MainGridComponent } from 'mediasfu-reactjs';
 * 
 * const CustomMainGridComponent = (props) => {
 *   const CustomTimerWrapper = (timerProps) => (
 *     <div className="custom-timer-wrapper">
 *       <div className="timer-label">Session Duration</div>
 *       <div className="timer-value">{timerProps.meetingProgressTime}</div>
 *       <div className="timer-indicator" style={{
 *         width: '100%',
 *         height: '3px',
 *         backgroundColor: '#2ecc71',
 *         animation: 'pulse 2s infinite'
 *       }} />
 *     </div>
 *   );
 * 
 *   return (
 *     <div className="custom-main-grid-container">
 *       <MainGridComponent
 *         {...props}
 *         backgroundColor="#0f0f0f"
 *         timeBackgroundColor="rgba(255, 255, 255, 0.1)"
 *         timerComponent={CustomTimerWrapper}
 *       />
 *       <div className="grid-overlay">
 *         <span className="participant-count">
 *           {React.Children.count(props.children)} active
 *         </span>
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
 *         MainGridComponent: CustomMainGridComponent
 *       }}
 *     />
 *   );
 * };
 * ```
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
  timerComponent: TimerComponent = MeetingProgressTimer,
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
      <TimerComponent
        meetingProgressTime={meetingProgressTime}
        initialBackgroundColor={timeBackgroundColor}
        showTimer={showTimer}
      />
      {children}
    </div>
  );
};

export default MainGridComponent;
