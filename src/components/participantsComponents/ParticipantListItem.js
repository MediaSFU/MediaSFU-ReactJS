import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faComment, faTrash, faDotCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * ParticipantListItem - A React component representing an item in the participant list.
 * @param {Object} props - The props passed to the ParticipantListItem.
 * @param {Object} props.participant - The participant object containing information about the participant.
 * @param {boolean} props.isBroadcast - Flag indicating whether the list is for a broadcast.
 * @param {function} props.onMuteParticipants - Callback function to mute participants.
 * @param {function} props.onMessageParticipants - Callback function to message participants.
 * @param {function} props.onRemoveParticipants - Callback function to remove participants.
 * @param {function} props.formatBroadcastViews - Callback function to format broadcast views.
 * @param {Object} props.parameters - Additional parameters for the participant list.
 * @returns {React.Component} - The ParticipantListItem.
 */
const ParticipantListItem = ({
  participant,
  isBroadcast,
  onMuteParticipants,
  onMessageParticipants,
  onRemoveParticipants,
  formatBroadcastViews,
  parameters,
}) => {
  const {
    coHostResponsibility,
    coHost,
    member,
    islevel,
    showAlert,
    participants,
    roomName,
  } = parameters;

  /**
   * Returns the icon name based on whether the participant is muted or not.
   * @returns {string} - The icon name.
   */
  const getIconName = () => (participant.muted ? faMicrophoneSlash : faMicrophone);

  return (
    <div className="container" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '0px' , marginTop: '0px'}}>
      <div className="nameContainer" style={{ flex: '4' }}>
        <p className="nameText" style={{ fontSize: '16px' }}>
          {participant.islevel === '2' ? `${participant.name} (host)` : participant.name}
        </p>
      </div>
      {!isBroadcast && (
        <>
          <div className="iconContainer" style={{ flex: '1', alignItems: 'center' }}>
            <FontAwesomeIcon
              icon={participant.muted ? faDotCircle : faDotCircle}
              style={{ fontSize: '20px', color: participant.muted ? 'red' : 'green' }}
            />
          </div>
          <div className="buttonContainer" style={{ flex: '2', alignItems: 'flex-end' }}>
            <button
              onClick={() =>
                onMuteParticipants({
                  parameters: {
                    ...parameters,
                    participant: participant,
                  },
                })
              }
              style={{ padding: '5px', borderRadius: '5px', alignItems: 'center', backgroundColor: '#007bff', color: 'white' }}
            >
              <FontAwesomeIcon
                icon={getIconName()}
                style={{ fontSize: '20px' }}
              />
            </button>
          </div>
          <div className="buttonContainer" style={{ flex: '2', alignItems: 'flex-end' }}>
            <button
              onClick={() =>
                onMessageParticipants({
                  parameters: {
                    ...parameters,
                    participant: participant,
                  },
                })
              }
              style={{ padding: '5px', borderRadius: '5px', alignItems: 'center', backgroundColor: '#007bff', color: 'white' }}
            >
              <FontAwesomeIcon icon={faComment} style={{ fontSize: '20px', color: 'white' }} />
            </button>
          </div>
        </>
      )}
      <div className="buttonContainer" style={{ flex: '2', alignItems: 'flex-end' }}>
        <button
          onClick={() =>
            onRemoveParticipants({
              parameters: {
                ...parameters,
                participant: participant,
              },
            })
          }
          style={{ padding: '5px', borderRadius: '5px', alignItems: 'center', backgroundColor: '#dc3545', color: 'white' }}
        >
          <FontAwesomeIcon icon={faTrash} style={{ fontSize: '20px', color: 'white' }} />
        </button>
      </div>
    </div>
  );
};

export default ParticipantListItem;
