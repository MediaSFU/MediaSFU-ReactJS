

/**
 * LoadingModal is a component that displays a loading indicator within a modal.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isVisible - Determines whether the modal is visible or not.
 * @param {string} props.backgroundColor - Background color of the modal container.
 * @param {string} props.displayColor - Color of the loading indicator and text.
 *
 * @returns {JSX.Element} - Loading modal component.
 */


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingModal = ({ isVisible, backgroundColor, displayColor }) => {
  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0.5)',
    display: isVisible ? 'flex' : 'none',
    alignItems: 'center', // Vertically center content
    justifyContent: 'center', // Horizontally center content
    zIndex: 999,
  };

  const modalContentStyle = {
    backgroundColor,
    borderRadius: 10,
    padding: 10,
    maxWidth: 200, // Adjust as needed
    textAlign: 'center',
  };

  const spinnerContainerStyle = {
    marginBottom: 20,
  };

  const loadingTextStyle = {
    color: displayColor,
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={spinnerContainerStyle}>
          {/* Spinner */}
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '50px', color: 'black' }} />
        </div>
        <div style={loadingTextStyle}>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingModal;
