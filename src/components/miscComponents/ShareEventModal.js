/**
 * ShareEventModal component represents a modal that displays a shareevent with customizable buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [backgroundColor='#83c0e9'] - The background color of the modal.
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {Function} onClose - Function to close the modal.
 * @param {Object[]} [customButtons] - An array of custom buttons to be displayed in the shareevent.
 * @param {Function} onCopyMeetingId - Function to copy the meeting ID.
 * @param {Function} onCopyMeetingPasscode - Function to copy the meeting passcode.
 * @param {Function} onCopyShareLink - Function to copy the shareable link.
 * @param {boolean} [shareButtons=true] - Determines whether the share buttons should be displayed.
 * @param {string} [position='bottomRight'] - Position of the modal. Possible values: 'center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
 * @returns {JSX.Element} - The rendered component.
 */


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import MeetingIdComponent from '../menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../menuComponents/MeetingPasscodeComponent';
import ShareButtonsComponent from '../menuComponents/ShareButtonsComponent';


const ShareEventModal = ({
  backgroundColor = 'rgba(255, 255, 255, 0.25)',
  isShareEventModalVisible,
  onShareEventClose,
  onCopyMeetingId,
  onCopyMeetingPasscode,
  onCopyShareLink,
  shareButtons = true,
  position = 'topRight',
  roomName,
  adminPasscode,
  islevel,
}) => {
  const handleClose = () => {
    onShareEventClose();
  };



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
    display: isShareEventModalVisible ? 'block' : 'none',
    zIndex: 999,
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '60%',
    overflowY: 'auto', // Add overflow auto for scrollability
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  return (
    <div style={modalContainerStyle}>
    <div style={modalContentStyle}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '15px' }}>
          
          <div onClick={handleClose} style={{ padding: '5px' }}>
            <FontAwesomeIcon icon={faTimes} size='xl' style={{ fontSize: '20px', color: 'black' }} />
          </div>
        </div>
        <hr style={{ height: '1px', backgroundColor: 'black', marginVertical: '5px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '10px' }}>{islevel === '2' && <MeetingPasscodeComponent meetingPasscode={adminPasscode} />}</div>
          <div style={{ marginBottom: '10px' }}><MeetingIdComponent meetingID={roomName} /></div>
          {shareButtons && (
            <ShareButtonsComponent
              meetingID={roomName}
              onCopyShareLink={onCopyShareLink}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareEventModal;
