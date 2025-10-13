import React from 'react';

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(' ').trim();
  return filtered.length > 0 ? filtered : undefined;
};

export interface MeetingProgressTimerOptions {
  meetingProgressTime: string;
  initialBackgroundColor?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  textStyle?: React.CSSProperties;
  showTimer?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  badgeProps?: React.HTMLAttributes<HTMLDivElement>;
  textProps?: React.HTMLAttributes<HTMLSpanElement>;
  renderBadge?: (options: {
    defaultBadge: React.ReactNode;
    showTimer: boolean;
  }) => React.ReactNode;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
  }) => React.ReactNode;
}

export type MeetingProgressTimerType = (options: MeetingProgressTimerOptions) => React.JSX.Element;

/**
 * MeetingProgressTimer - A timer badge component for displaying meeting/session duration.
 * 
 * This component provides a visually prominent timer badge that displays the elapsed time of a meeting
 * or session. It offers flexible positioning, styling customization, and render hooks for complete
 * control over the timer's appearance and placement.
 * 
 * **Key Features:**
 * - **Corner Positioning**: Four pre-configured positions (topLeft, topRight, bottomLeft, bottomRight)
 * - **Background Customization**: Configurable background color for the timer badge
 * - **Text Styling**: Full control over text appearance via textStyle prop
 * - **Visibility Control**: Toggle timer visibility with showTimer flag
 * - **Render Hooks**: Custom rendering for badge and container elements
 * - **HTML Attributes**: Granular control over container, badge, and text elements
 * - **Absolute Positioning**: Fixed position overlay that doesn't affect layout flow
 * - **Class Management**: Smart className joining for clean CSS composition
 * - **Responsive Design**: Adapts to content size with padding and border radius
 * - **Time Format Support**: Displays any formatted time string (MM:SS, HH:MM:SS, etc.)
 * - **Z-Index Control**: Positioned above other content for visibility
 * - **Accessible**: Semantic HTML with proper span elements for time display
 * 
 * @component
 * 
 * @param {MeetingProgressTimerOptions} props - Configuration options for MeetingProgressTimer
 * @param {string} props.meetingProgressTime - Formatted time string to display (e.g., "10:30", "01:45:20")
 * @param {string} [props.initialBackgroundColor='green'] - Background color for the timer badge
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} [props.position='topLeft'] - Screen corner position for the timer
 * @param {React.CSSProperties} [props.textStyle={}] - Additional CSS styles for the time text
 * @param {boolean} [props.showTimer=true] - Controls visibility of the timer badge
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for container element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.badgeProps] - HTML attributes for badge element
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.textProps] - HTML attributes for text element
 * @param {(options: {defaultBadge: React.ReactNode; showTimer: boolean}) => React.ReactNode} [props.renderBadge] - Custom render function for badge
 * @param {(options: {defaultContainer: React.ReactNode}) => React.ReactNode} [props.renderContainer] - Custom render function for container
 * 
 * @returns {React.JSX.Element} The rendered meeting progress timer component
 * 
 * @example
 * // Basic usage with auto-incrementing timer
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MeetingProgressTimer } from 'mediasfu-reactjs';
 * 
 * const BasicMeetingTimer = () => {
 *   const [elapsedTime, setElapsedTime] = useState('00:00');
 * 
 *   useEffect(() => {
 *     const startTime = Date.now();
 *     const interval = setInterval(() => {
 *       const elapsed = Math.floor((Date.now() - startTime) / 1000);
 *       const minutes = Math.floor(elapsed / 60);
 *       const seconds = elapsed % 60;
 *       setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
 *     }, 1000);
 *     return () => clearInterval(interval);
 *   }, []);
 * 
 *   return (
 *     <MeetingProgressTimer
 *       meetingProgressTime={elapsedTime}
 *       initialBackgroundColor="#2ecc71"
 *       position="topRight"
 *       showTimer={true}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with dynamic positioning
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MeetingProgressTimer } from 'mediasfu-reactjs';
 * 
 * const CustomStyledTimer = () => {
 *   const [elapsedTime, setElapsedTime] = useState('00:00:00');
 *   const [position, setPosition] = useState<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>('topLeft');
 * 
 *   useEffect(() => {
 *     const startTime = Date.now();
 *     const interval = setInterval(() => {
 *       const elapsed = Math.floor((Date.now() - startTime) / 1000);
 *       const hours = Math.floor(elapsed / 3600);
 *       const minutes = Math.floor((elapsed % 3600) / 60);
 *       const seconds = elapsed % 60;
 *       setElapsedTime(
 *         `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
 *       );
 *     }, 1000);
 *     return () => clearInterval(interval);
 *   }, []);
 * 
 *   return (
 *     <>
 *       <select value={position} onChange={(e) => setPosition(e.target.value as any)}>
 *         <option value="topLeft">Top Left</option>
 *         <option value="topRight">Top Right</option>
 *         <option value="bottomLeft">Bottom Left</option>
 *         <option value="bottomRight">Bottom Right</option>
 *       </select>
 *       <MeetingProgressTimer
 *         meetingProgressTime={elapsedTime}
 *         initialBackgroundColor="#e74c3c"
 *         position={position}
 *         textStyle={{
 *           fontSize: '18px',
 *           fontWeight: 'bold',
 *           fontFamily: 'monospace',
 *           letterSpacing: '1px'
 *         }}
 *         badgeProps={{
 *           style: {
 *             padding: '12px 20px',
 *             borderRadius: '8px',
 *             border: '2px solid #c0392b',
 *             boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
 *           }
 *         }}
 *         showTimer={true}
 *       />
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with custom badge rendering
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MeetingProgressTimer } from 'mediasfu-reactjs';
 * 
 * const AnalyticsMeetingTimer = () => {
 *   const [elapsedTime, setElapsedTime] = useState('00:00');
 *   const [elapsedSeconds, setElapsedSeconds] = useState(0);
 * 
 *   useEffect(() => {
 *     const startTime = Date.now();
 *     const interval = setInterval(() => {
 *       const elapsed = Math.floor((Date.now() - startTime) / 1000);
 *       setElapsedSeconds(elapsed);
 *       const minutes = Math.floor(elapsed / 60);
 *       const seconds = elapsed % 60;
 *       setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
 * 
 *       // Track milestones
 *       if (elapsed % 300 === 0 && elapsed > 0) { // Every 5 minutes
 *         analytics.track('Meeting Milestone', {
 *           duration: elapsed,
 *           formatted: `${minutes}:${seconds}`
 *         });
 *       }
 *     }, 1000);
 *     return () => clearInterval(interval);
 *   }, []);
 * 
 *   return (
 *     <MeetingProgressTimer
 *       meetingProgressTime={elapsedTime}
 *       initialBackgroundColor={elapsedSeconds > 3600 ? '#e67e22' : '#3498db'}
 *       position="bottomRight"
 *       showTimer={true}
 *       renderBadge={({ defaultBadge, showTimer }) => {
 *         useEffect(() => {
 *           analytics.track('Timer Rendered', {
 *             visible: showTimer,
 *             elapsedSeconds
 *           });
 *         }, [showTimer, elapsedSeconds]);
 * 
 *         return (
 *           <div style={{ position: 'relative' }}>
 *             {defaultBadge}
 *             {elapsedSeconds > 3600 && (
 *               <div style={{
 *                 position: 'absolute',
 *                 top: -8,
 *                 right: -8,
 *                 width: '16px',
 *                 height: '16px',
 *                 borderRadius: '50%',
 *                 backgroundColor: '#e74c3c',
 *                 border: '2px solid #fff',
 *                 animation: 'pulse 2s infinite'
 *               }} />
 *             )}
 *           </div>
 *         );
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, MeetingProgressTimer } from 'mediasfu-reactjs';
 * 
 * const CustomTimerComponent = (props) => (
 *   <MeetingProgressTimer
 *     {...props}
 *     renderContainer={({ defaultContainer }) => (
 *       <div className="custom-timer-wrapper">
 *         <div className="timer-label">Session Duration</div>
 *         {defaultContainer}
 *         <div className="timer-actions">
 *           <button 
 *             onClick={() => console.log('Pause session')}
 *             style={{
 *               fontSize: '10px',
 *               padding: '2px 6px',
 *               marginTop: '4px'
 *             }}
 *           >
 *             ⏸️
 *           </button>
 *         </div>
 *       </div>
 *     )}
 *     textStyle={{
 *       fontSize: '16px',
 *       fontWeight: '600',
 *       color: '#fff'
 *     }}
 *   />
 * );
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
 *         MeetingProgressTimer: CustomTimerComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const MeetingProgressTimer: React.FC<MeetingProgressTimerOptions> = ({
  meetingProgressTime,
  initialBackgroundColor = 'green',
  position = 'topLeft',
  textStyle = {},
  showTimer = true,
  containerProps,
  badgeProps,
  textProps,
  renderBadge,
  renderContainer,
}) => {
  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = joinClassNames(
    'mediasfu-meeting-progress__container',
    containerClassName
  );

  const resolvedPosition = positions[position] ?? positions.topLeft;

  const containerStyle: React.CSSProperties = {
    ...styles.badgeContainer,
    ...resolvedPosition,
    ...containerStyleOverrides,
  };

  const {
    className: badgeClassName,
    style: badgeStyleOverrides,
    ...restBadgeProps
  } = badgeProps ?? {};

  const badgeClassNames = joinClassNames(
    'mediasfu-meeting-progress__badge',
    badgeClassName
  );

  const badgeStyle: React.CSSProperties = {
    ...styles.progressTimer,
    backgroundColor: initialBackgroundColor,
    display: showTimer ? 'block' : 'none',
    ...badgeStyleOverrides,
  };

  const {
    className: textClassName,
    style: textStyleOverrides,
    ...restTextProps
  } = textProps ?? {};

  const textClassNames = joinClassNames(
    'mediasfu-meeting-progress__text',
    textClassName
  );

  const textStyleCombined: React.CSSProperties = {
    ...styles.progressTimerText,
    ...textStyle,
    ...textStyleOverrides,
  };

  const defaultBadge = (
    <div
      className={badgeClassNames}
      style={badgeStyle}
      {...restBadgeProps}
    >
      <span
        className={textClassNames}
        style={textStyleCombined}
        {...restTextProps}
      >
        {meetingProgressTime}
      </span>
    </div>
  );

  const badgeNode = renderBadge
    ? renderBadge({ defaultBadge, showTimer })
    : defaultBadge;

  const defaultContainer = (
    <div
      className={containerClassNames}
      style={containerStyle}
      {...restContainerProps}
    >
      {badgeNode}
    </div>
  );

  const containerNode = renderContainer
    ? renderContainer({ defaultContainer })
    : defaultContainer;

  return <>{containerNode}</>;
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
