
/**
 * MessagePanel component for rendering and sending messages.
 * @component
 * @param {Object} props - The properties of the MessagePanel component.
 * @param {Array} props.messages - The array of messages to be displayed.
 * @param {string} props.type - The type of the message panel ('direct' or 'group').
 * @param {string} props.username - The username of the current user.
 * @param {Function} props.onSendMessagePress - The function to handle sending messages.
 * @param {Object} props.parameters - Additional parameters used in the component.
 * @param {string} props.backgroundColor - The background color of the message panel.
 * @param {boolean} props.focusedInput - Indicates if the input is currently focused.
 */
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faReply } from '@fortawesome/free-solid-svg-icons';
import { sendMessage } from '../../methods/messageMethods/sendMessage';

const MessagePanel = ({
  messages,
  messagesLength,
  type,
  username,
  onSendMessagePress = sendMessage,
  parameters,
  backgroundColor = '#f5f5f5',
  focusedInput,
}) => {
  const {
    showAlert,
    participantsAll,
    youAreHost,
    eventType,
    chatSetting,
    member,
    islevel,
    startDirectMessage,
    updateStartDirectMessage,
    directMessageDetails,
    updateDirectMessageDetails,
  } = parameters;

  const inputRef = useRef(null);

  const [replyInfo, setReplyInfo] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [directMessageText, setDirectMessageText] = useState('');
  const [groupMessageText, setGroupMessageText] = useState('');

  const handleTextInputChange = (text) => {
    if (type === 'direct') {
      setDirectMessageText(text);
    } else {
      setGroupMessageText(text);
    }
  };

  const openReplyInput = (senderId) => {
    const replyInfoContainer = {
      text: "Replying to: ",
      username: senderId,
    };

    setReplyInfo(replyInfoContainer);
    setSenderId(senderId);
  };

  const handleSendButton = async () => {
    let message = type === 'direct' ? directMessageText : groupMessageText;

    if (!message) {
      if (showAlert) {
        showAlert({
          message: 'Please enter a message',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (message.length > 350) {
      if (showAlert) {
        showAlert({
          message: 'Message is too long',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (message.trim() === '') {
      if (showAlert) {
        showAlert({
          message: 'Message is not valid.',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (type === 'direct' && !senderId && islevel == '2') {
      if (showAlert) {
        showAlert({
          message: 'Please select a message to reply to',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    await onSendMessagePress({
      parameters: {
        ...parameters,
        message,
        receivers: type === 'direct' ? [senderId] : [],
        group: type === 'group' ? true : false,
        type: type,
        messagesLength: messagesLength,
      },
    });

    if (type === 'direct') {
      setDirectMessageText('');
    } else {
      setGroupMessageText('');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (replyInfo) {
      setReplyInfo(null);
      setSenderId(null);
    }

    if (focusedInput) {
      updateDirectMessageDetails(null);
      updateStartDirectMessage(false);
    }
  };

  useEffect(() => {
    if (startDirectMessage && directMessageDetails && focusedInput) {
      inputRef.current && inputRef.current.focus();

      const replyInfoContainer = {
        text: "Replying to: ",
        username: directMessageDetails.name,
      };

      setReplyInfo(replyInfoContainer);
      setSenderId(directMessageDetails.name);
    } else {
      setReplyInfo(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [focusedInput]);

  // Define CSS styles
  const styles = {
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 'auto',
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 80,
      resize: 'vertical',
      border: '1px solid gray',
      borderRadius: 5,
      padding: 10,
      overflowY: 'auto',
    },
    sendButton: {
      backgroundColor: '#83c0e9',
      padding: 10,
      borderRadius: 5,
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <div style={{ maxHeight: '100%', backgroundColor, overflowY: 'auto' }}>
      {/* Message rendering logic */}
      {messages && messages.map((message, index) => (
      <div key={index} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === username ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          {message.sender === username && !message.group && <span style={{ fontWeight: 'bold', color: 'black', fontSize: 8, marginLeft: 6 }}>To: {message.receivers.join(', ')}</span>}
          <span style={{ fontWeight: 'bold', color: 'black', fontSize: 8, marginRight: 10 }}>{message.sender === username ? '' : message.sender}</span>
          <span style={{ fontSize: 8, color: '#999999' }}>{message.timestamp}</span>
          {message.sender !== username && !message.group && (
            <div style={{ padding: 1, marginLeft: 5, borderRadius: 2, backgroundColor: 'transparent' }} onClick={() => openReplyInput(message.sender)}>
              <FontAwesomeIcon icon={faReply} size="xs" color="black" />
            </div>
          )}
        </div>
        <div style={{ backgroundColor: message.sender === member ? '#DCF8C6' : '#1ce5c7', padding: 10, borderRadius: 10 }}>
          <span style={{ color: 'black' }}>{message.message}</span>
        </div>
      </div>
    </div>
  ))}

      {/* Reply info */}
      {replyInfo && (
        <div style={{ flexDirection: 'row', alignItems: 'center', padding: 2, backgroundColor: '#e6e6e6', borderRadius: 5, marginBottom: 1 }}>
          <span style={{ fontWeight: 'bold', marginRight: 2, fontSize: 8 }}>Replying to: </span>
          <span style={{ color: 'red', fontSize: 8 }}>{replyInfo.username}</span>
        </div>
      )}

      {/* Input area */}
      <div style={styles.inputContainer}>
        <input
          ref={focusedInput && startDirectMessage && directMessageDetails ? inputRef : null}
          type="text"
          style={styles.input}
          placeholder={
            type === 'direct'
              ? focusedInput && startDirectMessage && directMessageDetails
                ? 'Send a direct message to ' + directMessageDetails.name
                : 'Select a message to reply to'
              : eventType === 'chat' ? 'Send a message' : 'Send a message to everyone'
          }
          maxLength={350}
          onChange={(e) => handleTextInputChange(e.target.value)}
          value={type === 'direct' ? directMessageText : groupMessageText}
        />
        <button style={styles.sendButton} onClick={handleSendButton}>
          <FontAwesomeIcon icon={faPaperPlane} size="sm" color="white" />
        </button>
      </div>
    </div>
  );
};

export default MessagePanel;


