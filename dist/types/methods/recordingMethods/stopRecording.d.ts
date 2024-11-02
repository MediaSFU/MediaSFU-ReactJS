import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";
export interface StopRecordingParameters {
    roomName: string;
    socket: Socket;
    showAlert?: ShowAlert;
    startReport: boolean;
    endReport: boolean;
    recordStarted: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    updateRecordPaused: (paused: boolean) => void;
    updateRecordStopped: (stopped: boolean) => void;
    updateStartReport: (startReport: boolean) => void;
    updateEndReport: (endReport: boolean) => void;
    updateShowRecordButtons: (show: boolean) => void;
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
    recordingMediaOptions: string;
    captureCanvasStream: (options: {
        parameters: any;
        start?: boolean;
    }) => void;
    [key: string]: any;
}
export interface StopRecordingOptions {
    parameters: StopRecordingParameters;
}
export type StopRecordingType = (options: StopRecordingOptions) => Promise<void>;
/**
 * Stops the recording process if it has been started and not yet stopped.
 *
 * @param {StopRecordingOptions} parameters - The parameters required to stop the recording.
 * @param {string} parameters.roomName - The name of the room where the recording is taking place.
 * @param {Socket} parameters.socket - The socket instance used for communication.
 * @param {Function} parameters.showAlert - Function to show alert messages.
 * @param {boolean} parameters.startReport - Indicates if the recording start report is active.
 * @param {boolean} parameters.endReport - Indicates if the recording end report is active.
 * @param {boolean} parameters.recordStarted - Indicates if the recording has started.
 * @param {boolean} parameters.recordPaused - Indicates if the recording is paused.
 * @param {boolean} parameters.recordStopped - Indicates if the recording has stopped.
 * @param {Function} parameters.updateRecordPaused - Function to update the record paused state.
 * @param {Function} parameters.updateRecordStopped - Function to update the record stopped state.
 * @param {Function} parameters.updateStartReport - Function to update the start report state.
 * @param {Function} parameters.updateEndReport - Function to update the end report state.
 * @param {Function} parameters.updateShowRecordButtons - Function to update the visibility of record buttons.
 * @param {boolean} parameters.whiteboardStarted - Indicates if the whiteboard session has started.
 * @param {boolean} parameters.whiteboardEnded - Indicates if the whiteboard session has ended.
 * @param {string} parameters.recordingMediaOptions - The media options for recording (e.g., "video").
 * @param {Function} parameters.captureCanvasStream - Function to capture the canvas stream.
 *
 * @returns {Promise<void>} A promise that resolves when the recording stop process is complete.
 *
 * @example
 * ```typescript
 * stopRecording({
 *   parameters: {
 *     roomName: 'Room101',
 *     socket: mySocket,
 *     showAlert: myShowAlert,
 *     startReport: true,
 *     endReport: false,
 *     recordStarted: true,
 *     recordPaused: false,
 *     recordStopped: false,
 *     updateRecordPaused: setRecordPaused,
 *     updateRecordStopped: setRecordStopped,
 *     updateStartReport: setStartReport,
 *     updateEndReport: setEndReport,
 *     updateShowRecordButtons: setShowRecordButtons,
 *     whiteboardStarted: true,
 *     whiteboardEnded: false,
 *     recordingMediaOptions: 'video',
 *     captureCanvasStream: myCaptureCanvasStream,
 *   },
 * });
 * ```
 */
export declare const stopRecording: ({ parameters, }: StopRecordingOptions) => Promise<void>;
//# sourceMappingURL=stopRecording.d.ts.map