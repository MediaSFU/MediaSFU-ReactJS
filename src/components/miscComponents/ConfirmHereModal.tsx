import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";

// Define the parameter structure for the modal
export interface ConfirmHereModalOptions {
  isConfirmHereModalVisible: boolean;
  onConfirmHereClose: () => void;
  backgroundColor?: string;
  countdownDuration?: number;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  member: string;
}

export type ConfirmHereModalType = (options: ConfirmHereModalOptions) => void;

let countdownInterval: NodeJS.Timeout;

// Countdown function
function startCountdown({
  duration,
  onConfirm,
  onUpdateCounter,
  socket,
  localSocket,
  roomName,
  member,
}: {
  duration: number;
  onConfirm: () => void;
  onUpdateCounter: (timeRemaining: number) => void;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  member: string;
}) {
  let timeRemaining = duration;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    onUpdateCounter(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      socket.emit("disconnectUser", {
        member: member,
        roomName: roomName,
        ban: false,
      });
      try {
        if (localSocket && localSocket.id) {
          localSocket.emit("disconnectUser", {
            member: member,
            roomName: roomName,
            ban: false,
          });
        } 
      } catch  {
        // Do nothing
      }

      onConfirm();
    }
  }, 1000);
}

/**
 * ConfirmHereModal component displays a modal asking the user to confirm their presence.
 *
 * @param {ConfirmHereModalOptions} props - The properties for ConfirmHereModal component.
 * @param {boolean} props.isConfirmHereModalVisible - Determines if the modal is visible.
 * @param {() => void} props.onConfirmHereClose - Function to close the modal.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {number} [props.countdownDuration=120] - Duration of the countdown in seconds.
 * @param {Socket} props.socket - Socket instance for communication.
 * @param {Socket} [props.localSocket] - Local socket instance for communication.
 * @param {string} props.roomName - Name of the room for socket communication.
 * @param {string} props.member - Member information for socket communication.
 *
 * @returns {JSX.Element} The rendered ConfirmHereModal component.
 * 
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const App = () => {
 *   const [isModalVisible, setIsModalVisible] = useState(true);
 *   const socket = io("http://localhost:3000");
 *   const localSocket = io("http://localhost:3001");
 * 
 *   const handleCloseModal = () => setIsModalVisible(false);
 * 
 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={isModalVisible}
 *       onConfirmHereClose={handleCloseModal}
 *       backgroundColor="#83c0e9"
 *       countdownDuration={120}
 *       socket={socket}
 *       localSocket={socket}
 *       roomName="room1"
 *       member="user1"
 *     />
 *   );
 * };
 * 
 * export default App;
 * ```
 */

const ConfirmHereModal: React.FC<ConfirmHereModalOptions> = ({
  isConfirmHereModalVisible,
  onConfirmHereClose,
  backgroundColor = "#83c0e9",
  countdownDuration = 120,
  socket,
  localSocket,
  roomName,
  member,
}) => {
  const [counter, setCounter] = useState<number>(countdownDuration);

  useEffect(() => {
    if (isConfirmHereModalVisible) {
      startCountdown({
        duration: countdownDuration ? countdownDuration : 120,
        onConfirm: onConfirmHereClose,
        onUpdateCounter: setCounter,
        socket,
        localSocket,
        roomName,
        member,
      });
    }
  }, [isConfirmHereModalVisible, countdownDuration, onConfirmHereClose]);

  const handleConfirmHere = () => {
    clearInterval(countdownInterval);
    onConfirmHereClose(); // Close the modal after confirming
  };

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: backgroundColor ? backgroundColor : "rgba(0, 0, 0, 0.5)",
    display: isConfirmHereModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    maxHeight: "100%",
    overflowY: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ textAlign: "center" }}>
          {/* Spinner */}
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ fontSize: "50px", color: "black", marginBottom: "20px" }}
          />
          {/* Modal Content */}
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "black",
            }}
          >
            Are you still there?
          </h2>
          <p
            style={{ fontSize: "1rem", color: "black", marginBottom: "1.5rem" }}
          >
            Please confirm if you are still present.
          </p>
          <p
            style={{ fontSize: "0.9rem", color: "black", marginBottom: "1rem" }}
          >
            Time remaining: <strong>{counter}</strong>
          </p>
          <button
            onClick={handleConfirmHere}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmHereModal;
