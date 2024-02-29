import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import MenuItemComponent from './MenuItemComponent';
import MeetingIdComponent from './MeetingIDComponent';
import MeetingPasscodeComponent from './MeetingPasscodeComponent';
import ShareButtonsComponent from './ShareButtonsComponent';
import CustomButtons from './CustomButtons';
import { launchRecording } from '../../methods/recordingMethods/launchRecording';
import { launchWaiting } from '../../methods/waitingMethods/launchWaiting';
import { launchCoHost } from '../../methods/coHostMethods/launchCoHost';
import { launchMediaSettings } from '../../methods/mediaSettingsMethods/launchMediaSettings';
import { launchDisplaySettings } from '../../methods/displaySettingsMethods/launchDisplaySettings';
import { launchSettings } from '../../methods/settingsMethods/launchSettings';
import { launchRequests } from '../../methods/requestsMethods/launchRequests';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * MenuModal component represents a modal that displays a menu with customizable buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [backgroundColor='#83c0e9'] - The background color of the modal.
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {Function} onClose - Function to close the modal.
 * @param {Object[]} [customButtons] - An array of custom buttons to be displayed in the menu.
 * @param {Function} onCopyMeetingId - Function to copy the meeting ID.
 * @param {Function} onCopyMeetingPasscode - Function to copy the meeting passcode.
 * @param {Function} onCopyShareLink - Function to copy the shareable link.
 * @param {boolean} [shareButtons=true] - Determines whether the share buttons should be displayed.
 * @param {string} [position='bottomRight'] - Position of the modal. Possible values: 'center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
 * @returns {JSX.Element} - The rendered component.
 */

const MenuModal = ({
  backgroundColor = '#83c0e9',
  isVisible,
  onClose,
  customButtons,
  onCopyMeetingId,
  onCopyMeetingPasscode,
  onCopyShareLink,
  shareButtons = true,
  position = 'bottomRight',
  roomName,
  adminPasscode,
  islevel
}) => {
  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;

  if (modalWidth > 450) {
    modalWidth = 450;
  }

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '85%', // Set max height here
    overflowY: 'auto', // Add overflow auto for scrollability
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
            <FontAwesomeIcon icon={faBars} style={{ fontSize: 20, color: 'black' }} /> Menu
          </div>
          <div onClick={onClose} style={{ padding: 5 }}>
            <FontAwesomeIcon icon={faTimes} style={{ fontSize: 20, color: 'black' }} />
          </div>
        </div>
        <hr style={{ height: 1, backgroundColor: 'black', marginVertical: 5 }} />
        <div style={{ flex: 1 }}>
          {/* Wrap the content inside a div with fixed height and overflow auto */}
          <div style={{ maxHeight: 'calc(70% - 70px)', overflowY: 'auto' }}>
            <div style={{ margin: 0, padding: 0 }}>
              {/* CustomButtons component */}
                <CustomButtons buttons={customButtons} />
              <div style={{ height: 1, backgroundColor: '#ffffff', marginVertical: 10 }}></div>
              {/* MeetingPasscodeComponent */}
              {islevel === '2' && (
                <MeetingPasscodeComponent onCopyMeetingPasscode={onCopyMeetingPasscode} meetingPasscode={adminPasscode} />
              )}
              {/* MeetingIdComponent */}
              <div style={{ marginBottom: 10 }}>
                <MeetingIdComponent onCopyMeetingId={onCopyMeetingId} meetingID={roomName} />
              </div>
              {/* ShareButtonsComponent */}
              {shareButtons && (
                <ShareButtonsComponent meetingID={roomName} onCopyShareLink={onCopyShareLink} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
