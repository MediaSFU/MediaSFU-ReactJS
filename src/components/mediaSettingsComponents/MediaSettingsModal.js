/**
 * MediaSettingsModal - A React JS component for displaying a modal to manage media settings.
 * @param {Object} props - The props passed to the MediaSettingsModal.
 * @param {boolean} props.isMediaSettingsModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onMediaSettingsClose - Function to handle closing the modal.
 * @param {Function} props.switchCameraOnPress - Function to handle switching the camera.
 * @param {Function} props.switchVideoOnPress - Function to handle switching video input.
 * @param {Function} props.switchAudioOnPress - Function to handle switching audio input.
 * @param {Object} props.parameters - Object containing media settings and device information.
 * @param {string} props.position - Position of the modal ('topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @returns {React.Component} - The MediaSettingsModal.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faSyncAlt,faCamera,faMicrophone, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { switchAudio } from '../../methods/streamMethods/switchAudio';
import { switchVideo } from '../../methods/streamMethods/switchVideo';
import { switchVideoAlt } from '../../methods/streamMethods/switchVideoAlt';

const MediaSettingsModal = ({
  isMediaSettingsModalVisible,
  onMediaSettingsClose,
  switchCameraOnPress = switchVideoAlt,
  switchVideoOnPress = switchVideo,
  switchAudioOnPress = switchAudio,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  let { islevel, showAlert, coHost, member, userDefaultVideoInputDevice, videoInputs, audioInputs, userDefaultAudioInputDevice, isBackgroundModalVisible, updateIsBackgroundModalVisible } = parameters;

  const [selectedVideoInput, setSelectedVideoInput] = useState(userDefaultVideoInputDevice);
  const [selectedAudioInput, setSelectedAudioInput] = useState(userDefaultAudioInputDevice);

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isMediaSettingsModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%',
    overflowY: 'auto',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  const inputStyle = {
    width: '90%',
    padding: 10,
    borderRadius: 5,
    border: '1px solid #000',
    fontSize: 16,
    marginBottom: 10
  };

  const handleSwitchCamera = async () => {
    // Handle switching camera logic
    await switchCameraOnPress({ parameters });
  };

  const handleVideoSwitch = async (value) => {
    // Handle switching video input device logic
    if (value !== selectedVideoInput) {
      setSelectedVideoInput(value);
      await switchVideoOnPress({ videoPreference: value, parameters });
    }
  };

  const handleAudioSwitch = async (value) => {
    // Handle switching audio input device logic
    if (value !== selectedAudioInput) {
      setSelectedAudioInput(value);
      await switchAudioOnPress({ audioPreference: value, parameters });
    }
  };

  const handleModalClose = () => {
    onMediaSettingsClose();
  };

  const showVirtual = () => {
    updateIsBackgroundModalVisible(!isBackgroundModalVisible);
  };
  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">Media Settings</div>
          <div className="btn-close-media-settings" onClick={onMediaSettingsClose}>
            <FontAwesomeIcon icon={faTimes} className="icon" size='xl' />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <label>
              <FontAwesomeIcon  icon={faCamera} /> Select Camera:
            </label>
            <select value={selectedVideoInput ? selectedVideoInput : ''} onChange={(e) => handleVideoSwitch(e.target.value)} className="form-control">
              {videoInputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faMicrophone} /> Select Microphone:
            </label>
            <select value={selectedAudioInput ? selectedAudioInput : ''} onChange={(e) => handleAudioSwitch(e.target.value)} className="form-control">
              {audioInputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button onClick={handleSwitchCamera} style={{backgroundColor: '#83c0e9', color: 'black', padding: 10, borderRadius: 5, border: 'none', cursor: 'pointer', width: '100%'}}>
              <FontAwesomeIcon icon={faSyncAlt} /> Switch Camera
            </button>
          </div>
          <hr />
          <div className="form-group">
            <button onClick={showVirtual} style={{backgroundColor: '#83c0e9', color: 'black', padding: 10, borderRadius: 5, border: 'none', cursor: 'pointer', width: '100%'}}>
            <FontAwesomeIcon icon={faPhotoFilm} /> Virtual Background
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MediaSettingsModal;