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
 * Component for configuring the whiteboard settings in a modal.
 *
 * @component
 * @param {ConfigureWhiteboardModalOptions} props - The properties for the component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {function} props.onConfigureWhiteboardClose - Callback to close the modal.
 * @param {object} props.parameters - Various parameters related to the whiteboard and participants.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ConfigureWhiteboard
 *   isVisible={true}
 *   onConfigureWhiteboardClose={handleClose}
 *   parameters={parameters}
 * />
 *
 * @remarks
 * This component handles the configuration of the whiteboard, including assigning participants,
 * validating the whiteboard settings, and starting/stopping the whiteboard session.
 *
 * @internal
 * This component uses various hooks such as `useState`, `useEffect`, and `useRef` to manage state
 * and side effects. It also interacts with a socket for real-time updates.
 */
declare const ConfigureWhiteboard: React.FC<ConfigureWhiteboardModalOptions>;
export default ConfigureWhiteboard;
//# sourceMappingURL=ConfigureWhiteboardModal.d.ts.map