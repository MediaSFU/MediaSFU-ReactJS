/**
 * StandardPanelComponent - A React JS component for rendering a standard panel with picker inputs.
 * @param {Object} props - The props passed to the StandardPanelComponent.
 * @param {Object} props.parameters - The parameters for configuring the panel.
 * @param {string} props.parameters.recordingMediaOptions - The selected recording media options.
 * @param {string} props.parameters.recordingAudioOptions - The selected recording audio options.
 * @param {string} props.parameters.recordingVideoOptions - The selected recording video options.
 * @param {boolean} props.parameters.recordingAddHLS - The selected recording HLS option.
 * @param {Function} props.parameters.updateRecordingMediaOptions - Callback to update the recording media options.
 * @param {Function} props.parameters.updateRecordingAudioOptions - Callback to update the recording audio options.
 * @param {Function} props.parameters.updateRecordingVideoOptions - Callback to update the recording video options.
 * @param {Function} props.parameters.updateRecordingAddHLS - Callback to update the recording HLS option.
 * @returns {React.Component} - The StandardPanelComponent.
 */
import React, { useState } from 'react';

const StandardPanelComponent = ({ parameters }) => {
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

  //  <select value={selectedRecordingNameTags} onChange={(e) => {updateRecordingNameTags(e.target.value === 'true'); setSelectedRecordingNameTags(e.target.value);}}>

  const [selectedRecordingMediaOptions, setSelectedRecordingMediaOptions] = useState(recordingMediaOptions);
  const [selectedRecordingAudioOptions, setSelectedRecordingAudioOptions] = useState(recordingAudioOptions);
  const [selectedRecordingVideoOptions, setSelectedRecordingVideoOptions] = useState(recordingVideoOptions);
  const [selectedRecordingAddHLS, setSelectedRecordingAddHLS] = useState(recordingAddHLS);


  const handleMediaOptionsChange = (e) => {
    setSelectedRecordingMediaOptions(e.target.value);
    updateRecordingMediaOptions(e.target.value);
  };

  const handleAudioOptionsChange = (e) => {
    setSelectedRecordingAudioOptions(e.target.value);
    updateRecordingAudioOptions(e.target.value);
  };

  const handleVideoOptionsChange = (e) => {
    setSelectedRecordingVideoOptions(e.target.value);
    updateRecordingVideoOptions(e.target.value);
  };

  const handleAddHLSChange = (e) => {
    setSelectedRecordingAddHLS(e.target.value === 'true');
    updateRecordingAddHLS(e.target.value === 'true');
  };



  return (
    <div>
      {/* Media Options */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Media Options:</label>
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
            <label style={{marginRight:'10px', fontWeight: 'bold' }}>Specific Audios:</label>
            <select value={selectedRecordingAudioOptions} onChange={handleAudioOptionsChange}>
              <option value="all">Add All</option>
              <option value="onScreen">Add All On Screen</option>
              <option value="host">Add Host Only</option>
            </select>
          </div>
          <hr />

          {/* Specific Videos */}
          <div id="conditionalConference">
            <label style={{marginRight:'10px', fontWeight: 'bold'}} >Specific Videos:</label>
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
        <label  style={{marginRight:'10px', fontWeight: 'bold'}}>Add HLS:</label>
        <select value={selectedRecordingAddHLS} onChange={handleAddHLSChange}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <hr />
    </div>
  );
};

export default StandardPanelComponent;


