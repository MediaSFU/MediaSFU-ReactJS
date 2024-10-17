import React, { useEffect, useState, useRef } from "react";
import MessagePanel from "./MessagePanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  sendMessage,
  SendMessageOptions,
} from "../../methods/messageMethods/sendMessage";
import {
  CoHostResponsibility,
  EventType,
  Message,
  Participant,
  ShowAlert,
} from "../../@types/types";
import { Socket } from "socket.io-client";

// Define component props
export interface MessagesModalOptions {
  isMessagesModalVisible: boolean;
  onMessagesClose: () => void;
  onSendMessagePress?: (options: SendMessageOptions) => Promise<void>;
  messages: Message[];
  position?: string;
  backgroundColor?: string;
  activeTabBackgroundColor?: string;
  eventType: EventType;
  member: string;
  islevel: string;
  coHostResponsibility: CoHostResponsibility[];
  coHost: string;
  startDirectMessage: boolean;
  directMessageDetails: Participant | null;
  updateStartDirectMessage: (start: boolean) => void;
  updateDirectMessageDetails: (participant: Participant | null) => void;
  showAlert?: ShowAlert;
  roomName: string;
  socket: Socket;
  chatSetting: string;
}

export type MessagesModalType = (options: MessagesModalOptions) => void;

/**
 * MessagesModal component displays a modal for direct and group messages.
 * 
 * @param {boolean} isMessagesModalVisible - Determines if the modal is visible.
 * @param {() => void} onMessagesClose - Function to close the modal.
 * @param {Function} [onSendMessagePress=sendMessage] - Function to handle sending messages.
 * @param {Message[]} messages - Array of message objects.
 * @param {string} [position="topRight"] - Position of the modal on the screen.
 * @param {string} [backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {string} [activeTabBackgroundColor="#2b7ce5"] - Background color of the active tab.
 * @param {string} eventType - Type of the event (e.g., webinar, conference, broadcast, chat).
 * @param {string} member - Current member's username.
 * @param {string} islevel - Level of the user.
 * @param {Array} coHostResponsibility - Array of co-host responsibilities.
 * @param {string} coHost - Co-host's username.
 * @param {boolean} startDirectMessage - Flag to start a direct message.
 * @param {Object} directMessageDetails - Details of the direct message.
 * @param {Function} updateStartDirectMessage - Function to update the start direct message flag.
 * @param {Function} updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} showAlert - Function to show alerts.
 * @param {string} roomName - Name of the chat room.
 * @param {Object} socket - Socket object for real-time communication.
 * @param {Object} chatSetting - Settings for the chat.
 * 
 * @returns {JSX.Element} The rendered MessagesModal component.
 */
const MessagesModal: React.FC<MessagesModalOptions> = ({
  isMessagesModalVisible,
  onMessagesClose,
  onSendMessagePress = sendMessage,
  messages,
  position = "topRight",
  backgroundColor = "#f5f5f5",
  activeTabBackgroundColor = "#2b7ce5",
  eventType,
  member,
  islevel,
  coHostResponsibility,
  coHost,
  startDirectMessage,
  directMessageDetails,
  updateStartDirectMessage,
  updateDirectMessageDetails,
  showAlert,
  roomName,
  socket,
  chatSetting,
}) => {
  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const activeTab = useRef<string>(
    eventType === "webinar" || eventType === "conference" ? "direct" : "group"
  );
  const [focusedInput, setFocusedInput] = useState<boolean>(false);
  const [reRender, setReRender] = useState<boolean>(false);

  const switchToDirectTab = () => {
    activeTab.current = "direct";
    setReRender(!reRender);
  };

  const switchToGroupTab = () => {
    activeTab.current = "group";
    setReRender(!reRender);
  };

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isMessagesModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth,
    maxHeight: "75%",
    overflowY: "auto",
    overflowX: "hidden",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  useEffect(() => {
    const chatValue = coHostResponsibility?.find(
      (item: { name: string }) => item.name === "chat"
    )?.value;

    const populateMessages = () => {
      const directMsgs = messages.filter(
        (message) =>
          !message.group &&
          (message.sender === member ||
            message.receivers.includes(member) ||
            islevel === "2" ||
            (coHost === member && chatValue === true))
      );
      setDirectMessages(directMsgs);

      const groupMsgs = messages.filter((message) => message.group);
      setGroupMessages(groupMsgs);
    };

    if (isMessagesModalVisible) {
      populateMessages();
    }
  }, [
    coHost,
    coHostResponsibility,
    isMessagesModalVisible,
    islevel,
    member,
    messages,
  ]);

  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
      if (eventType === "webinar" || eventType === "conference") {
        activeTab.current = "direct";
        setFocusedInput(true);
      }
    } else if (eventType === "broadcast" || eventType === "chat") {
      activeTab.current = "group";
    }
  }, [startDirectMessage, directMessageDetails, eventType]);

  useEffect(() => {}, [reRender]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          style={{
            ...styles.modalContent,
            backgroundColor: backgroundColor,
            width: modalWidth,
          }}
        >
          <div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {eventType === "webinar" || eventType === "conference" ? (
              <>
                <button
                  onClick={switchToDirectTab}
                  style={{
                    ...styles.tabText,
                    ...(activeTab.current === "direct" && styles.activeTabText),
                    ...(activeTab.current === "direct" && {
                      backgroundColor: activeTabBackgroundColor,
                    }),
                  }}
                >
                  Direct
                </button>
                <button
                  onClick={switchToGroupTab}
                  style={{
                    ...styles.tabText,
                    ...(activeTab.current === "group" && styles.activeTabText),
                    ...(activeTab.current === "group" && {
                      backgroundColor: activeTabBackgroundColor,
                    }),
                  }}
                >
                  Group
                </button>
              </>
            ) : null}

            <span
              style={{
                ...styles.btnCloseMessages,
                marginLeft:
                  eventType === "webinar" || eventType === "conference"
                    ? "30%"
                    : "85%",
              }}
              onClick={onMessagesClose}
            >
              <FontAwesomeIcon icon={faTimes} className="icon" size="xl" />
            </span>
          </div>

          <hr style={{ ...styles.separator }} />

          <div style={styles.modalBody}>
            {activeTab.current === "direct" &&
              (eventType === "webinar" || eventType === "conference") && (
                <MessagePanel
                  messages={directMessages}
                  messagesLength={messages.length}
                  type="direct"
                  onSendMessagePress={onSendMessagePress}
                  username={member}
                  backgroundColor={backgroundColor}
                  focusedInput={focusedInput}
                  showAlert={showAlert}
                  eventType={eventType}
                  member={member}
                  islevel={islevel}
                  coHostResponsibility={coHostResponsibility}
                  coHost={coHost}
                  directMessageDetails={directMessageDetails}
                  updateStartDirectMessage={updateStartDirectMessage}
                  updateDirectMessageDetails={updateDirectMessageDetails}
                  roomName={roomName}
                  socket={socket}
                  chatSetting={chatSetting}
                  startDirectMessage={startDirectMessage}
                />
              )}

            {activeTab.current === "group" && (
              <MessagePanel
                messages={groupMessages}
                messagesLength={messages.length}
                type="group"
                onSendMessagePress={onSendMessagePress}
                username={member}
                backgroundColor={backgroundColor}
                focusedInput={false}
                showAlert={showAlert}
                eventType={eventType}
                member={member}
                islevel={islevel}
                coHostResponsibility={coHostResponsibility}
                coHost={coHost}
                directMessageDetails={directMessageDetails}
                updateStartDirectMessage={updateStartDirectMessage}
                updateDirectMessageDetails={updateDirectMessageDetails}
                roomName={roomName}
                socket={socket}
                chatSetting={chatSetting}
                startDirectMessage={startDirectMessage}
              />
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
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 10,
  },
  activeTabText: {
    color: "#ffffff",
    backgroundColor: "#2b7ce5",
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 1,
  },
  btnCloseMessages: {
    padding: 5,
    marginRight: 0,
    paddingRight: 0,
  },
  icon: {
    fontSize: 24,
    color: "black",
  },
};

export default MessagesModal;
