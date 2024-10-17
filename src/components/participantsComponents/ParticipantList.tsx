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
