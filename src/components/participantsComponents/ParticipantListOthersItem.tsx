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
