/**
 * ParticipantsModal - A React JS component for displaying a modal with a list of participants.
 * @param {Object} props - The props passed to the ParticipantsModal.
 * @param {boolean} props.isParticipantsModalVisible - Indicates whether the participants modal is visible.
 * @param {Function} props.onParticipantsClose - Callback function to handle closing the participants modal.
 * @param {Function} props.onParticipantsFilterChange - Callback function to handle changes in the participants filter input.
 * @param {number} props.participantsCounter - The counter for the number of participants.
 * @param {Function} props.onMuteParticipants - Custom function for muting participants.
 * @param {Function} props.onMessageParticipants - Custom function for messaging participants.
 * @param {Function} props.onRemoveParticipants - Custom function for removing participants.
 * @param {React.Component} props.RenderParticipantList - Custom component for rendering the participant list.
 * @param {React.Component} props.RenderParticipantListOthers - Custom component for rendering the participant list for other participants.
 * @param {Function} props.formatBroadcastViews - Custom function for formatting the number of broadcast views.
 * @param {Object} props.parameters - Additional parameters for the participants modal.
 * @param {string} props.position - The position of the modal.
 * @param {string} props.backgroundColor - The background color of the modal.
 * @returns {React.Component} - The ParticipantsModal.
 */

import React, { useEffect, useState } from 'react';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import ParticipantList from './ParticipantList';
import ParticipantListOthers from './ParticipantListOthers';
import { formatNumber } from '../../methods/utils/formatNumber';
import { muteParticipants } from '../../methods/participantsMethods/muteParticipants';
import { messageParticipants } from '../../methods/participantsMethods/messageParticipants';
import { removeParticipants } from '../../methods/participantsMethods/removeParticipants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const ParticipantsModal = ({
    isParticipantsModalVisible,
    onParticipantsClose,
    onParticipantsFilterChange,
    participantsCounter,
    onMuteParticipants = muteParticipants,
    onMessageParticipants = messageParticipants,
    onRemoveParticipants = removeParticipants,
    RenderParticipantList = ParticipantList,
    RenderParticipantListOthers = ParticipantListOthers,
    formatBroadcastViews = formatNumber,
    parameters,
    position = 'topRight',
    backgroundColor = '#83c0e9',
}) => {

    const {
        coHostResponsibility,
        coHost,
        member,
        islevel,
        showAlert,
        participants,
        roomName,
        eventType,
    } = parameters;

    const [participant_s, setParticipant_s] = useState(participants);
    const [participantsCounter_s, setParticipantsCounter_s] = useState(participantsCounter);
    const [reRender, setReRender] = useState(false);


    const screenWidth = window.innerWidth;
    let modalWidth = 0.8 * screenWidth;
    if (modalWidth > 400) {
        modalWidth = 400;
    }

    const modalContainerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: isParticipantsModalVisible ? 'block' : 'none',
        zIndex: 999,
    };

    const modalContentStyle = {
        position: 'fixed',
        backgroundColor: backgroundColor,
        borderRadius: 10,
        padding: 10,
        width: modalWidth,
        maxHeight: '75%',
        overflowY: 'auto',
        top: position.includes('top') ? 10 : 'auto',
        bottom: position.includes('bottom') ? 10 : 'auto',
        left: position.includes('Left') ? 10 : 'auto',
        right: position.includes('Right') ? 10 : 'auto',
    };

    const inputStyle = {
        width: '90%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #000',
        fontSize: 16,
        marginBottom: 10,
    };

    let participantsValue = false;
    try {
        participantsValue = coHostResponsibility.find(item => item.name === 'participants').value;

    } catch (error) {

    }

    useEffect(() => {
        let { getUpdatedAllParams } = parameters;
        parameters = getUpdatedAllParams();

        setParticipant_s(parameters.filteredParticipants);
        setParticipantsCounter_s(parameters.filteredParticipants.length);
    }, [participants, reRender]);


    return (
        <div style={modalContainerStyle}>
            <div style={modalContentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        Participants <span style={{ backgroundColor: '#fff', color: '#000', borderRadius: 10, padding: 5 }} className="badge">{participantsCounter_s}</span>
                    </div>
                    <div onClick={onParticipantsClose} style={{ padding: 5 }}>
                        <FontAwesomeIcon icon={faTimes} className="icon" size='xl' />
                    </div>
                </div>

                <div>
                    {/* Filter input */}
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="Search ..."
                        onChange={(e) => { onParticipantsFilterChange(e.target.value); setReRender(!reRender) }}
                    />
                </div>
                <div>
                    {/* RenderParticipantList and RenderParticipantListOthers components */}
                    {participants && islevel === '2' || (coHost === member && participantsValue === true) ? (

                        <RenderParticipantList
                            participants={participant_s}
                            isBroadcast={eventType === 'broadcast'}
                            onMuteParticipants={onMuteParticipants}
                            onMessageParticipants={onMessageParticipants}
                            onRemoveParticipants={onRemoveParticipants}
                            formatBroadcastViews={formatBroadcastViews}
                            parameters={parameters}
                        />
                    ) : participants ? (
                        <RenderParticipantListOthers
                            participants={participant_s}
                            isBroadcast={eventType === 'broadcast'}
                            onMuteParticipants={onMuteParticipants}
                            onMessageParticipants={onMessageParticipants}
                            onRemoveParticipants={onRemoveParticipants}
                            formatBroadcastViews={formatBroadcastViews}
                            parameters={parameters}
                        />
                    ) : (
                        <div>No participants</div>

                    )}
                </div>

            </div>
        </div>
    );
};

export default ParticipantsModal;