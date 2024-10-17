import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * ParticipantListOthersItem - A React component representing an item in the list of other participants.
 * @param {Object} props - The props passed to the ParticipantListOthersItem.
 * @param {Object} props.participant - The participant object containing details.
 * @param {Object} props.parameters - Additional parameters for the participant item.
 * @returns {React.Component} - The ParticipantListOthersItem.
 */
const ParticipantListOthersItem = ({ participant, parameters }) => {
  const { member, coHost, islevel } = parameters;

  return (
    <div className="container" style={styles.container}>
      <div className="name-container" style={styles.nameContainer}>
        <span className="name-text" style={styles.nameText}>
          {participant.islevel === '2'
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
        <FontAwesomeIcon icon={faCircle} style={{ color: participant.muted ? 'red' : 'green' }} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  },
  nameContainer: {
    flex: 8,
  },
  nameText: {
    fontSize: '16px',
  },
  iconContainer: {
    flex: 4,
    alignItems: 'center',
  },
};

export default ParticipantListOthersItem;
