

/**
 * A React JS modal component for confirming user exit from an event or ending an event.
 *
 * @component
 * @param {Object} props - The properties of the ConfirmExitModal component.
 * @param {boolean} props.isConfirmExitModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onConfirmExitClose - Callback function to close the modal.
 * @param {Object} props.parameters - Additional parameters required for exit confirmation logic.
 * @param {string} [props.position='topRight'] - Position of the modal (default is 'topRight').
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal (default is '#83c0e9').
 * @param {Function} [props.exitEventOnConfirm=confirmExit] - Callback function for exit confirmation logic (default is confirmExit).
 * @returns {JSX.Element} - JSX element representing the ConfirmExitModal component.
 *
 * @example
 * // Example usage of ConfirmExitModal
 * <ConfirmExitModal
 *   isConfirmExitModalVisible={true}
 *   onConfirmExitClose={() => setConfirmExitModalVisible(false)}
 *   parameters={{ islevel: '2' }}
 *   position="bottomCenter"
 *   backgroundColor="#7e57c2"
 *   exitEventOnConfirm={customExitEventLogic}
 * />
 */

import React from 'react';
import { confirmExit } from '../../methods/exitMethods/confirmExit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ConfirmExitModal = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  exitEventOnConfirm = confirmExit,
}) => {
  const { islevel } = parameters;

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
    display: isConfirmExitModalVisible ? 'block' : 'none',
    zIndex: 999,
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
    right: position.includes('Right') ? 10 : 'auto',
  };

  const handleConfirmExit = () => {
    exitEventOnConfirm({ parameters });
    onConfirmExitClose();
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
      <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between'}}>
          <h2 className="modal-title">Confirm Exit</h2>
          <span  onClick={onConfirmExitClose} style={{cursor: 'pointer',marginRight: '20px', color: 'black', fontSize: 'large', fontWeight: 'bold'}} >
            <FontAwesomeIcon icon={faTimes} size={'lg'} />
          </span>
        </div>
        <hr />
        <div className="modal-body">
          <p className="confirm-exit-text">
            {islevel === '2' ? 'This will end the event for all. Confirm exit.' : 'Are you sure you want to exit?'}
          </p>
        </div>
        <hr />
        <div className="modal-footer">
          <button style={{marginRight: '20px', borderRadius:5, backgroundColor:'black', color:'white', padding: '5px 10px'}} onClick={onConfirmExitClose}>Cancel</button>
  
          <span>
          <button style={{marginLeft: '20px',borderRadius:5, backgroundColor:'red', color:'white', padding: '5px 10px'}} onClick={handleConfirmExit}>
            {islevel === '2' ? 'End Event' : 'Exit'}
          </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
