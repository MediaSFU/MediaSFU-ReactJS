import React from "react";
import { Participant, MuteParticipantsType, MessageParticipantsType, RemoveParticipantsType, CoHostResponsibility, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
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
declare const ParticipantList: React.FC<ParticipantListOptions>;
export default ParticipantList;
//# sourceMappingURL=ParticipantList.d.ts.map