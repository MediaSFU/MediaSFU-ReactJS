/**
 * EventSettingsModal - A React JS component for displaying a modal to modify event settings.
 * @param {Object} props - The props passed to the EventSettingsModal.
 * @param {boolean} props.isEventSettingsModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onEventSettingsClose - Function to handle closing the modal.
 * @param {Function} props.onModifyEventSettings - Function to modify event settings.
 * @param {Object} props.parameters - Object containing audio, video, screenshare, and chat settings.
 * @param {string} props.position - Position of the modal ('topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @returns {React.Component} - The EventSettingsModal.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { modifySettings } from '../../methods/settingsMethods/modifySettings';
import './EventSettingsModal.css'; // Import CSS file for additional styling
import { getModalPosition } from '../../methods/utils/getModalPosition';

const EventSettingsModal = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const { audioSetting, videoSetting, screenshareSetting, chatSetting } = parameters;

  const [audioState, setAudioState] = useState(audioSetting);
  const [videoState, setVideoState] = useState(videoSetting);
  const [screenshareState, setScreenshareState] = useState(screenshareSetting);
  const [chatState, setChatState] = useState(chatSetting);

  const [modalVisible, setModalVisible] = useState(false);

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
    display: isEventSettingsModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%', // Set max height here
    overflowY: 'auto', // Add overflow auto for scrollability
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };


  useEffect(() => {
    if (parameters) {
      setAudioState(parameters.audioSetting);
      setVideoState(parameters.videoSetting);
      setScreenshareState(parameters.screenshareSetting);
      setChatState(parameters.chatSetting);
    }
  }, [isEventSettingsModalVisible]);

  const closeModal = () => {
    setModalVisible(false);
    onEventSettingsClose();
  };

  return (
        <div style={modalContainerStyle}>
          <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">Event Settings</div>
          <div onClick={closeModal} style={{ padding: 5 }}>
                        <FontAwesomeIcon icon={faTimes} className="icon"  size='xl' />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <label className="label">User audio:</label>
            <select
              className="picker-select"
              value={audioState}
              onChange={(e) => setAudioState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User video:</label>
            <select
              className="picker-select"
              value={videoState}
              onChange={(e) => setVideoState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User screenshare:</label>
            <select
              className="picker-select"
              value={screenshareState}
              onChange={(e) => setScreenshareState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User chat:</label>
            <select
              className="picker-select"
              value={chatState}
              onChange={(e) => setChatState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn-apply-settings"
            onClick={ async() =>
              await onModifyEventSettings({
                parameters: {
                  ...parameters,
                  audioSet: audioState,
                  videoSet: videoState,
                  screenshareSet: screenshareState,
                  chatSet: chatState,
                },
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSettingsModal;
