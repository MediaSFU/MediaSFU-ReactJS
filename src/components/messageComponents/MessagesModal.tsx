import React, { useEffect, useState, useRef } from 'react';
import MessagePanel from './MessagePanel';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { sendMessage } from '../../methods/messageMethods/sendMessage';

/**
 * MessagesModal component for displaying direct and group messages in a modal.
 * @component
 * @param {Object} props - The properties of the MessagesModal component.
 * @param {boolean} props.isMessagesModalVisible - Indicates if the messages modal is visible.
 * @param {Function} props.onMessagesClose - The function to close the messages modal.
 * @param {Function} props.onSendMessagePress - The function to handle sending messages.
 * @param {Object} props.parameters - Additional parameters used in the component.
 * @param {string} props.position - The position of the modal ('topRight', 'topLeft', etc.).
 * @param {string} props.backgroundColor - The background color of the modal.
 * @param {string} props.activeTabBackgroundColor - The background color of the active tab.
 */

const MessagesModal = ({
  isMessagesModalVisible,
  onMessagesClose,
  onSendMessagePress = sendMessage,
  parameters,
  messages,
  position = 'topRight',
  backgroundColor = '#f5f5f5',
  activeTabBackgroundColor = '#2b7ce5',
}) => {
  let {
    participantsAll,
    youAreHost,
    eventType,
    chatSetting,
    member,
    islevel,
    coHostResponsibility,
    coHost,
    showAlert,
    startDirectMessage,
    updateStartDirectMessage,
    directMessageDetails,
    updateDirectMessageDetails,
  } = parameters;

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [directMessages, setDirectMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const activeTab = useRef(eventType == 'webinar' || eventType == 'conference' ? 'direct' : 'group');
  const [focusedInput, setFocusedInput] = useState(false);
  const [reRender, setReRender] = useState(false);

  const switchToDirectTab = () => {
    activeTab.current = 'direct';
    setReRender(!reRender);
  };

  const switchToGroupTab = () => {
    activeTab.current = 'group';
    setReRender(!reRender);
  };

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isMessagesModalVisible ? 'block' : 'none',
    zIndex: 999,
  };

  
  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth, // Set max width here
    maxHeight: '75%', // Set max height here
    overflowY: 'auto', // Add overflow auto for scrollability
    overflowX: 'hidden',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };


  useEffect(() => {
    let chatValue = false;
    try {
      chatValue = coHostResponsibility.find((item) => item.name === 'chat').value;
    } catch (error) {}

    const populateMessages = () => {
      let directMsgs = messages ? messages.filter((message) => !message.group) : [];
      directMsgs = directMsgs.filter(
        (message) =>
          message.sender === member || message.receivers.includes(member) || (islevel === '2' || (coHost == member && chatValue === true))
      );
      setDirectMessages(directMsgs);

      const groupMsgs = messages ? messages.filter((message) => message.group) : [];
      setGroupMessages(groupMsgs);
    };

    if (isMessagesModalVisible) {
      populateMessages();
    }
  }, [isMessagesModalVisible, messages]);

  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
      if (eventType === 'webinar' || eventType === 'conference') {
        activeTab.current = 'direct';
        setFocusedInput(true);
      }
    } else {
      if (eventType === 'broadcast' || eventType === 'chat') {
        activeTab.current = 'group';
      }
    }
  }, [startDirectMessage, directMessageDetails, eventType]);

  useEffect(() => {

  }, [reRender]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ ...styles.modalContent, backgroundColor: backgroundColor, width: modalWidth }}>
          <div style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {eventType === 'webinar' || eventType === 'conference' ? (
              <>
                <button onClick={switchToDirectTab} style={{ ...styles.tabText, ...(activeTab.current === 'direct' && styles.activeTabText), ...(activeTab.current === 'direct' && { backgroundColor: activeTabBackgroundColor }) }}>
                  Direct
                </button>
                <button onClick={switchToGroupTab} style={{ ...styles.tabText, ...(activeTab.current === 'group' && styles.activeTabText), ...(activeTab.current === 'group' && { backgroundColor: activeTabBackgroundColor }) }}>
                  Group
                </button>
              </>
            ) : null}

             <span style={{...styles.btnCloseMessages, marginLeft:eventType === 'webinar' || eventType === 'conference' ? '30%' : '85%'}} onClick={onMessagesClose} >
              <FontAwesomeIcon icon={faTimes} className="icon" size='xl' />
            </span> 

          </div>

          <hr style={{ ...styles.separator }} />

          <div style={styles.modalBody}>
            {activeTab.current === 'direct' && (eventType === 'webinar' || eventType === 'conference') && (
              <MessagePanel messages={directMessages} messagesLength={messages.length} type="direct" onSendMessagePress={onSendMessagePress} username={member} parameters={parameters} backgroundColor={backgroundColor} focusedInput={focusedInput} />
            )}

            {activeTab.current === 'group' && (
              <MessagePanel messages={groupMessages} messagesLength={messages.length} type="group" onSendMessagePress={onSendMessagePress} username={member} parameters={parameters} backgroundColor={backgroundColor} focusedInput={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalContent: {
    borderRadius: 10,
    padding: 10,
  },
  modalBody: {
    marginTop: 10,
  },
  tabText: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
  },
  activeTabText: {
    color: '#ffffff',
    backgroundColor: '#2b7ce5',
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 1,
  },
  btnCloseMessages: {
    padding: 5,
    marginRight: 0,
    paddingRight: 0
  },
  icon: {
    fontSize: 24,
    color: 'black',
  },
};

export default MessagesModal;
