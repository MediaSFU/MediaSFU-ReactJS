import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Participant } from "../../@types/types";

export interface ParticipantListOthersItemOptions {
  participant: Participant;
  member: string;
  coHost: string;
}

export type ParticipantListOthersItemType = (
  options: ParticipantListOthersItemOptions
) => JSX.Element;

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

const ParticipantListOthersItem: React.FC<ParticipantListOthersItemOptions> = ({
  participant,
  member,
  coHost,
}) => {
  return (
    <div className="container" style={styles.container}>
      <div className="name-container" style={styles.nameContainer}>
        <span className="name-text" style={styles.nameText}>
          {participant.islevel === "2"
            ? participant.name === member
              ? `${participant.name} (you)`
              : `${participant.name} (host)`
            : participant.name === member
            ? `${participant.name} (you)`
            : coHost === participant.name
            ? `${participant.name} (co-host)`
            : participant.name}
        </span>
      </div>
      <div className="icon-container" style={styles.iconContainer}>
        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: participant.muted ? "red" : "green" }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    marginBottom: "10px",
  },
  nameContainer: {
    flex: 8,
  },
  nameText: {
    fontSize: "16px",
  },
  iconContainer: {
    flex: 4,
    alignItems: "center",
  },
};

export default ParticipantListOthersItem;
