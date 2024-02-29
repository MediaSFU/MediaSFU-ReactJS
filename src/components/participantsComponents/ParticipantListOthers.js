import React from 'react';
import ParticipantListOthersItem from './ParticipantListOthersItem';

/**
 * ParticipantListOthers - A React component representing a list of other participants.
 * @param {Object} props - The props passed to the ParticipantListOthers.
 * @param {Array} props.participants - An array of participant objects.
 * @param {Object} props.parameters - Additional parameters for the participant list.
 * @returns {React.Component} - The ParticipantListOthers.
 */
const ParticipantListOthers = ({ participants, parameters }) => {
  return (
    <div>
      {participants.map((participant, index) => (
        <React.Fragment key={participant.name}>
          <ParticipantListOthersItem
            participant={participant}
            parameters={parameters}
          />
          {index < participants.length - 1 && <hr className="separator" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ParticipantListOthers;
