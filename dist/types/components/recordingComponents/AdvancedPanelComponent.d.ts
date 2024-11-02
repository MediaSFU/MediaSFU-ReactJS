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
 * AdvancedPanelComponent is a React component for configuring advanced recording options.
 *
 * @component
 * @param {AdvancedPanelOptions} parameters - Parameters for advanced recording configuration.
 * @param {string} parameters.recordingVideoType - The type of video recording (e.g., "fullDisplay").
 * @param {string} parameters.recordingDisplayType - Display type for recording (e.g., "video").
 * @param {string} parameters.recordingBackgroundColor - Background color for recording.
 * @param {string} parameters.recordingNameTagsColor - Color for name tags in recording.
 * @param {string} parameters.recordingOrientationVideo - Orientation of video recording (e.g., "landscape").
 * @param {boolean} parameters.recordingNameTags - Flag to include name tags in the recording.
 * @param {boolean} parameters.recordingAddText - Flag to add custom text to recording.
 * @param {string} parameters.recordingCustomText - Custom text to include in the recording.
 * @param {string} parameters.recordingCustomTextPosition - Position of custom text in recording (e.g., "top").
 * @param {string} parameters.recordingCustomTextColor - Color of custom text in recording.
 * @param {Function} parameters.updateRecordingVideoType - Updates the recording video type.
 * @param {Function} parameters.updateRecordingDisplayType - Updates the recording display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Updates recording background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Updates recording name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Updates recording orientation.
 * @param {Function} parameters.updateRecordingNameTags - Updates name tags inclusion status.
 * @param {Function} parameters.updateRecordingAddText - Updates custom text inclusion status.
 * @param {Function} parameters.updateRecordingCustomText - Updates custom text.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Updates custom text position.
 * @param {Function} parameters.updateRecordingCustomTextColor - Updates custom text color.
 * @param {EventType} parameters.eventType - Event type associated with the recording.
 *
 * @returns {JSX.Element} Rendered component for configuring advanced recording options.
 *
 * @example
 * ```tsx
 * import { AdvancedPanelComponent } from 'mediasfu-reactjs';
 *
 * // Define the recording parameters for the advanced panel
 * const parameters = {
 *   recordingVideoType: 'fullDisplay',
 *   recordingDisplayType: 'video',
 *   recordingBackgroundColor: '#000000',
 *   recordingNameTagsColor: '#FFFFFF',
 *   recordingOrientationVideo: 'landscape',
 *   recordingNameTags: true,
 *   recordingAddText: true,
 *   recordingCustomText: 'Custom Text',
 *   recordingCustomTextPosition: 'top',
 *   recordingCustomTextColor: '#FFFFFF',
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
 *   eventType: 'webinar',
 * };
 *
 * // Render the AdvancedPanelComponent
 * <AdvancedPanelComponent parameters={parameters} />
 * ```
 */
declare const AdvancedPanelComponent: React.FC<AdvancedPanelOptions>;
export default AdvancedPanelComponent;
//# sourceMappingURL=AdvancedPanelComponent.d.ts.map