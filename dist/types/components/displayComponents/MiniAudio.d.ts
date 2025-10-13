import React from "react";
export interface MiniAudioOptions {
    visible?: boolean;
    customStyle?: React.CSSProperties;
    name: string;
    showWaveform?: boolean;
    overlayPosition?: string;
    barColor?: string;
    textColor?: string;
    nameTextStyling?: React.CSSProperties;
    imageSource: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    draggableContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    cardProps?: React.HTMLAttributes<HTMLDivElement>;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    barProps?: React.HTMLAttributes<HTMLDivElement>;
    nameContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    nameTextProps?: React.HTMLAttributes<HTMLSpanElement>;
    imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
    renderWrapper?: (options: {
        defaultWrapper: React.ReactNode;
        isVisible: boolean;
    }) => React.ReactNode;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        isDragging: boolean;
        position: {
            x: number;
            y: number;
        };
    }) => React.ReactNode;
    renderCard?: (options: {
        defaultCard: React.ReactNode;
        hasImage: boolean;
    }) => React.ReactNode;
    renderWaveform?: (options: {
        defaultWaveform: React.ReactNode;
        showWaveform: boolean;
        animations: number[];
    }) => React.ReactNode;
}
export type MiniAudioType = (options: MiniAudioOptions) => React.JSX.Element;
/**
 * MiniAudio - A compact, draggable audio participant card with animated waveform visualization.
 *
 * This component provides a feature-rich mini audio card for displaying audio participants with
 * visual feedback. It includes animated waveform visualization, drag-and-drop positioning, and
 * extensive customization options for styling and layout.
 *
 * **Key Features:**
 * - **Animated Waveform**: Nine-bar waveform animation with configurable colors and timing
 * - **Drag-and-Drop**: Fully draggable with mouse interaction for repositioning
 * - **Visibility Control**: Toggle visibility without unmounting component
 * - **Image Display**: Participant avatar/image with rounded or square styling
 * - **Overlay Positioning**: Pre-configured overlay positions via getOverlayPosition utility
 * - **Custom Styling**: Comprehensive style customization for all elements
 * - **Name Display**: Participant name with customizable text styling
 * - **Waveform Toggle**: Show/hide waveform animation based on speaking state
 * - **Color Customization**: Configurable bar and text colors
 * - **HTML Attributes**: Granular control over wrapper, container, card, and element attributes
 * - **Render Hooks**: Complete override capability for wrapper, container, card, and waveform
 * - **Animation Management**: Automatic cleanup of intervals and timeouts
 * - **SSR Compatible**: Safe handling of browser-only APIs
 *
 * @component
 *
 * @param {MiniAudioOptions} props - Configuration options for MiniAudio
 * @param {boolean} [props.visible=true] - Controls visibility of the mini audio card
 * @param {React.CSSProperties} [props.customStyle] - Custom inline styles for wrapper element
 * @param {string} props.name - Participant name displayed on the card
 * @param {boolean} [props.showWaveform=false] - Controls visibility of animated waveform (typically based on speaking state)
 * @param {string} [props.overlayPosition] - Pre-configured overlay position ("topLeft", "topRight", "bottomLeft", "bottomRight", etc.)
 * @param {string} [props.barColor="red"] - Color for waveform bars
 * @param {string} [props.textColor="white"] - Color for participant name text
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for name text element
 * @param {string} props.imageSource - URL/path to participant avatar image
 * @param {boolean} [props.roundedImage=false] - Controls whether image has rounded corners
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for image element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.wrapperProps] - HTML attributes for outermost wrapper
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.draggableContainerProps] - HTML attributes for draggable container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.cardProps] - HTML attributes for card element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.overlayProps] - HTML attributes for overlay container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.waveformContainerProps] - HTML attributes for waveform container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.barProps] - HTML attributes for individual waveform bars
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.nameContainerProps] - HTML attributes for name container
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.nameTextProps] - HTML attributes for name text
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} [props.imageProps] - HTML attributes for image element
 * @param {(options: {defaultWrapper: React.ReactNode; isVisible: boolean}) => React.ReactNode} [props.renderWrapper] - Custom render function for wrapper
 * @param {(options: {defaultContainer: React.ReactNode; isDragging: boolean; position: {x: number; y: number}}) => React.ReactNode} [props.renderContainer] - Custom render function for draggable container
 * @param {(options: {defaultCard: React.ReactNode; hasImage: boolean}) => React.ReactNode} [props.renderCard] - Custom render function for card
 * @param {(options: {defaultWaveform: React.ReactNode; showWaveform: boolean; animations: number[]}) => React.ReactNode} [props.renderWaveform] - Custom render function for waveform
 *
 * @returns {React.JSX.Element} The rendered mini audio component with waveform and drag support
 *
 * @example
 * // Basic usage for audio participant
 * ```tsx
 * import React, { useState } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 *
 * const AudioParticipantCard = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 *
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Alice Johnson"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/alice.jpg"
 *       barColor="#2ecc71"
 *       textColor="#ffffff"
 *       overlayPosition="topRight"
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled with rounded image
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 *
 * const CustomStyledMiniAudio = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 *
 *   useEffect(() => {
 *     // Simulate speaking detection
 *     const interval = setInterval(() => {
 *       setIsSpeaking(prev => !prev);
 *     }, 3000);
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Bob Smith"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/bob.jpg"
 *       roundedImage={true}
 *       barColor={isSpeaking ? '#e74c3c' : '#95a5a6'}
 *       textColor="#ecf0f1"
 *       overlayPosition="bottomLeft"
 *       customStyle={{
 *         border: '2px solid #3498db',
 *         borderRadius: '12px',
 *         boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
 *       }}
 *       nameTextStyling={{
 *         fontSize: '14px',
 *         fontWeight: 'bold',
 *         textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
 *       }}
 *       imageStyle={{
 *         borderRadius: '50%',
 *         border: '3px solid #2ecc71'
 *       }}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking with drag monitoring
 * ```tsx
 * import React, { useState } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 *
 * const AnalyticsMiniAudio = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 *   const [dragCount, setDragCount] = useState(0);
 *
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Charlie Davis"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/charlie.jpg"
 *       barColor="#f39c12"
 *       renderContainer={({ defaultContainer, isDragging, position }) => {
 *         React.useEffect(() => {
 *           if (isDragging) {
 *             setDragCount(prev => prev + 1);
 *             analytics.track('Mini Audio Dragged', {
 *               participantName: 'Charlie Davis',
 *               position,
 *               totalDrags: dragCount
 *             });
 *           }
 *         }, [isDragging]);
 *
 *         return (
 *           <div style={{ position: 'relative' }}>
 *             {defaultContainer}
 *             {isDragging && (
 *               <div style={{
 *                 position: 'absolute',
 *                 top: -20,
 *                 left: 0,
 *                 fontSize: '12px',
 *                 color: '#fff',
 *                 backgroundColor: 'rgba(0,0,0,0.7)',
 *                 padding: '2px 6px',
 *                 borderRadius: '3px'
 *               }}>
 *                 Dragging...
 *               </div>
 *             )}
 *           </div>
 *         );
 *       }}
 *       renderWaveform={({ defaultWaveform, showWaveform, animations }) => {
 *         React.useEffect(() => {
 *           if (showWaveform) {
 *             analytics.track('Waveform Displayed', {
 *               participantName: 'Charlie Davis',
 *               activeAnimations: animations.filter(a => a > 0).length
 *             });
 *           }
 *         }, [showWaveform, animations]);
 *
 *         return defaultWaveform;
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
 * import { MediasfuGeneric, MiniAudio } from 'mediasfu-reactjs';
 *
 * const CustomMiniAudioComponent = (props) => (
 *   <MiniAudio
 *     {...props}
 *     roundedImage={true}
 *     renderCard={({ defaultCard, hasImage }) => (
 *       <div className="custom-mini-audio-card">
 *         <div className="card-header">
 *           <span className="status-indicator" style={{
 *             width: '8px',
 *             height: '8px',
 *             borderRadius: '50%',
 *             backgroundColor: props.showWaveform ? '#2ecc71' : '#95a5a6',
 *             display: 'inline-block',
 *             marginRight: '8px'
 *           }} />
 *           <span className="participant-status">
 *             {props.showWaveform ? 'Speaking' : 'Listening'}
 *           </span>
 *         </div>
 *         <div className="card-content">
 *           {defaultCard}
 *         </div>
 *         {hasImage && (
 *           <div className="card-footer">
 *             <span style={{ fontSize: '12px', color: '#95a5a6' }}>
 *               🎤 Audio Only
 *             </span>
 *           </div>
 *         )}
 *       </div>
 *     )}
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
 *         MiniAudio: CustomMiniAudioComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */
declare const MiniAudio: React.FC<MiniAudioOptions>;
export default MiniAudio;
//# sourceMappingURL=MiniAudio.d.ts.map