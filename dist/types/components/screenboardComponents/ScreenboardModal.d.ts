import React from "react";
import { Producer } from "mediasoup-client/lib/types";
import { ConnectSendTransportScreenType, CreateSendTransportType, DisconnectSendTransportScreenType, PrepopulateUserMediaType, StopShareScreenType, SleepType, ConnectSendTransportScreenParameters, CreateSendTransportParameters, DisconnectSendTransportScreenParameters, PrepopulateUserMediaParameters, StopShareScreenParameters } from "../../@types/types";
export interface ScreenboardModalParameters extends ConnectSendTransportScreenParameters, CreateSendTransportParameters, DisconnectSendTransportScreenParameters, PrepopulateUserMediaParameters, StopShareScreenParameters {
    localStreamScreen: MediaStream | null;
    shared: boolean;
    hostLabel: string;
    annotateScreenStream: boolean;
    processedScreenStream: MediaStream | null;
    mainScreenCanvas: HTMLCanvasElement | null;
    canvasScreenboard: HTMLCanvasElement | null;
    transportCreated: boolean;
    screenProducer: Producer | null;
    updateLocalStreamScreen: (stream: MediaStream | null) => void;
    updateProcessedScreenStream: (stream: MediaStream | null) => void;
    updateMainScreenCanvas: (canvas: HTMLCanvasElement | null) => void;
    sleep: SleepType;
    createSendTransport: CreateSendTransportType;
    disconnectSendTransportScreen: DisconnectSendTransportScreenType;
    connectSendTransportScreen: ConnectSendTransportScreenType;
    stopShareScreen: StopShareScreenType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    getUpdatedAllParams: () => ScreenboardModalParameters;
    [key: string]: any;
}
export interface ScreenboardModalOptions {
    parameters: ScreenboardModalParameters;
    isVisible: boolean;
    onClose: () => void;
    position?: string;
    backgroundColor?: string;
}
export type ScreenboardModalType = (options: ScreenboardModalOptions) => React.JSX.Element;
/**
 * ScreenboardModal - A modal component for managing screen annotation and drawing overlays.
 *
 * This component provides an interactive interface for controlling screen annotation features during
 * screen sharing sessions. It manages the annotation stream lifecycle, canvas handling, transport
 * creation, and synchronization with the screen sharing infrastructure.
 *
 * **Key Features:**
 * - **Annotation Toggle**: Enable/disable drawing annotations on shared screen with real-time updates
 * - **Stream Management**: Handles local screen stream, processed stream, and annotation canvas streams
 * - **Canvas Integration**: Manages mainScreenCanvas and canvasScreenboard for annotation rendering
 * - **Transport Lifecycle**: Creates, connects, and disconnects WebRTC transport for annotation streams
 * - **Screen Producer Control**: Manages screen producer for annotation stream broadcasting
 * - **Async Operations**: Proper sleep/delay handling for stream transitions
 * - **User Media Sync**: Prepopulates user media when annotation state changes
 * - **Host Indicators**: Displays host label for session context
 * - **Shared State Awareness**: Tracks shared/unshared states for proper annotation behavior
 * - **Modal Controls**: Close button with automatic canvas cleanup and transport disconnection
 * - **Flexible Positioning**: Configurable modal position (topRight, topLeft, bottomRight, bottomLeft)
 * - **Responsive Design**: Auto-sizing based on content with overlay behavior
 *
 * @component
 *
 * @param {ScreenboardModalOptions} props - Configuration options for ScreenboardModal
 * @param {ScreenboardModalParameters} props.parameters - Comprehensive parameters object containing:
 *   - **Stream State**: localStreamScreen, processedScreenStream
 *   - **Canvas State**: mainScreenCanvas, canvasScreenboard
 *   - **Session State**: shared, hostLabel, annotateScreenStream, transportCreated, screenProducer
 *   - **Update Functions**: updateLocalStreamScreen, updateProcessedScreenStream, updateMainScreenCanvas
 *   - **MediaSFU Functions**: sleep, createSendTransport, disconnectSendTransportScreen, connectSendTransportScreen, stopShareScreen, prepopulateUserMedia
 *   - **Context**: getUpdatedAllParams (returns current state)
 * @param {boolean} props.isVisible - Controls modal visibility
 * @param {() => void} props.onClose - Callback function invoked when modal is closed
 * @param {string} [props.position="topRight"] - Modal screen position (topRight, topLeft, bottomRight, bottomLeft)
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color for modal content
 *
 * @returns {React.JSX.Element} The rendered ScreenboardModal component
 *
 * @example
 * // Basic usage for screen annotation
 * ```tsx
 * import React, { useState } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 *
 * const BasicScreenAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const [annotateEnabled, setAnnotateEnabled] = useState(false);
 *
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'John (Host)',
 *     annotateScreenStream: annotateEnabled,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: null,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => console.log('Local stream updated'),
 *     updateProcessedScreenStream: (stream) => console.log('Processed stream updated'),
 *     updateMainScreenCanvas: (canvas) => console.log('Canvas updated'),
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => console.log('Transport created'),
 *     disconnectSendTransportScreen: async (options) => console.log('Transport disconnected'),
 *     connectSendTransportScreen: async (options) => console.log('Transport connected'),
 *     stopShareScreen: async (options) => console.log('Screen share stopped'),
 *     prepopulateUserMedia: async (options) => console.log('User media prepopulated'),
 *     getUpdatedAllParams: () => parameters
 *   };
 *
 *   return (
 *     <ScreenboardModal
 *       parameters={parameters}
 *       isVisible={showModal}
 *       onClose={() => setShowModal(false)}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled with position control
 * ```tsx
 * import React, { useState, useRef } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 *
 * const CustomStyledAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   const handleAnnotationToggle = async () => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     // Initialize canvas for annotation
 *     const ctx = canvas.getContext('2d');
 *     if (ctx) {
 *       ctx.strokeStyle = '#ff0000';
 *       ctx.lineWidth = 3;
 *     }
 *   };
 *
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'Presenter',
 *     annotateScreenStream: false,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: canvasRef.current,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => {},
 *     updateProcessedScreenStream: (stream) => {},
 *     updateMainScreenCanvas: (canvas) => {},
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => {},
 *     disconnectSendTransportScreen: async (options) => {},
 *     connectSendTransportScreen: async (options) => {},
 *     stopShareScreen: async (options) => {},
 *     prepopulateUserMedia: async (options) => {},
 *     getUpdatedAllParams: () => parameters
 *   };
 *
 *   return (
 *     <>
 *       <canvas ref={canvasRef} style={{ display: 'none' }} />
 *       <ScreenboardModal
 *         parameters={parameters}
 *         isVisible={showModal}
 *         onClose={() => setShowModal(false)}
 *         position="bottomLeft"
 *         backgroundColor="#34495e"
 *       />
 *     </>
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking for annotation usage
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 *
 * const AnalyticsScreenAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const [annotateEnabled, setAnnotateEnabled] = useState(false);
 *
 *   useEffect(() => {
 *     if (annotateEnabled) {
 *       analytics.track('Screen Annotation Enabled', {
 *         timestamp: new Date(),
 *         hostLabel: 'Presenter'
 *       });
 *     } else {
 *       analytics.track('Screen Annotation Disabled');
 *     }
 *   }, [annotateEnabled]);
 *
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'Presenter',
 *     annotateScreenStream: annotateEnabled,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: null,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => {
 *       analytics.track('Local Stream Updated', { hasStream: !!stream });
 *     },
 *     updateProcessedScreenStream: (stream) => {
 *       analytics.track('Processed Stream Updated', { hasStream: !!stream });
 *     },
 *     updateMainScreenCanvas: (canvas) => {
 *       analytics.track('Canvas Updated', { hasCanvas: !!canvas });
 *     },
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => {},
 *     disconnectSendTransportScreen: async (options) => {},
 *     connectSendTransportScreen: async (options) => {},
 *     stopShareScreen: async (options) => {},
 *     prepopulateUserMedia: async (options) => {},
 *     getUpdatedAllParams: () => parameters
 *   };
 *
 *   return (
 *     <ScreenboardModal
 *       parameters={parameters}
 *       isVisible={showModal}
 *       onClose={() => {
 *         analytics.track('Screenboard Modal Closed');
 *         setShowModal(false);
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
 * import { MediasfuGeneric, ScreenboardModal } from 'mediasfu-reactjs';
 *
 * const CustomScreenboardComponent = (props) => {
 *   const [annotationColor, setAnnotationColor] = useState('#ff0000');
 *
 *   return (
 *     <div className="custom-screenboard-wrapper">
 *       <div className="annotation-controls">
 *         <label>Annotation Color:</label>
 *         <input
 *           type="color"
 *           value={annotationColor}
 *           onChange={(e) => setAnnotationColor(e.target.value)}
 *         />
 *         <div className="annotation-status">
 *           {props.parameters.annotateScreenStream ? '🎨 Drawing Active' : '⏸️ Drawing Paused'}
 *         </div>
 *       </div>
 *       <ScreenboardModal
 *         {...props}
 *         position="topLeft"
 *         backgroundColor={annotationColor + '33'} // Add transparency
 *       />
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
 *         ScreenboardModal: CustomScreenboardComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */
declare const ScreenboardModal: React.FC<ScreenboardModalOptions>;
export default ScreenboardModal;
//# sourceMappingURL=ScreenboardModal.d.ts.map