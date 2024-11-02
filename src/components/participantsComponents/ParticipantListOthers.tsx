import React from "react";
import ParticipantListOthersItem from "./ParticipantListOthersItem";
import { Participant } from "../../@types/types";

export interface ParticipantListOthersOptions {
  participants: Participant[];
  coHost: string;
  member: string;
}

export type ParticipantListOthersType = (
  options: ParticipantListOthersOptions
) => JSX.Element;

/**
 * ParticipantListOthers component renders a list of participants, each displayed using the `ParticipantListOthersItem` component.
 * A separator line is added between each participant except the last one.
 *
 * @component
 * @param {ParticipantListOthersOptions} props - The properties for the component.
 * @param {Participant[]} props.participants - Array of participants to display.
 * @param {string} props.coHost - Indicates the co-host's identifier.
 * @param {string} props.member - Indicates the member's identifier.
 *
 * @returns {JSX.Element} The rendered ParticipantListOthers component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantListOthers } from 'mediasfu-reactjs';
 * 
 * const participants = [
 *   { name: "Participant 1", videoOn: true, audioOn: true, muted: false, id: "1" },
 *   { name: "Participant 2", videoOn: true, audioOn: true, muted: false, id: "2" }
 * ];
 *
 * <ParticipantListOthers
 *   participants={participants}
 *   coHost="coHost123"
 *   member="member123"
 * />
 * ```
 */

const ParticipantListOthers: React.FC<ParticipantListOthersOptions> = ({
  participants,
  coHost,
  member,
}) => {
  return (
    <div>
      {participants.map((participant, index) => (
        <React.Fragment key={participant.name}>
          <ParticipantListOthersItem
            participant={participant}
            coHost={coHost}
            member={member}
          />
          {index < participants.length - 1 && <hr className="separator" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ParticipantListOthers;
