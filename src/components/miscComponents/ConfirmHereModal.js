/**
 * ConfirmHereModal - A React JS modal component for confirming presence with countdown timer.
 * @param {Object} props - The props passed to the ConfirmHereModal.
 * @param {boolean} props.isConfirmHereModalVisible - Flag indicating whether the modal is visible.
 * @param {function} props.onConfirmHereClose - Callback function to close the modal.
 * @param {Object} props.parameters - Additional parameters for the modal.
 * @param {string} props.position - Position of the modal ('center' by default).
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @param {string} props.displayColor - Color for the display elements.
 * @returns {React.Component} - The ConfirmHereModal.
 */

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

let countdownInterval;

function startCountdown({ duration, onConfirm, onUpdateCounter,parameters }) {

  let {socket,roomName,member} = parameters;

  let timeRemaining = duration;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    onUpdateCounter(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      socket.emit('disconnectUser', { member: member, roomName: roomName, ban: false });
      onConfirm();
    }
  }, 1000);
}

const ConfirmHereModal = ({ 
  isConfirmHereModalVisible, 
  onConfirmHereClose, 
  parameters, 
  position = 'center', 
  backgroundColor = '#83c0e9' ,
  displayColor = '#000000'
}) => {
  const { countdownDuration, member, roomName, redirectURL } = parameters;
  const [counter, setCounter] = useState(countdownDuration);

  useEffect(() => {
    
    if (isConfirmHereModalVisible) {
      startCountdown({
        duration: countdownDuration ? countdownDuration : 60,
        onConfirm: onConfirmHereClose,
        onUpdateCounter: setCounter,
        parameters: parameters,
      });
    }
  }, [isConfirmHereModalVisible]);

  const handleConfirmHere = () => {
    clearInterval(countdownInterval);
    onConfirmHereClose(); // Close the modal after confirming
  };

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0.5)',
    display: isConfirmHereModalVisible ? 'block' : 'none',
    zIndex: 999,
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    maxHeight: '100%',
    overflowY: 'auto',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={modalContainerStyle}>
    <div style={modalContentStyle}>
      <div style={{ textAlign: 'center' }}>
        {/* Spinner */}
        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '50px', color: 'black', marginBottom: '20px' }} />
        {/* Modal Content */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'black' }}>Are you still there?</h2>
        <p style={{ fontSize: '1rem', color: 'black', marginBottom: '1.5rem' }}>Please confirm if you are still present.</p>
        <p style={{ fontSize: '0.9rem', color: 'black', marginBottom: '1rem' }}>Time remaining: <strong>{counter}</strong></p>
        <button 
          onClick={handleConfirmHere} 
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
  );
};

export default ConfirmHereModal;
