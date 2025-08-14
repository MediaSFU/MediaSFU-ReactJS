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
) => React.JSX.Element;

/**
 * ParticipantListItem component renders a list item for a participant with various controls.
 *
 * @component
 * @param {ParticipantListItemOptions} props - The properties for the component.
 * @param {Participant} props.participant - The participant object.
 * @param {boolean} props.isBroadcast - Flag indicating if it is a broadcast.
 * @param {MuteParticipantsType} props.onMuteParticipants - Function to mute participants.
 * @param {MessageParticipantsType} props.onMessageParticipants - Function to message participants.
 * @param {RemoveParticipantsType} props.onRemoveParticipants - Function to remove participants.
 * @param {Socket} props.socket - The socket object for communication.
 * @param {CoHostResponsibility[]} props.coHostResponsibility - Array indicating co-host responsibilities.
 * @param {string} props.member - The current member's username or ID.
 * @param {string} props.islevel - Level of the participant.
 * @param {ShowAlert} [props.showAlert] - Function to show alerts.
 * @param {string} props.coHost - Username or ID of the co-host.
 * @param {string} props.roomName - The name of the room.
 * @param {Function} props.updateIsMessagesModalVisible - Function to update message modal visibility.
 * @param {Function} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} props.updateStartDirectMessage - Function to start a direct message.
 * @param {Participant[]} props.participants - Array of participants.
 * @param {Function} props.updateParticipants - Function to update the participants list.
 * @returns {React.JSX.Element} The rendered ParticipantListItem component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantListItem } from 'mediasfu-reactjs';
 * 
 * const participant = {
 *   name: "Participant 1",
 *   videoOn: true,
 *   audioOn: true,
 *   muted: false,
 *   id: "1",
 *   islevel: "1"
 * };
 * 
 * const handleMuteParticipants = (options) => console.log("Mute participant", options.participant);
 * const handleMessageParticipants = (options) => console.log("Message participant", options.participant);
 * const handleRemoveParticipants = (options) => console.log("Remove participant", options.participant);
 * 
 * <ParticipantListItem
 *   participant={participant}
 *   isBroadcast={false}
 *   onMuteParticipants={handleMuteParticipants}
 *   onMessageParticipants={handleMessageParticipants}
 *   onRemoveParticipants={handleRemoveParticipants}
 *   socket={socket}
 *   coHostResponsibility={[]}
 *   member="user123"
 *   islevel="1"
 *   showAlert={(message) => console.log(message)}
 *   coHost="host123"
 *   roomName="Room 1"
 *   updateIsMessagesModalVisible={(isVisible) => console.log(isVisible)}
 *   updateDirectMessageDetails={(participant) => console.log(participant)}
 *   updateStartDirectMessage={(start) => console.log(start)}
 *   participants={[participant]}
 *   updateParticipants={(updatedList) => console.log(updatedList)}
 * />
 * ```
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
