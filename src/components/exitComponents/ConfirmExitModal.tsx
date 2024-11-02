import React from "react";
import {
  confirmExit,
  ConfirmExitOptions,
} from "../../methods/exitMethods/confirmExit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";

// Define the prop types using TypeScript interface
export interface ConfirmExitModalOptions {
  isConfirmExitModalVisible: boolean;
  onConfirmExitClose: () => void;
  position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
  backgroundColor?: string;
  exitEventOnConfirm?: (options: ConfirmExitOptions) => void;
  member: string;
  ban?: boolean;
  roomName: string;
  socket: Socket;
  islevel: string;
}

export type ConfirmExitModalType = (
  options: ConfirmExitModalOptions
) => JSX.Element;

/**
 * ConfirmExitModal component renders a modal dialog to confirm the exit action.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isConfirmExitModalVisible - Flag to control the visibility of the modal.
 * @param {function} props.onConfirmExitClose - Callback function to close the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {function} [props.exitEventOnConfirm=confirmExit] - Event handler function to be called on confirming exit.
 * @param {string} props.member - Name of the member exiting.
 * @param {boolean} props.ban - Flag indicating if the member is banned.
 * @param {string} props.roomName - Name of the room.
 * @param {Object} props.socket - Socket object for communication.
 * @param {string} props.islevel - Level of the user.
 *
 * @returns {JSX.Element} The ConfirmExitModal component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ConfirmExitModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const App = () => {
 *   const socket = io("http://localhost:3000");
 * 
 *   const handleCloseModal = () => console.log("Modal closed");
 *   const confirmExit = async (options) => console.log("Exit confirmed", options);
 * 
 *   return (
 *     <ConfirmExitModal
 *       isConfirmExitModalVisible={true}
 *       onConfirmExitClose={handleCloseModal}
 *       exitEventOnConfirm={confirmExit}
 *       member="John Doe"
 *       ban={false}
 *       roomName="Room 1"
 *       socket={socket}
 *       islevel="2"
 *       position="topRight"
 *       backgroundColor="#83c0e9"
 *     />
 *   );
 * };
 * 
 * export default App;
 * ```
 */
const ConfirmExitModal: React.FC<ConfirmExitModalOptions> = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  position = "topRight",
  backgroundColor = "#83c0e9",
  exitEventOnConfirm = confirmExit,
  member,
  ban,
  roomName,
  socket,
  islevel,
}) => {
  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isConfirmExitModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "65%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  const handleConfirmExit = () => {
    exitEventOnConfirm({
      socket: socket,
      member: member,
      roomName: roomName,
      ban: ban,
    });
    onConfirmExitClose();
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="modal-title">Confirm Exit</h2>
          <span
            onClick={onConfirmExitClose}
            style={{
              cursor: "pointer",
              marginRight: "20px",
              color: "black",
              fontSize: "large",
              fontWeight: "bold",
            }}
          >
            <FontAwesomeIcon icon={faTimes} size={"lg"} />
          </span>
        </div>
        <hr />
        <div className="modal-body">
          <p className="confirm-exit-text">
            {islevel === "2"
              ? "This will end the event for all. Confirm exit."
              : "Are you sure you want to exit?"}
          </p>
        </div>
        <hr />
        <div className="modal-footer">
          <button
            style={{
              marginRight: "20px",
              borderRadius: 5,
              backgroundColor: "black",
              color: "white",
              padding: "5px 10px",
            }}
            onClick={onConfirmExitClose}
          >
            Cancel
          </button>

          <span>
            <button
              style={{
                marginLeft: "20px",
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
              }}
              onClick={handleConfirmExit}
            >
              {islevel === "2" ? "End Event" : "Exit"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
