import React, { useState } from 'react';
import { EventType } from '../../@types/types';

export type RecordingOptionItem = { value: string; label: string; tooltip?: string };

export const recordingMediaOptionItems: RecordingOptionItem[] = [
  { value: 'video', label: 'Record Video', tooltip: 'Record audio and video' },
  { value: 'audio', label: 'Record Audio Only', tooltip: 'Record audio without video' },
];

export const recordingAudioOptionItems: RecordingOptionItem[] = [
  { value: 'all', label: 'Add All', tooltip: 'Include all participant audios' },
  { value: 'onScreen', label: 'Add All On Screen', tooltip: 'Include only on-screen audios' },
  { value: 'host', label: 'Add Host Only', tooltip: 'Include host audio only' },
];

export const recordingVideoOptionItems: RecordingOptionItem[] = [
  { value: 'all', label: 'Add All', tooltip: 'Include all participant videos' },
  { value: 'mainScreen', label: 'Big Screen Only (includes screenshare)', tooltip: 'Use the main screen feed' },
];

export const recordingHlsOptionItems: RecordingOptionItem[] = [
  { value: 'true', label: 'True', tooltip: 'Enable HLS' },
  { value: 'false', label: 'False', tooltip: 'Disable HLS' },
];

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
  // [key: string]: any; // For additional parameters
}

export interface StandardPanelOptions {
  parameters: StandardPanelParameters;
}

export type StandardPanelType = (options: StandardPanelOptions) => React.JSX.Element;

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
 * @returns {React.JSX.Element} The rendered configuration panel.
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



const StandardPanelComponent: React.FC<StandardPanelOptions> = ({ parameters }) => {
  const {
    recordingMediaOptions,
    recordingAudioOptions,
    recordingVideoOptions,
    recordingAddHLS,
    updateRecordingMediaOptions,
    updateRecordingAudioOptions,
    updateRecordingVideoOptions,
    updateRecordingAddHLS,
    eventType,
  } = parameters;

  const [selectedRecordingMediaOptions, setSelectedRecordingMediaOptions] = useState(
    recordingMediaOptions
  );
  const [selectedRecordingAudioOptions, setSelectedRecordingAudioOptions] = useState(
    recordingAudioOptions
  );
  const [selectedRecordingVideoOptions, setSelectedRecordingVideoOptions] = useState(
    recordingVideoOptions
  );
  const [selectedRecordingAddHLS, setSelectedRecordingAddHLS] = useState(recordingAddHLS);

  const handleMediaOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingMediaOptions(e.target.value);
    updateRecordingMediaOptions(e.target.value);
  };

  const handleAudioOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingAudioOptions(e.target.value);
    updateRecordingAudioOptions(e.target.value);
  };

  const handleVideoOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingVideoOptions(e.target.value);
    updateRecordingVideoOptions(e.target.value);
  };

  const handleAddHLSChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true';
    setSelectedRecordingAddHLS(value);
    updateRecordingAddHLS(value);
  };

  const renderOption = (item: RecordingOptionItem) => (
    <option key={item.value} value={item.value} title={item.tooltip || item.label}>
      {item.label}
    </option>
  );

  return (
    <div>
      {/* Media Options */}
      <div>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Media Options:</label>
        <select value={selectedRecordingMediaOptions} onChange={handleMediaOptionsChange}>
          {recordingMediaOptionItems.map(renderOption)}
        </select>
      </div>
      <hr />

      {/* Specific Audios */}
      {eventType !== 'broadcast' && (
        <>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Specific Audios:</label>
            <select value={selectedRecordingAudioOptions} onChange={handleAudioOptionsChange}>
              {recordingAudioOptionItems.map(renderOption)}
            </select>
          </div>
          <hr />

          {/* Specific Videos */}
          <div id="conditionalConference">
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Specific Videos:</label>
            <select value={selectedRecordingVideoOptions} onChange={handleVideoOptionsChange}>
              {recordingVideoOptionItems.map(renderOption)}
            </select>
          </div>
          <hr />
        </>
      )}

      {/* Add HLS */}
      <div id="addHLSPart">
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Add HLS:</label>
        <select value={selectedRecordingAddHLS.toString()} onChange={handleAddHLSChange}>
          {recordingHlsOptionItems.map(renderOption)}
        </select>
      </div>
      <hr />
    </div>
  );
};

export default StandardPanelComponent;
