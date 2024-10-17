

/**
 * Represents a modal for recording settings.
 * @component
 * @param {Object} props - The properties of the component.
 * @param {boolean} props.isRecordingModalVisible - Indicates whether the recording modal is visible.
 * @param {Function} props.onClose - Function to handle the closing of the recording modal.
 * @param {string} props.recordingBackgroundColor - Background color for the recording modal.
 * @param {string} props.recordingNameTagsColor - Color for name tags in the recording modal.
 * @param {string} props.recordingMediaOptions - Current media options for recording.
 * @param {string} props.prevRecordingMediaOptions - Previous media options for recording.
 * @param {boolean} props.clearedToResume - Indicates whether it is cleared to resume recording.
 * @param {string} props.backgroundColor - Background color for the recording modal content.
 * @param {string} props.position - Position of the recording modal (e.g., 'bottomRight').
 * @param {Function} props.confirmRecording - Function to confirm recording settings.
 * @param {Function} props.startRecording - Function to start recording.
 * @param {Object} props.parameters - Additional parameters to be passed to child components.
 * @returns {JSX.Element}
 */
import React from 'react';
import StandardPanelComponent from './StandardPanelComponent';
import AdvancedPanelComponent from './AdvancedPanelComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const RecordingModal = ({
  isRecordingModalVisible,
  onClose,
  recordingBackgroundColor,
  recordingNameTagsColor,
  recordingMediaOptions,
  prevRecordingMediaOptions,
  clearedToResume,
  backgroundColor = '#83c0e9',
  position = 'bottomRight',
  confirmRecording,
  startRecording,
  parameters,
}) => {
  const { recordPaused } = parameters;

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
    display: isRecordingModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '85%',
    overflowY: 'auto',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };


  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: backgroundColor,
      borderRadius: 10,
      padding: 20,
      maxWidth: '75%',
      border: '2px solid black',
    },
  };

  return (
    <div style={modalContainerStyle}>
    <div style={modalContentStyle}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <h2 style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>
              Recording Settings
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} size='xl' style={{ fontSize: 20, color: 'black' }} />
          </button>
        </div>
        <hr style={{ height: 1, backgroundColor: 'black', marginVertical: 5 }} />
        <div style={{ flex: 1 }}>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)', padding: 0 }}>
            <div style={{ margin: 0, padding: 0 }}>
              <StandardPanelComponent parameters={parameters} />
              <AdvancedPanelComponent parameters={parameters} />
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: 'white', marginVertical: 0 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button
              onClick={() =>
                confirmRecording({
                  parameters: { ...parameters },
                })
              }
              style={{ flex: 1, padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', margin: '0 10px', background: '#4CAF50', cursor: 'pointer' }}
            >
              <span style={{ color: 'black', fontSize: 14 }}>Confirm</span>
            </button>
            {!recordPaused && (
              <button
                onClick={() =>
                  startRecording({
                    parameters: { ...parameters },
                  })
                }
                style={{ flex: 1, padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', margin: '0 10px', background: '#f44336', cursor: 'pointer' }}
              >
                <span style={{ color: 'black', fontSize: 14 }}>Start <i className="fas fa-play" /></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RecordingModal;
