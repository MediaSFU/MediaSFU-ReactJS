
/**
 * AlertComponent - A React JS component for displaying alerts in a modal.
 * @param {Object} props - The props passed to the AlertComponent.
 * @param {boolean} props.visible - Flag indicating whether the alert is visible.
 * @param {string} props.message - The message to be displayed in the alert.
 * @param {string} props.type - The type of alert ('success' or 'error').
 * @param {number} props.duration - The duration (in milliseconds) for which the alert is visible (default is 4000).
 * @param {function} props.onHide - Callback function called when the alert is hidden.
 * @param {string} props.textColor - The text color of the alert message.
 * @returns {React.Component} - The AlertComponent.
 */

import React, { useEffect, useState } from 'react';

const AlertComponent = ({ visible, message, type, duration = 4000, onHide, textColor }) => {
  const [alertType, setAlertType] = useState(type || 'success');

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer;

    if (visible) {
      timer = setTimeout(() => {
        onHide && onHide();
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [visible, duration, onHide]);

  const handlePress = () => {
    onHide && onHide();
  };

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <div className="centeredView" onClick={handlePress} style={styles.centeredView}>
        <div className="modalView" style={{ ...styles.modalView, backgroundColor: alertType === 'success' ? 'green' : 'red' }}>
          <p className="modalText" style={{ ...styles.modalText, color: textColor }}>{message}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  centeredView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    color: 'black',
    fontSize: '16px',
  },
};

export default AlertComponent;

