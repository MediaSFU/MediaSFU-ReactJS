import React from 'react';
import { EventType } from '../../@types/types';
export interface StandardPanelParameters {
    recordingMediaOptions: string;
    recordingAudioOptions: string;
    recordingVideoOptions: string;
    recordingAddHLS: boolean;
    updateRecordingMediaOptions: (value: string) => void;
    updateRecordingAudioOptions: (value: string) => void;
    updateRecordingVideoOptions: (value: string) => void;
    updateRecordingAddHLS: (value: boolean) => void;
    eventType: EventType;
}
export interface StandardPanelOptions {
    parameters: StandardPanelParameters;
}
export type StandardPanelType = (options: StandardPanelOptions) => JSX.Element;
/**
 * StandardPanelComponent renders a panel for configuring recording options,
 * enabling the selection of media type, audio source, video source, and HLS
 * (HTTP Live Streaming) recording support. It dynamically shows or hides certain
 * options based on the provided event type.
 *
 * @component
 * @param {StandardPanelOptions} parameters - The configuration options.
 * @param {string} parameters.recordingMediaOptions - Initial media recording setting.
 * @param {string} parameters.recordingAudioOptions - Initial audio recording setting.
 * @param {string} parameters.recordingVideoOptions - Initial video recording setting.
 * @param {boolean} parameters.recordingAddHLS - Initial HLS streaming setting.
 * @param {function} parameters.updateRecordingMediaOptions - Callback to update media recording option.
 * @param {function} parameters.updateRecordingAudioOptions - Callback to update audio recording option.
 * @param {function} parameters.updateRecordingVideoOptions - Callback to update video recording option.
 * @param {function} parameters.updateRecordingAddHLS - Callback to update HLS recording option.
 * @param {EventType} parameters.eventType - Determines visibility of specific options.
 *
 * @returns {JSX.Element} The rendered configuration panel.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { StandardPanelComponent } from 'mediasfu-reactjs';
 *
 * // Define the configuration parameters for recording options
 * const parameters = {
 *   recordingMediaOptions: 'video',               // Options: 'video' | 'audio'
 *   recordingAudioOptions: 'all',                 // Options: 'all' | 'onScreen' | 'host'
 *   recordingVideoOptions: 'all',                 // Options: 'all' | 'mainScreen'
 *   recordingAddHLS: true,                        // HLS Streaming support
 *   updateRecordingMediaOptions: (value) => console.log("Updated Media:", value),
 *   updateRecordingAudioOptions: (value) => console.log("Updated Audio:", value),
 *   updateRecordingVideoOptions: (value) => console.log("Updated Video:", value),
 *   updateRecordingAddHLS: (value) => console.log("Updated HLS:", value),
 *   eventType: 'meeting',                         // Event Type: 'meeting' | 'broadcast' | 'webinar'
 * };
 *
 * // Render the StandardPanelComponent
 * <StandardPanelComponent parameters={parameters} />
 * ```
 */
declare const StandardPanelComponent: React.FC<StandardPanelOptions>;
export default StandardPanelComponent;
//# sourceMappingURL=StandardPanelComponent.d.ts.map