import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import MeetingIdComponent from "./MeetingIDComponent";
import MeetingPasscodeComponent from "./MeetingPasscodeComponent";
import ShareButtonsComponent from "./ShareButtonsComponent";
import CustomButtons from "./CustomButtons";
import { CustomButton } from "./CustomButtons";
import { EventType } from "../../@types/types";


// Define props interface
export interface MenuModalOptions {
  backgroundColor?: string;
  isVisible: boolean;
  onClose: () => void;
  customButtons?: CustomButton[];
  shareButtons?: boolean;
  position?: string;
  roomName: string;
  adminPasscode: string;
  islevel: string;
  eventType: EventType;
}
export type MenuModalType = (options: MenuModalOptions) => JSX.Element;

/**
 * MenuModal component displays a modal with various options and buttons.
 *
 * @param {string} backgroundColor - The background color of the modal content.
 * @param {boolean} isVisible - Determines if the modal is visible.
 * @param {() => void} onClose - Function to call when the modal is closed.
 * @param {Array} customButtons - Array of custom buttons to display in the modal.
 * @param {boolean} shareButtons - Determines if share buttons should be displayed.
 * @param {string} position - Position of the modal on the screen (e.g., "bottomRight").
 * @param {string} roomName - The name of the room.
 * @param {string} adminPasscode - The admin passcode for the meeting.
 * @param {string} islevel - The level of the user.
 * @param {string} eventType - The type of event.
 *
 * @returns {JSX.Element} The rendered MenuModal component.
 */
const MenuModal: React.FC<MenuModalOptions> = ({
  backgroundColor = "#83c0e9",
  isVisible,
  onClose,
  customButtons = [],
  shareButtons = true,
  position = "bottomRight",
  roomName,
  adminPasscode,
  islevel,
  eventType,
}) => {
  const screenWidth = window.innerWidth;
  let modalWidth = 0.7 * screenWidth;

  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const modalContainerStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle = {
    position: "fixed" as const,
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "85%", // Set max height here
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
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            <FontAwesomeIcon
              icon={faBars}
              style={{ fontSize: 20, color: "black" }}
            />{" "}
            Menu
          </div>
          <div onClick={onClose} style={{ padding: 5 }}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ fontSize: 20, color: "black" }}
            />
          </div>
        </div>
        <hr
          style={{ height: 1, backgroundColor: "black", marginTop: 5, marginBottom: 5 }}
        />
        <div style={{ flex: 1 }}>
          {/* Wrap the content inside a div with fixed height and overflow auto */}
          <div style={{ maxHeight: "calc(70% - 70px)", overflowY: "auto" }}>
            <div style={{ margin: 0, padding: 0 }}>
              {/* CustomButtons component */}
              <CustomButtons buttons={customButtons} />
              <div
                style={{
                  height: 1,
                  backgroundColor: "#ffffff",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              ></div>
              {/* MeetingPasscodeComponent */}
              {islevel === "2" && (
                <MeetingPasscodeComponent
                  meetingPasscode={adminPasscode}
                />
              )}
              {/* MeetingIdComponent */}
              <div style={{ marginBottom: 10 }}>
                <MeetingIdComponent
                  meetingID={roomName}
                />
              </div>
              {/* ShareButtonsComponent */}
              {shareButtons && (
                <ShareButtonsComponent
                  meetingID={roomName}
                  eventType={eventType}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
