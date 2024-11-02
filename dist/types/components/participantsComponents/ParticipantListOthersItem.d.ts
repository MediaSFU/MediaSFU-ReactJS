import React from "react";
import { Participant } from "../../@types/types";
export interface ParticipantListOthersItemOptions {
    participant: Participant;
    member: string;
    coHost: string;
}
export type ParticipantListOthersItemType = (options: ParticipantListOthersItemOptions) => JSX.Element;
/**
 * ParticipantListOthersItem component renders a single participant item, including the participant's name, role, and muted status.
 *
 * @component
 * @param {ParticipantListOthersItemOptions} props - Properties for the component.
 * @param {Object} props.participant - The participant object.
 * @param {string} props.participant.name - Name of the participant.
 * @param {string} props.participant.islevel - Level of the participant (e.g., "2" for host).
 * @param {boolean} props.participant.muted - Whether the participant is muted.
 * @param {string} props.member - Name of the current user/member.
 * @param {string} props.coHost - Name of the co-host.
 *
 * @returns {JSX.Element} The rendered ParticipantListOthersItem component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantListOthersItem } from 'mediasfu-reactjs';
 *
 * const participant = {
 *   name: "Participant 1",
 *   islevel: "1",
 *   muted: false,
 * };
 *
 * <ParticipantListOthersItem
 *   participant={participant}
 *   member="Member 1"
 *   coHost="Co-Host 1"
 * />
 * ```
 */
declare const ParticipantListOthersItem: React.FC<ParticipantListOthersItemOptions>;
export default ParticipantListOthersItem;
//# sourceMappingURL=ParticipantListOthersItem.d.ts.map