

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  respondToWaiting,
  RespondToWaitingType,
} from "../../methods/waitingMethods/respondToWaiting";
import "./WaitingRoomModal.css";
import { WaitingRoomParticipant } from "../../@types/types";
import { Socket } from "socket.io-client";

export interface WaitingRoomModalParameters {
  filteredWaitingRoomList: WaitingRoomParticipant[];

  // mediasfu functions
  getUpdatedAllParams: () => WaitingRoomModalParameters;
  [key: string]: any;
}

export interface WaitingRoomModalOptions {
  isWaitingModalVisible: boolean;
  onWaitingRoomClose: () => void;
  waitingRoomCounter: number;
  onWaitingRoomFilterChange: (filter: string) => void;
  waitingRoomList: WaitingRoomParticipant[];
  updateWaitingList: (updatedList: WaitingRoomParticipant[]) => void;
  roomName: string;
  socket: Socket;
  position?: string;
  backgroundColor?: string;
  parameters: WaitingRoomModalParameters;

  // mediasfu functions
  onWaitingRoomItemPress?: RespondToWaitingType;
}

export type WaitingRoomModalType = (options: WaitingRoomModalOptions) => JSX.Element;

/**
 * A modal component for displaying a waiting room list with participants.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isWaitingModalVisible - Flag to control the visibility of the modal.
 * @param {Function} props.onWaitingRoomClose - Callback function to handle closing the modal.
 * @param {number} props.waitingRoomCounter - Initial count of participants in the waiting room.
 * @param {Function} props.onWaitingRoomFilterChange - Callback function to handle changes in the search input.
 * @param {Array<WaitingRoomParticipant>} props.waitingRoomList - Initial list of participants in the waiting room.
 * @param {Function} props.updateWaitingList - Function to update the waiting list.
 * @param {string} props.roomName - Name of the room.
 * @param {Object} props.socket - Socket instance for real-time communication.
 * @param {Function} [props.onWaitingRoomItemPress=respondToWaiting] - Callback function to handle participant item press.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {Object} props.parameters - Additional parameters for the modal.
 * 
 * @returns {JSX.Element} The rendered modal component.
 */
const WaitingRoomModal: React.FC<WaitingRoomModalOptions> = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  waitingRoomList,
  updateWaitingList,
  roomName,
  socket,
  onWaitingRoomItemPress = respondToWaiting,
  position = "topRight",
  backgroundColor = "#83c0e9",
  parameters,
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
    display: isWaitingModalVisible ? "block" : "none",
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

  const inputStyle: React.CSSProperties = {
    width: "90%",
    padding: 10,
    borderRadius: 5,
    border: "1px solid #000",
    fontSize: 16,
    marginBottom: 10,
  };

  const [waitingRoomList_s, setWaitingRoomList_s] =
    useState<WaitingRoomParticipant[]>(waitingRoomList);
  const [waitingRoomCounter_s, setWaitingRoomCounter_s] =
    useState<number>(waitingRoomCounter);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    let { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams();

    setWaitingRoomList_s(parameters.filteredWaitingRoomList);
    setWaitingRoomCounter_s(parameters.filteredWaitingRoomList.length);
  }, [waitingRoomList, reRender]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">
            Waiting{" "}
            <span
              style={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 10,
                padding: 5,
              }}
              className="badge"
            >
              {waitingRoomCounter_s}
            </span>
          </div>
          <div onClick={onWaitingRoomClose} className="btn-close-waitings">
            <FontAwesomeIcon icon={faTimes} className="icon" />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <input
              style={inputStyle}
              placeholder="Search ..."
              onChange={(e) => {
                onWaitingRoomFilterChange(e.target.value);
                setReRender(!reRender);
              }}
            />
          </div>
          <div className="waiting-list">
            {waitingRoomList_s &&
              waitingRoomList_s.map((participant, index) => (
                <div
                  key={index}
                  className="waiting-item"
                  style={{ marginTop: 5, flexDirection: "row", flex: 1 }}
                >
                  <div className="col7">{participant.name}</div>
                  <div className="col2">
                    <button
                      onClick={() =>
                        onWaitingRoomItemPress({
                          participantId: participant.id,
                          participantName: participant.name,
                          updateWaitingList,
                          waitingList: waitingRoomList,
                          roomName,
                          type: true, // accepted
                          socket: socket,
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
                    </button>
                  </div>
                  <div className="col2">
                    <button
                      onClick={() =>
                        onWaitingRoomItemPress({
                          participantId: participant.id,
                          participantName: participant.name,
                          updateWaitingList,
                          waitingList: waitingRoomList,
                          roomName,
                          type: false, // rejected
                          socket: socket,
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
                    </button>
                  </div>
                  <div className="col1"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomModal;
