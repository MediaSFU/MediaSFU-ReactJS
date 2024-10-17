import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faComment,
  faTrash,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Participant,
  MuteParticipantsType,
  MessageParticipantsType,
  RemoveParticipantsType,
  ShowAlert,
  CoHostResponsibility,
} from "../../@types/types";
import { Socket } from "socket.io-client";

// Define the props for the ParticipantListItem component
export interface ParticipantListItemOptions {
  participant: Participant;
  isBroadcast: boolean;
  onMuteParticipants: MuteParticipantsType;
  onMessageParticipants: MessageParticipantsType;
  onRemoveParticipants: RemoveParticipantsType;
  socket: Socket;
  coHostResponsibility: CoHostResponsibility[];
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
  coHost: string;
  roomName: string;
  updateIsMessagesModalVisible: (isVisible: boolean) => void;
  updateDirectMessageDetails: (participant: Participant | null) => void;
  updateStartDirectMessage: (start: boolean) => void;
  participants: Participant[];
  updateParticipants: (participants: Participant[]) => void;
}

export type ParticipantListItemType = (
  options: ParticipantListItemOptions
) => JSX.Element;

/**
 * ParticipantListItem component renders a list item for a participant with various controls.
 *
 * @component
 * @param {ParticipantListItemOptions} props - The properties for the component.
 * @param {Object} props.participant - The participant object.
 * @param {boolean} props.isBroadcast - Flag indicating if it is a broadcast.
 * @param {Function} props.onMuteParticipants - Function to mute participants.
 * @param {Function} props.onMessageParticipants - Function to message participants.
 * @param {Function} props.onRemoveParticipants - Function to remove participants.
 * @param {Object} props.socket - The socket object for communication.
 * @param {boolean} props.coHostResponsibility - Flag indicating co-host responsibility.
 * @param {Object} props.member - The member object.
 * @param {boolean} props.islevel - Flag indicating the level of the participant.
 * @param {Function} props.showAlert - Function to show alerts.
 * @param {boolean} props.coHost - Flag indicating if the participant is a co-host.
 * @param {string} props.roomName - The name of the room.
 * @param {Function} props.updateIsMessagesModalVisible - Function to update message modal visibility.
 * @param {Function} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} props.updateStartDirectMessage - Function to start a direct message.
 * @param {Array} props.participants - Array of participants.
 * @param {Function} props.updateParticipants - Function to update participants.
 * @returns {JSX.Element} The rendered component.
 */
const ParticipantListItem: React.FC<ParticipantListItemOptions> = ({
  participant,
  isBroadcast,
  onMuteParticipants,
  onMessageParticipants,
  onRemoveParticipants,
  socket,
  coHostResponsibility,
  member,
  islevel,
  showAlert,
  coHost,
  roomName,
  updateIsMessagesModalVisible,
  updateDirectMessageDetails,
  updateStartDirectMessage,
  participants,
  updateParticipants,
}) => {
  /**
   * Returns the icon name based on whether the participant is muted or not.
   * @returns {string} - The icon name.
   */
  const getIconName = () =>
    participant.muted ? faMicrophoneSlash : faMicrophone;

  return (
    <div
      className="container"
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "0px",
        marginTop: "0px",
      }}
    >
      <div className="nameContainer" style={{ flex: "4" }}>
        <p className="nameText" style={{ fontSize: "16px" }}>
          {participant.islevel === "2"
            ? `${participant.name} (host)`
            : participant.name}
        </p>
      </div>
      {!isBroadcast && (
        <>
          <div
            className="iconContainer"
            style={{ flex: "1", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faDotCircle}
              style={{
                fontSize: "20px",
                color: participant.muted ? "red" : "green",
              }}
            />
          </div>
          <div
            className="buttonContainer"
            style={{ flex: "2", alignItems: "flex-end" }}
          >
            <button
              onClick={() =>
                onMuteParticipants({
                  socket,
                  coHostResponsibility,
                  participant,
                  member,
                  islevel,
                  showAlert,
                  coHost,
                  roomName,
                })
              }
              style={{
                padding: "5px",
                borderRadius: "5px",
                alignItems: "center",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              <FontAwesomeIcon
                icon={getIconName()}
                style={{ fontSize: "20px" }}
              />
            </button>
          </div>
          <div
            className="buttonContainer"
            style={{ flex: "2", alignItems: "flex-end" }}
          >
            <button
              onClick={() =>
                onMessageParticipants({
                  coHostResponsibility,
                  participant,
                  member,
                  islevel,
                  showAlert,
                  coHost,
                  updateIsMessagesModalVisible,
                  updateDirectMessageDetails,
                  updateStartDirectMessage,
                })
              }
              style={{
                padding: "5px",
                borderRadius: "5px",
                alignItems: "center",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              <FontAwesomeIcon
                icon={faComment}
                style={{ fontSize: "20px", color: "white" }}
              />
            </button>
          </div>
        </>
      )}
      <div
        className="buttonContainer"
        style={{ flex: "2", alignItems: "flex-end" }}
      >
        <button
          onClick={() =>
            onRemoveParticipants({
              coHostResponsibility,
              participant,
              member,
              islevel,
              showAlert,
              coHost,
              participants,
              socket,
              roomName,
              updateParticipants,
            })
          }
          style={{
            padding: "5px",
            borderRadius: "5px",
            alignItems: "center",
            backgroundColor: "#dc3545",
            color: "white",
          }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            style={{ fontSize: "20px", color: "white" }}
          />
        </button>
      </div>
    </div>
  );
};

export default ParticipantListItem;
