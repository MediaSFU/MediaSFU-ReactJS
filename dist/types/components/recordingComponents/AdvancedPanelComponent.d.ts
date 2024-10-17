import React from "react";
import { EventType } from "../../@types/types";
export interface AdvancedPanelParameters {
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
    eventType: EventType;
}
export interface AdvancedPanelOptions {
    parameters: AdvancedPanelParameters;
}
export type AdvancedPanelType = (options: AdvancedPanelOptions) => JSX.Element;
/**
 * AdvancedPanelComponent is a React functional component that provides a user interface
 * for configuring advanced recording options. It allows users to select and update various
 * recording parameters such as video type, display type, background color, custom text,
 * name tags, and video orientation.
 *
 * @component
 * @param {AdvancedPanelOptions} parameters - The parameters for configuring the advanced recording options.
 * @param {string} parameters.recordingVideoType - The type of video recording.
 * @param {string} parameters.recordingDisplayType - The type of display for the recording.
 * @param {string} parameters.recordingBackgroundColor - The background color for the recording.
 * @param {string} parameters.recordingNameTagsColor - The color of the name tags in the recording.
 * @param {string} parameters.recordingOrientationVideo - The orientation of the video recording.
 * @param {boolean} parameters.recordingNameTags - Whether to include name tags in the recording.
 * @param {boolean} parameters.recordingAddText - Whether to add custom text to the recording.
 * @param {string} parameters.recordingCustomText - The custom text to add to the recording.
 * @param {string} parameters.recordingCustomTextPosition - The position of the custom text in the recording.
 * @param {string} parameters.recordingCustomTextColor - The color of the custom text in the recording.
 * @param {Function} parameters.updateRecordingVideoType - Function to update the recording video type.
 * @param {Function} parameters.updateRecordingDisplayType - Function to update the recording display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Function to update the recording background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Function to update the recording name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Function to update the recording orientation video.
 * @param {Function} parameters.updateRecordingNameTags - Function to update whether to include name tags in the recording.
 * @param {Function} parameters.updateRecordingAddText - Function to update whether to add custom text to the recording.
 * @param {Function} parameters.updateRecordingCustomText - Function to update the custom text in the recording.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Function to update the position of the custom text in the recording.
 * @param {Function} parameters.updateRecordingCustomTextColor - Function to update the color of the custom text in the recording.
 * @param {string} parameters.eventType - The type of event for which the recording is being configured.
 *
 * @returns {JSX.Element} The rendered component for configuring advanced recording options.
 */
declare const AdvancedPanelComponent: React.FC<AdvancedPanelOptions>;
export default AdvancedPanelComponent;
//# sourceMappingURL=AdvancedPanelComponent.d.ts.map