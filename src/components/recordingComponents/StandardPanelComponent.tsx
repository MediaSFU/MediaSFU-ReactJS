import React, { useState } from 'react';
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
  // [key: string]: any; // For additional parameters
}

export interface StandardPanelOptions {
  parameters: StandardPanelParameters;
}

export type StandardPanelType = (options: StandardPanelOptions) => JSX.Element;

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

  return (
    <div>
      {/* Media Options */}
      <div>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Media Options:</label>
        <select value={selectedRecordingMediaOptions} onChange={handleMediaOptionsChange}>
          <option value="video">Record Video</option>
          <option value="audio">Record Audio Only</option>
        </select>
      </div>
      <hr />

      {/* Specific Audios */}
      {eventType !== 'broadcast' && (
        <>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Specific Audios:</label>
            <select value={selectedRecordingAudioOptions} onChange={handleAudioOptionsChange}>
              <option value="all">Add All</option>
              <option value="onScreen">Add All On Screen</option>
              <option value="host">Add Host Only</option>
            </select>
          </div>
          <hr />

          {/* Specific Videos */}
          <div id="conditionalConference">
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Specific Videos:</label>
            <select value={selectedRecordingVideoOptions} onChange={handleVideoOptionsChange}>
              <option value="all">Add All</option>
              <option value="mainScreen">Big Screen Only (includes screenshare)</option>
            </select>
          </div>
          <hr />
        </>
      )}

      {/* Add HLS */}
      <div id="addHLSPart">
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Add HLS:</label>
        <select value={selectedRecordingAddHLS.toString()} onChange={handleAddHLSChange}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <hr />
    </div>
  );
};

export default StandardPanelComponent;
