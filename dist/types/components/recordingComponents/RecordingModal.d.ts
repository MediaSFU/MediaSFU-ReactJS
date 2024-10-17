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
export type RecordingModalType = (options: RecordingModalOptions) => JSX.Element;
/**
 * RecordingModal component renders a modal for recording settings.
 *
 * @param {object} props - The properties object.
 * @param {boolean} props.isRecordingModalVisible - Determines if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {string} [props.position="bottomRight"] - Position of the modal on the screen.
 * @param {function} props.confirmRecording - Function to call when confirming the recording.
 * @param {function} props.startRecording - Function to call when starting the recording.
 * @param {object} props.parameters - Parameters for the recording.
 * @param {boolean} props.parameters.recordPaused - Indicates if the recording is paused.
 *
 * @returns {JSX.Element} The rendered RecordingModal component.
 */
declare const RecordingModal: React.FC<RecordingModalOptions>;
export default RecordingModal;
//# sourceMappingURL=RecordingModal.d.ts.map