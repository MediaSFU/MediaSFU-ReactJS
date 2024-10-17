import React from "react";
import { Participant } from "../../@types/types";
export interface ParticipantListOthersItemOptions {
    participant: Participant;
    member: string;
    coHost: string;
}
export type ParticipantListOthersItemType = (options: ParticipantListOthersItemOptions) => JSX.Element;
/**
 * Component representing an item in the participant list for others.
 *
 * @component
 * @param {ParticipantListOthersItemOptions} props - The properties for the component.
 * @param {Object} props.participant - The participant object.
 * @param {string} props.participant.name - The name of the participant.
 * @param {string} props.participant.islevel - The level of the participant.
 * @param {boolean} props.participant.muted - The muted status of the participant.
 * @param {string} props.member - The name of the current member.
 * @param {string} props.coHost - The name of the co-host.
 * @returns {JSX.Element} The rendered component.
 */
declare const ParticipantListOthersItem: React.FC<ParticipantListOthersItemOptions>;
export default ParticipantListOthersItem;
//# sourceMappingURL=ParticipantListOthersItem.d.ts.map