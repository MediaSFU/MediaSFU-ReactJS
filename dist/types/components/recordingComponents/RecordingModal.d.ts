import React from "react";
import { EventType, ConfirmRecordingType, StartRecordingType, ConfirmRecordingParameters, StartRecordingParameters } from "../../@types/types";
export interface RecordingModalParameters extends ConfirmRecordingParameters, StartRecordingParameters {
    recordPaused: boolean;
    recordingVideoType: string;
    recordingDisplayType: "video" | "media" | "all";
    recordingBackgroundColor: string;
    recordingNameTagsColor: string;
    recordingOrientationVideo: string;
    recordingNameTags: boolean;
    recordingAddText: boolean;
    recordingCustomText: string;
    recordingCustomTextPosition: string;
    recordingCustomTextColor: string;
    recordingMediaOptions: string;
    recordingAudioOptions: string;
    recordingVideoOptions: string;
    recordingAddHLS: boolean;
    eventType: EventType;
    updateRecordingVideoType: (value: string) => void;
    updateRecordingDisplayType: (value: "video" | "media" | "all") => void;
    updateRecordingBackgroundColor: (value: string) => void;
    updateRecordingNameTagsColor: (value: string) => void;
    updateRecordingOrientationVideo: (value: string) => void;
    updateRecordingNameTags: (value: boolean) => void;
    updateRecordingAddText: (value: boolean) => void;
    updateRecordingCustomText: (value: string) => void;
    updateRecordingCustomTextPosition: (value: string) => void;
    updateRecordingCustomTextColor: (value: string) => void;
    updateRecordingMediaOptions: (value: string) => void;
    updateRecordingAudioOptions: (value: string) => void;
    updateRecordingVideoOptions: (value: string) => void;
    updateRecordingAddHLS: (value: boolean) => void;
    getUpdatedAllParams: () => RecordingModalParameters;
    [key: string]: any;
}
export interface RecordingModalOptions {
    isRecordingModalVisible: boolean;
    onClose: () => void;
    backgroundColor?: string;
    position?: string;
    confirmRecording: ConfirmRecordingType;
    startRecording: StartRecordingType;
    parameters: RecordingModalParameters;
}
export type RecordingModalType = (options: RecordingModalOptions) => React.JSX.Element;
/**
 * RecordingModal component provides an interface for configuring and controlling
 * recording settings within a modal. This component enables users to customize
 * recording parameters, such as video and display type, background color, custom text,
 * and orientation, and to initiate or confirm the recording process.
 *
 * @component
 * @param {boolean} isRecordingModalVisible - Controls the visibility of the modal.
 * @param {() => void} onClose - Callback function for closing the modal.
 * @param {string} [backgroundColor="#83c0e9"] - Background color of the modal content.
 * @param {string} [position="bottomRight"] - Screen position for the modal (e.g., "bottomRight").
 * @param {ConfirmRecordingType} confirmRecording - Function for confirming recording settings.
 * @param {StartRecordingType} startRecording - Function for starting the recording process.
 * @param {RecordingModalParameters} parameters - Object containing all customizable recording parameters.
 * @param {boolean} parameters.recordPaused - Indicates if recording is currently paused.
 * @param {string} parameters.recordingVideoType - Specifies the video type for recording.
 * @param {("video" | "media" | "all")} parameters.recordingDisplayType - Display type for recording.
 * @param {string} parameters.recordingBackgroundColor - Background color during recording.
 * @param {string} parameters.recordingNameTagsColor - Color of name tags in recording.
 * @param {string} parameters.recordingOrientationVideo - Orientation setting for video.
 * @param {boolean} parameters.recordingNameTags - Indicates if name tags are shown.
 * @param {boolean} parameters.recordingAddText - Specifies if custom text is added to recording.
 * @param {string} parameters.recordingCustomText - Text to be displayed in recording.
 * @param {string} parameters.recordingCustomTextPosition - Position for custom text.
 * @param {string} parameters.recordingCustomTextColor - Color of custom text.
 * @param {string} parameters.recordingMediaOptions - Media options for recording.
 * @param {string} parameters.recordingAudioOptions - Audio options for recording.
 * @param {string} parameters.recordingVideoOptions - Video options for recording.
 * @param {boolean} parameters.recordingAddHLS - Specifies if HLS is added to recording.
 * @param {EventType} parameters.eventType - Type of event the recording is associated with.
 * @param {Function} parameters.updateRecordingVideoType - Function to update video type.
 * @param {Function} parameters.updateRecordingDisplayType - Function to update display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Function to update background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Function to update name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Function to update orientation.
 * @param {Function} parameters.updateRecordingNameTags - Function to toggle name tags.
 * @param {Function} parameters.updateRecordingAddText - Function to toggle custom text.
 * @param {Function} parameters.updateRecordingCustomText - Function to set custom text.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Function to set custom text position.
 * @param {Function} parameters.updateRecordingCustomTextColor - Function to set custom text color.
 * @param {Function} parameters.updateRecordingMediaOptions - Function to set media options.
 * @param {Function} parameters.updateRecordingAudioOptions - Function to set audio options.
 * @param {Function} parameters.updateRecordingVideoOptions - Function to set video options.
 * @param {Function} parameters.updateRecordingAddHLS - Function to toggle HLS in recording.
 *
 * @example
 * ```tsx
 * import { RecordingModal } from 'mediasfu-reactjs';
 *
 * // Define the recording parameters
 * const recordingParams = {
 *   recordPaused: false,
 *   recordingVideoType: "bestDisplay",
 *   recordingDisplayType: "video",
 *   recordingBackgroundColor: "#000000",
 *   recordingNameTagsColor: "#FFFFFF",
 *   recordingOrientationVideo: "landscape",
 *   recordingNameTags: true,
 *   recordingAddText: true,
 *   recordingCustomText: "Sample Text",
 *   recordingCustomTextPosition: "top",
 *   recordingCustomTextColor: "#FF0000",
 *   recordingMediaOptions: "option1",
 *   recordingAudioOptions: "option2",
 *   recordingVideoOptions: "option3",
 *   recordingAddHLS: true,
 *   eventType: "meeting",
 *   updateRecordingVideoType: (value) => console.log(value),
 *   updateRecordingDisplayType: (value) => console.log(value),
 *   updateRecordingBackgroundColor: (value) => console.log(value),
 *   updateRecordingNameTagsColor: (value) => console.log(value),
 *   updateRecordingOrientationVideo: (value) => console.log(value),
 *   updateRecordingNameTags: (value) => console.log(value),
 *   updateRecordingAddText: (value) => console.log(value),
 *   updateRecordingCustomText: (value) => console.log(value),
 *   updateRecordingCustomTextPosition: (value) => console.log(value),
 *   updateRecordingCustomTextColor: (value) => console.log(value),
 *   updateRecordingMediaOptions: (value) => console.log(value),
 *   updateRecordingAudioOptions: (value) => console.log(value),
 *   updateRecordingVideoOptions: (value) => console.log(value),
 *   updateRecordingAddHLS: (value) => console.log(value),
 * };
 *
 * // Render the RecordingModal component
 * <RecordingModal
 *   isRecordingModalVisible={true}
 *   onClose={() => console.log("Modal closed")}
 *   backgroundColor="#83c0e9"
 *   position="bottomRight"
 *   confirmRecording={() => console.log("Recording confirmed")}
 *   startRecording={() => console.log("Recording started")}
 *   parameters={recordingParams}
 * />
 * ```
 */
declare const RecordingModal: React.FC<RecordingModalOptions>;
export default RecordingModal;
//# sourceMappingURL=RecordingModal.d.ts.map