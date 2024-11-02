import React from "react";
import ParticipantListItem from "./ParticipantListItem";
import { Participant, MuteParticipantsType, MessageParticipantsType, RemoveParticipantsType, CoHostResponsibility, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";

// Define the props for the component
export interface ParticipantListOptions {
  participants: Participant[];
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
  updateParticipants: (participants: Participant[]) => void;
}

export type ParticipantListType = (options: ParticipantListOptions) => JSX.Element;

/**
 * ParticipantList component renders a list of participants with various interaction options.
 *
 * @param {ParticipantListOptions} props - The properties for the ParticipantList component.
 * @param {Participant[]} props.participants - Array of participant objects to be displayed.
 * @param {boolean} props.isBroadcast - Boolean indicating if the session is a broadcast.
 * @param {MuteParticipantsType} props.onMuteParticipants - Function to handle muting participants.
 * @param {MessageParticipantsType} props.onMessageParticipants - Function to handle messaging participants.
 * @param {RemoveParticipantsType} props.onRemoveParticipants - Function to handle removing participants.
 * @param {Socket} props.socket - WebSocket connection for real-time communication.
 * @param {CoHostResponsibility[]} props.coHostResponsibility - Array of co-host responsibilities.
 * @param {string} props.member - Current member information.
 * @param {string} props.islevel - Level of the participant.
 * @param {ShowAlert} [props.showAlert] - Function to show alerts.
 * @param {string} props.coHost - Username or ID of the co-host.
 * @param {string} props.roomName - Name of the room.
 * @param {Function} props.updateIsMessagesModalVisible - Function to update the visibility of the messages modal.
 * @param {Function} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} props.updateStartDirectMessage - Function to initiate a direct message.
 * @param {Function} props.updateParticipants - Function to update the participants list.
 *
 * @returns {JSX.Element} The rendered ParticipantList component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantList } from 'mediasfu-reactjs';
 * 
 * const participants = [
 *   { name: "Participant 1", videoOn: true, audioOn: true, muted: false, id: "1" },
 *   { name: "Participant 2", videoOn: true, audioOn: true, muted: false, id: "2" },
 * ];
 * 
 * const handleMuteParticipants = (id) => console.log(`Mute participant: ${id}`);
 * const handleMessageParticipants = (id) => console.log(`Message participant: ${id}`);
 * const handleRemoveParticipants = (id) => console.log(`Remove participant: ${id}`);
 * const updateIsMessagesModalVisible = (isVisible) => console.log(`Messages modal visible: ${isVisible}`);
 * const updateDirectMessageDetails = (participant) => console.log(`Direct message details: ${participant}`);
 * const updateStartDirectMessage = (start) => console.log(`Start direct message: ${start}`);
 * const updateParticipants = (participants) => console.log(`Update participants: ${participants}`);
 * 
 * <ParticipantList
 *   participants={participants}
 *   isBroadcast={true}
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
 *   updateIsMessagesModalVisible={updateIsMessagesModalVisible}
 *   updateDirectMessageDetails={updateDirectMessageDetails}
 *   updateStartDirectMessage={updateStartDirectMessage}
 *   updateParticipants={updateParticipants}
 * />
 * ```
 */

const ParticipantList: React.FC<ParticipantListOptions> = ({
  participants,
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
  updateParticipants,
}) => {
  return (
    <div>
      {participants.map((participant, index) => (
        <React.Fragment key={participant.name}>
          <ParticipantListItem
            participant={participant}
            isBroadcast={isBroadcast}
            onMuteParticipants={onMuteParticipants}
            onMessageParticipants={onMessageParticipants}
            onRemoveParticipants={onRemoveParticipants}
            socket={socket}
            coHostResponsibility={coHostResponsibility}
            member={member}
            islevel={islevel}
            showAlert={showAlert}
            coHost={coHost}
            roomName={roomName}
            updateIsMessagesModalVisible={updateIsMessagesModalVisible}
            updateDirectMessageDetails={updateDirectMessageDetails}
            updateStartDirectMessage={updateStartDirectMessage}
            participants={participants}
            updateParticipants={updateParticipants}

          />
          {index < participants.length - 1 && <hr className="separator" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ParticipantList;
