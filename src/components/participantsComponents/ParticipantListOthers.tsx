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
 * Component that renders a list of participants with optional co-host and member status.
 * Each participant is rendered using the `ParticipantListOthersItem` component.
 * A separator line is added between each participant except the last one.
 *
 * @component
 * @param {ParticipantListOthersOptions} props - The properties for the component.
 * @param {Array<Participant>} props.participants - The list of participants to display.
 * @param {boolean} props.coHost - Indicates if the co-host status should be displayed.
 * @param {boolean} props.member - Indicates if the member status should be displayed.
 * @returns {JSX.Element} The rendered component.
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
