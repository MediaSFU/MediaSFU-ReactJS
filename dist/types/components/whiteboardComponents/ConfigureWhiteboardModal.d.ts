import React from "react";
import { Socket } from "socket.io-client";
import { CaptureCanvasStreamParameters, CaptureCanvasStreamType, EventType, OnScreenChangesParameters, OnScreenChangesType, Participant, PrepopulateUserMediaParameters, PrepopulateUserMediaType, RePortParameters, RePortType, ShowAlert, WhiteboardUser } from "../../@types/types";
export interface ConfigureWhiteboardModalParameters extends OnScreenChangesParameters, CaptureCanvasStreamParameters, PrepopulateUserMediaParameters, RePortParameters {
    participants: Participant[];
    showAlert?: ShowAlert;
    socket: Socket;
    itemPageLimit: number;
    islevel: string;
    roomName: string;
    eventType: EventType;
    shareScreenStarted: boolean;
    shared: boolean;
    breakOutRoomStarted: boolean;
    breakOutRoomEnded: boolean;
    recordStarted: boolean;
    recordResumed: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    recordingMediaOptions: string;
    canStartWhiteboard: boolean;
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
    hostLabel: string;
    updateWhiteboardStarted: (started: boolean) => void;
    updateWhiteboardEnded: (ended: boolean) => void;
    updateWhiteboardUsers: (users: WhiteboardUser[]) => void;
    updateCanStartWhiteboard: (canStart: boolean) => void;
    updateIsConfigureWhiteboardModalVisible: (isVisible: boolean) => void;
    onScreenChanges: OnScreenChangesType;
    captureCanvasStream: CaptureCanvasStreamType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    rePort: RePortType;
    getUpdatedAllParams: () => ConfigureWhiteboardModalParameters;
    [key: string]: any;
}
export interface ConfigureWhiteboardModalOptions {
    isVisible: boolean;
    onConfigureWhiteboardClose: () => void;
    parameters: ConfigureWhiteboardModalParameters;
    backgroundColor?: string;
    position?: string;
}
export type ConfigureWhiteboardModalType = (options: ConfigureWhiteboardModalOptions) => JSX.Element;
/**
 * ConfigureWhiteboard provides a modal interface for configuring whiteboard settings,
 * including assigning participants, validating settings, and starting or stopping
 * a whiteboard session.
 *
 * @component
 * @param {ConfigureWhiteboardModalOptions} props - Component properties.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {function} props.onConfigureWhiteboardClose - Closes the modal.
 * @param {ConfigureWhiteboardModalParameters} props.parameters - Various settings and functions for the whiteboard.
 * @param {string} [props.backgroundColor="#83c0e9"] - Modal background color.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 *
 * @returns {JSX.Element} The rendered ConfigureWhiteboard component.
 *
 * @example
 * ```tsx
 * import { ConfigureWhiteboard } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const parameters = {
 *   participants: [{ id: "1", name: "John Doe", islevel: "1", useBoard: false }],
 *   socket: io("http://localhost:3000"),
 *   itemPageLimit: 10,
 *   islevel: "2",
 *   roomName: "Room 1",
 *   eventType: "meeting",
 *   shareScreenStarted: false,
 *   shared: false,
 *   breakOutRoomStarted: false,
 *   breakOutRoomEnded: true,
 *   recordStarted: false,
 *   recordResumed: false,
 *   recordPaused: false,
 *   recordStopped: false,
 *   recordingMediaOptions: "video",
 *   canStartWhiteboard: true,
 *   whiteboardStarted: false,
 *   whiteboardEnded: true,
 *   hostLabel: "Host",
 *   updateWhiteboardStarted: (started) => console.log("Whiteboard started:", started),
 *   updateWhiteboardEnded: (ended) => console.log("Whiteboard ended:", ended),
 *   updateWhiteboardUsers: (users) => console.log("Whiteboard users updated:", users),
 *   updateCanStartWhiteboard: (canStart) => console.log("Can start whiteboard:", canStart),
 *   updateIsConfigureWhiteboardModalVisible: (isVisible) => console.log("Whiteboard modal visibility:", isVisible),
 *   onScreenChanges: ({ changed }) => console.log("Screen changed:", changed),
 *   captureCanvasStream: () => console.log("Canvas stream captured"),
 *   prepopulateUserMedia: ({ name }) => console.log("Prepopulating user media for:", name),
 *   rePort: ({ restart }) => console.log("Report with restart:", restart),
 *   showAlert: ({ message, type }) => console.log(`${type}: ${message}`),
 * };
 *
 * <ConfigureWhiteboard
 *   isVisible={true}
 *   onConfigureWhiteboardClose={() => console.log("Whiteboard modal closed")}
 *   parameters={parameters}
 * />
 * ```
 */
declare const ConfigureWhiteboard: React.FC<ConfigureWhiteboardModalOptions>;
export default ConfigureWhiteboard;
//# sourceMappingURL=ConfigureWhiteboardModal.d.ts.map