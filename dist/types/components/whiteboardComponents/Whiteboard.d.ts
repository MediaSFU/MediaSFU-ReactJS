/**
 * Whiteboard component that provides a collaborative drawing interface.
 *
 * @component
 * @param {WhiteboardOptions} props - The properties for the Whiteboard component.
 * @param {number} props.customWidth - Custom width for the whiteboard.
 * @param {number} props.customHeight - Custom height for the whiteboard.
 * @param {Object} props.parameters - Various parameters and state management functions for the whiteboard.
 * @param {boolean} props.showAspect - Flag to show aspect ratio.
 *
 * @returns {JSX.Element} The rendered Whiteboard component.
 *
 * @example
 * <Whiteboard
 *   customWidth={800}
 *   customHeight={600}
 *   parameters={parameters}
 *   showAspect={true}
 * />
 *
 * @remarks
 * This component uses the HTML5 Canvas API to provide drawing capabilities. It supports various modes such as drawing, erasing, panning, and selecting shapes.
 * It also supports touch events for mobile devices.
 *
 * The component maintains various states using `useRef` hooks to manage drawing modes, positions, and other properties.
 *
 * The `useEffect` hook is used to initialize the canvas and set up event listeners for mouse and touch events.
 *
 * The component also includes functions to handle drawing, erasing, zooming, and shape manipulation.
 *
 * @function updateFont - Updates the current font.
 * @function updateFontSize - Updates the current font size.
 * @function updateShape - Updates the current shape.
 * @function updateLineThickness - Updates the current line thickness.
 * @function updateBrushThickness - Updates the current brush thickness.
 * @function updateEraserThickness - Updates the current eraser thickness.
 * @function startDrawing - Starts the drawing process.
 * @function draw - Handles the drawing process.
 * @function stopDrawing - Stops the drawing process.
 * @function erase - Erases parts of the drawing.
 * @function zoomCanvas - Zooms the canvas in or out.
 * @function handleZoom - Handles the zoom event.
 * @function drawEdgeMarkers - Draws edge markers on the canvas.
 * @function drawShapes - Draws all shapes on the canvas.
 * @function drawLine - Draws a line on the canvas.
 * @function drawFreehand - Draws freehand shapes on the canvas.
 * @function drawPolygon - Draws a polygon on the canvas.
 * @function drawShape - Draws a specific shape on the canvas.
 * @function undo - Undoes the last action.
 */
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
export type WhiteboardType = (props: WhiteboardOptions) => JSX.Element;
declare const Whiteboard: React.FC<WhiteboardOptions>;
export default Whiteboard;
//# sourceMappingURL=Whiteboard.d.ts.map