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
}
export type WhiteboardType = (props: WhiteboardOptions) => React.JSX.Element;
/**
 * Whiteboard component provides a collaborative drawing interface with features such as
 * freehand drawing, erasing, shapes, and undo/redo functionality.
 *
 * @component
 * @param {WhiteboardOptions} props - Properties for configuring the Whiteboard.
 * @param {number} props.customWidth - Custom width for the whiteboard.
 * @param {number} props.customHeight - Custom height for the whiteboard.
 * @param {WhiteboardParameters} props.parameters - Parameters and state management functions for whiteboard features.
 * @param {boolean} props.showAspect - Flag to show the aspect ratio.
 *
 * @returns {React.JSX.Element} The rendered Whiteboard component.
 *
 * @example
 * ```tsx
 * import { Whiteboard } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const parameters = {
 *   socket: io("http://localhost:3000"),
 *   showAlert: (alert) => console.log(alert),
 *   islevel: "2",
 *   roomName: "Room 1",
 *   shapes: [],
 *   useImageBackground: false,
 *   redoStack: [],
 *   undoStack: [],
 *   whiteboardStarted: true,
 *   whiteboardEnded: false,
 *   whiteboardUsers: [{ id: "user1", name: "John" }],
 *   participants: [{ id: "user1", name: "John", islevel: "1" }],
 *   screenId: "screen1",
 *   recordStarted: false,
 *   recordStopped: false,
 *   recordPaused: false,
 *   recordResumed: false,
 *   recordingMediaOptions: "video",
 *   member: "John",
 *   shareScreenStarted: false,
 *   updateShapes: (newShapes) => console.log("Shapes updated:", newShapes),
 *   updateUseImageBackground: (useImageBackground) => console.log("Background updated:", useImageBackground),
 *   updateRedoStack: (redoStack) => console.log("Redo stack updated:", redoStack),
 *   updateUndoStack: (undoStack) => console.log("Undo stack updated:", undoStack),
 *   updateWhiteboardStarted: (started) => console.log("Whiteboard started:", started),
 *   updateWhiteboardEnded: (ended) => console.log("Whiteboard ended:", ended),
 *   updateWhiteboardUsers: (users) => console.log("Whiteboard users updated:", users),
 *   updateParticipants: (participants) => console.log("Participants updated:", participants),
 *   updateScreenId: (screenId) => console.log("Screen ID updated:", screenId),
 *   updateShareScreenStarted: (shareStarted) => console.log("Screen sharing started:", shareStarted),
 *   updateCanvasWhiteboard: (canvas) => console.log("Canvas updated:", canvas),
 *   onScreenChanges: ({ changed }) => console.log("Screen changed:", changed),
 *   captureCanvasStream: () => console.log("Canvas stream captured"),
 * };
 *
 * <Whiteboard
 *   customWidth={800}
 *   customHeight={600}
 *   parameters={parameters}
 *   showAspect={true}
 * />
 * ```
 *
 * @remarks
 * This component supports multiple drawing modes (pen, eraser, shapes) and manages complex state interactions.
 * It leverages HTML5 Canvas for drawing operations and supports touch events for mobile devices.
 * Various `useEffect` hooks initialize and set up event listeners, while methods handle drawing,
 * erasing, zooming, and shape manipulation.
 */
declare const Whiteboard: React.FC<WhiteboardOptions>;
export default Whiteboard;
//# sourceMappingURL=Whiteboard.d.ts.map