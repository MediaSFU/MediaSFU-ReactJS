import React from 'react';
import './Whiteboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CaptureCanvasStreamParameters, CaptureCanvasStreamType, OnScreenChangesParameters, OnScreenChangesType, Participant, ShowAlert, WhiteboardUser } from '../../@types/types';
import { Socket } from 'socket.io-client';
export interface Shape {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    text?: string;
    color?: string;
    font?: string;
    fontSize?: number;
    thickness?: number;
    lineType?: string;
    points?: Array<{
        x: number;
        y: number;
    }>;
    img?: HTMLImageElement;
    src?: string;
}
export interface WhiteboardParameters extends OnScreenChangesParameters, CaptureCanvasStreamParameters {
    socket: Socket;
    showAlert?: ShowAlert;
    islevel: string;
    roomName: string;
    shapes: Shape[];
    useImageBackground: boolean;
    redoStack: Shape[];
    undoStack: string[];
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
    whiteboardUsers: WhiteboardUser[];
    participants: Participant[];
    participantsAll: Participant[];
    screenId: string;
    recordStarted: boolean;
    recordStopped: boolean;
    recordPaused: boolean;
    recordResumed: boolean;
    recordingMediaOptions: string;
    member: string;
    shareScreenStarted: boolean;
    targetResolution?: string;
    targetResolutionHost?: string;
    isDarkModeValue?: boolean;
    updateShapes: (shapes: Shape[]) => void;
    updateUseImageBackground: (useImageBackground: boolean) => void;
    updateRedoStack: (redoStack: Shape[]) => void;
    updateUndoStack: (undoStack: string[]) => void;
    updateWhiteboardStarted: (whiteboardStarted: boolean) => void;
    updateWhiteboardEnded: (whiteboardEnded: boolean) => void;
    updateWhiteboardUsers: (whiteboardUsers: WhiteboardUser[]) => void;
    updateParticipants: (participants: Participant[]) => void;
    updateScreenId: (screenId: string) => void;
    updateShareScreenStarted: (shareScreenStarted: boolean) => void;
    updateCanvasWhiteboard: (canvasWhiteboard: HTMLCanvasElement | null) => void;
    onScreenChanges: OnScreenChangesType;
    captureCanvasStream: CaptureCanvasStreamType;
    getUpdatedAllParams: () => WhiteboardParameters;
    [key: string]: any;
}
export interface WhiteboardOptions {
    customWidth: number;
    customHeight: number;
    parameters: WhiteboardParameters;
    showAspect: boolean;
    isDarkModeValue?: boolean;
}
export type WhiteboardType = (props: WhiteboardOptions) => React.JSX.Element;
/**
 * Whiteboard - Real-time collaborative drawing and annotation canvas
 *
 * A feature-rich whiteboard component for collaborative drawing, annotations, and visual brainstorming.
 * Supports freehand drawing, shapes, text, images, erasers, undo/redo, zoom/pan, and real-time
 * synchronization across participants. Perfect for virtual classrooms, design reviews, workshops,
 * and interactive presentations.
 *
 * Features:
 * - Freehand drawing with customizable brush and thickness
 * - Shape tools (rectangle, circle, line, arrow)
 * - Text annotations with font customization
 * - Image uploads and background images
 * - Eraser tool with adjustable size
 * - Undo/redo functionality
 * - Zoom in/out with pan navigation
 * - Color palette selection
 * - Line type selection (solid, dashed, dotted)
 * - Real-time socket synchronization
 * - Multi-user collaboration with user tracking
 * - Save/export canvas functionality
 * - Recording-compatible canvas streaming
 * - Responsive canvas sizing
 * - Touch and mouse input support
 *
 * @component
 * @param {WhiteboardOptions} options - Configuration options
 * @param {number} options.customWidth - Canvas width in pixels
 * @param {number} options.customHeight - Canvas height in pixels
 * @param {WhiteboardParameters} options.parameters - Whiteboard state parameters
 * @param {Socket} options.parameters.socket - Socket.io client instance
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {string} options.parameters.islevel - User permission level ('2'=host, '1'=co-host)
 * @param {string} options.parameters.roomName - Meeting/room identifier
 * @param {Shape[]} options.parameters.shapes - Current canvas shapes array
 * @param {boolean} options.parameters.useImageBackground - Image background enabled state
 * @param {Shape[]} options.parameters.redoStack - Redo action stack
 * @param {string[]} options.parameters.undoStack - Undo action stack
 * @param {boolean} options.parameters.whiteboardStarted - Whiteboard session active
 * @param {boolean} options.parameters.whiteboardEnded - Whiteboard session ended
 * @param {WhiteboardUser[]} options.parameters.whiteboardUsers - Active whiteboard users
 * @param {Participant[]} options.parameters.participants - Current meeting participants
 * @param {Participant[]} options.parameters.participantsAll - All participants (incl. left)
 * @param {string} options.parameters.screenId - Screen identifier for streaming
 * @param {boolean} options.parameters.recordStarted - Recording active state
 * @param {boolean} options.parameters.recordStopped - Recording stopped state
 * @param {boolean} options.parameters.recordPaused - Recording paused state
 * @param {boolean} options.parameters.recordResumed - Recording resumed state
 * @param {string} options.parameters.recordingMediaOptions - Recording configuration
 * @param {string} options.parameters.member - Current user member ID
 * @param {boolean} options.parameters.shareScreenStarted - Screen sharing active
 * @param {string} [options.parameters.targetResolution] - Target recording resolution
 * @param {string} [options.parameters.targetResolutionHost] - Host recording resolution
 * @param {Function} options.parameters.updateShapes - Update shapes array
 * @param {Function} options.parameters.updateUseImageBackground - Update background state
 * @param {Function} options.parameters.updateRedoStack - Update redo stack
 * @param {Function} options.parameters.updateUndoStack - Update undo stack
 * @param {Function} options.parameters.updateWhiteboardStarted - Update session state
 * @param {Function} options.parameters.updateWhiteboardEnded - Update ended state
 * @param {Function} options.parameters.updateWhiteboardUsers - Update user list
 * @param {Function} options.parameters.updateParticipants - Update participants
 * @param {Function} options.parameters.updateScreenId - Update screen ID
 * @param {Function} options.parameters.updateShareScreenStarted - Update sharing state
 * @param {Function} options.parameters.updateCanvasWhiteboard - Update canvas reference
 * @param {Function} options.parameters.onScreenChanges - Screen change handler
 * @param {Function} options.parameters.captureCanvasStream - Canvas stream capture handler
 * @param {Function} options.parameters.getUpdatedAllParams - Retrieve latest parameters
 * @param {boolean} options.showAspect - Show aspect ratio indicator
 *
 * @returns {React.JSX.Element} Rendered whiteboard canvas with toolbar
 *
 * @example
 * // Basic whiteboard for collaborative drawing
 * ```tsx
 * import React from 'react';
 * import { Whiteboard } from 'mediasfu-reactjs';
 *
 * function CollaborativeWhiteboard({ parameters }) {
 *   return (
 *     <Whiteboard
 *       customWidth={1280}
 *       customHeight={720}
 *       parameters={parameters}
 *       showAspect={true}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Whiteboard with analytics tracking
 * ```tsx
 * import { Whiteboard } from 'mediasfu-reactjs';
 *
 * function AnalyticsWhiteboard({ parameters }) {
 *   return (
 *     <Whiteboard
 *       customWidth={1920}
 *       customHeight={1080}
 *       parameters={{
 *         ...parameters,
 *         updateShapes: (shapes) => {
 *           analytics.track('whiteboard_shape_added', {
 *             shapeCount: shapes.length,
 *             lastShapeType: shapes[shapes.length - 1]?.type,
 *           });
 *           parameters.updateShapes(shapes);
 *         },
 *         updateWhiteboardStarted: (started) => {
 *           if (started) {
 *             analytics.track('whiteboard_session_started', {
 *               userLevel: parameters.islevel,
 *               participantCount: parameters.participants.length,
 *             });
 *           }
 *           parameters.updateWhiteboardStarted(started);
 *         },
 *       }}
 *       showAspect={true}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Whiteboard with custom dimensions and user tracking
 * ```tsx
 * import { Whiteboard } from 'mediasfu-reactjs';
 *
 * function CustomWhiteboard({ parameters }) {
 *   const activeUsers = parameters.whiteboardUsers.filter(u =>
 *     parameters.participants.some(p => p.id === u.id)
 *   );
 *
 *   return (
 *     <div>
 *       <div style={{
 *         padding: 12,
 *         background: '#f8fafc',
 *         borderRadius: 8,
 *         marginBottom: 16,
 *       }}>
 *         <div style={{ fontWeight: 600 }}>
 *           Active Collaborators: {activeUsers.length}
 *         </div>
 *         <div style={{ fontSize: 14, marginTop: 4 }}>
 *           {activeUsers.map(u => u.name).join(', ')}
 *         </div>
 *       </div>
 *       <Whiteboard
 *         customWidth={1600}
 *         customHeight={900}
 *         parameters={parameters}
 *         showAspect={false}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, Whiteboard } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   whiteboard: {
 *     component: (props) => (
 *       <Whiteboard
 *         {...props}
 *         customWidth={1920}
 *         customHeight={1080}
 *         showAspect={true}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const Whiteboard: React.FC<WhiteboardOptions>;
export default Whiteboard;
//# sourceMappingURL=Whiteboard.d.ts.map