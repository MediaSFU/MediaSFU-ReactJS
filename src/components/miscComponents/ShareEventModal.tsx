import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MeetingIdComponent from "../menuComponents/MeetingIDComponent";
import MeetingPasscodeComponent from "../menuComponents/MeetingPasscodeComponent";
import ShareButtonsComponent from "../menuComponents/ShareButtonsComponent";
import { EventType } from "../../@types/types";

// Define the prop types for ShareEventModal
export interface ShareEventModalOptions {
  backgroundColor?: string;
  isShareEventModalVisible: boolean;
  onShareEventClose: () => void;
  shareButtons?: boolean;
  position?: string;
  roomName: string;
  adminPasscode?: string;
  islevel?: string;
  eventType: EventType;
  localLink?: string;
}

export type ShareEventModalType = (options: ShareEventModalOptions) => void;

/**
 * ShareEventModal component renders a modal for sharing event details.
 * 
 * @param {ShareEventModalOptions} props - The properties object.
 * @param {string} [props.backgroundColor="rgba(255, 255, 255, 0.25)"] - The background color of the modal content.
 * @param {boolean} props.isShareEventModalVisible - Flag to control the visibility of the modal.
 * @param {() => void} props.onShareEventClose - Callback function to handle the closing of the modal.
 * @param {boolean} [props.shareButtons=true] - Flag to control the visibility of share buttons.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} props.roomName - The name of the room to be shared.
 * @param {string} [props.adminPasscode] - The admin passcode for the meeting.
 * @param {string} [props.islevel] - The level of the user.
 * @param {EventType} props.eventType - The type of the event.
 * @param {string} [props.localLink] - The local link for the event.
 * 
 * @returns {React.JSX.Element} The rendered ShareEventModal component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ShareEventModal } from 'mediasfu-reactjs';
 * 
 * const App = () => {
 *   const handleCloseModal = () => console.log("Modal closed");
 * 
 *   return (
 *     <ShareEventModal
 *       backgroundColor="rgba(255, 255, 255, 0.25)"
 *       isShareEventModalVisible={true}
 *       onShareEventClose={handleCloseModal}
 *       shareButtons={true}
 *       position="topRight"
 *       roomName="Room 1"
 *       adminPasscode="1234"
 *       islevel="2"
 *       eventType="meeting"
 *       localLink="http://localhost:3000"
 *     />
 *   );
 * };
 * 
 * export default App;
 * ```
 */


const ShareEventModal: React.FC<ShareEventModalOptions> = ({
  backgroundColor = "rgba(255, 255, 255, 0.25)",
  isShareEventModalVisible,
  onShareEventClose,
  shareButtons = true,
  position = "topRight",
  roomName,
  adminPasscode,
  islevel,
  eventType,
  localLink,
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
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isShareEventModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle = {
    position: "fixed" as const,
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "60%",
    overflowY: "auto" as const, // Add overflow auto for scrollability
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            marginBottom: "15px",
          }}
        >
          <div onClick={handleClose} style={{ padding: "5px" }}>
            <FontAwesomeIcon
              icon={faTimes}
              size="xl"
              style={{ fontSize: "20px", color: "black" }}
            />
          </div>
        </div>
        <hr
          style={{
            height: "1px",
            backgroundColor: "black",
            margin: "5px 0",
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "10px" }}>
            {islevel === "2" && (
              <MeetingPasscodeComponent meetingPasscode={adminPasscode} />
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <MeetingIdComponent meetingID={roomName} />
          </div>
          {shareButtons && (
            <ShareButtonsComponent meetingID={roomName} eventType={eventType} localLink={localLink} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareEventModal;
