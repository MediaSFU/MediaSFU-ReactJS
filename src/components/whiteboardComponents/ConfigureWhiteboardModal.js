import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faSyncAlt, faPlay, faSave } from '@fortawesome/free-solid-svg-icons';

const ConfigureWhiteboard = ({ isVisible, onConfigureWhiteboardClose, parameters, backgroundColor = '#83c0e9', position = 'topRight' }) => {
  let {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    islevel,
    roomName,
    eventType,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    canStartWhiteboard,

    whiteboardStarted,
    whiteboardEnded,
    whiteboardUsers,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateCanStartWhiteboard,
    updateIsConfigureWhiteboardModalVisible,

    onScreenChanges,
    captureCanvasStream,
    prepopulateUserMedia,
    rePort,
    hostLabel
  } = parameters;

  const [participantsCopy, setParticipantsCopy] = useState([]);
  const [whiteboardLimit, setWhiteboardLimit] = useState(itemPageLimit);
  const [isEditing, setIsEditing] = useState(false);

  const assignedListRef = useRef(null);
  const unassignedListRef = useRef(null);

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isVisible ? 'block' : 'none',
    zIndex: 999,
  };

  const screenWidth = window.innerWidth;
  let modalWidth = 0.7 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth,
    maxHeight: '75%',
    overflowY: 'auto',
    overflowX: 'hidden',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter(participant => participant.islevel != '2');
      setParticipantsCopy(filteredParticipants);
      checkCanStartWhiteboard();
    }
  }, [isVisible]);

  useEffect(() => {
    if (socket) {
      socket.on('whiteboardUpdated', async (data) => {
        if (islevel == '2' && data.members) {
          const filteredParticipants = data.members.filter(participant => !participant.isBanned);
          setParticipantsCopy(filteredParticipants);
        }

        updateWhiteboardUsers(data.whiteboardUsers);

        if (data.status == 'started') {
          whiteboardStarted = true;
          whiteboardEnded = false;
          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);

          if (islevel != '2') {
            shareScreenStarted = true;
            await onScreenChanges({changed: true, parameters});
          }
        } else if (data.status == 'ended') {
          whiteboardEnded = true;
          whiteboardStarted = false;
          updateWhiteboardStarted(false);
          updateWhiteboardEnded(true);

          shareScreenStarted = false;
          await onScreenChanges({changed: true, parameters});
          await prepopulateUserMedia({name: hostLabel, parameters});
          await rePort({restart: true, parameters});
        }
      });
    }
  }, [socket, eventType, islevel]);

  const toggleParticipant = (participant, add) => {
    setIsEditing(true);
    const selectedParticipants = participantsCopy.filter(p => p.useBoard);
    if (add && selectedParticipants.length >= (whiteboardLimit - 1)) {
      showAlert({ message: `Participant limit exceeded - you can only add ${whiteboardLimit - 1} other participants`, type: 'danger' });
      return;
    }

    const updatedParticipants = participantsCopy.map(p =>
      p.name == participant.name ? { ...p, useBoard: add } : p
    );

    setParticipantsCopy(updatedParticipants);
  };

  const validateWhiteboard = () => {
    const selectedParticipants = participantsCopy.filter(participant => participant.useBoard);

    if (selectedParticipants.length > whiteboardLimit) {
      showAlert({ message: 'Participant limit exceeded', type: 'danger' });
      return false;
    }

    return true;
  };

  const checkCanStartWhiteboard = () => {
    const isValid = validateWhiteboard();
    canStartWhiteboard = isValid;
    updateCanStartWhiteboard(isValid);
  };

  const handleSaveWhiteboard = () => {
    if (validateWhiteboard()) {
      setIsEditing(false);
      canStartWhiteboard = true;
      updateCanStartWhiteboard(true);
      checkCanStartWhiteboard();
      showAlert({ message: 'Whiteboard saved successfully', type: 'success' });
    } else {
      showAlert({ message: 'Whiteboard validation failed', type: 'danger' });
    }
  };

  const handleStartWhiteboard = async () => {
    if ((shareScreenStarted || shared) && !whiteboardStarted) {
      showAlert({ message: 'You cannot start whiteboard while screen sharing is active', type: 'danger' });
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded) {
      showAlert({ message: 'You cannot start whiteboard while breakout rooms are active', type: 'danger' });
      return;
    }

    if (canStartWhiteboard) {
      const emitName = whiteboardStarted && !whiteboardEnded ? 'updateWhiteboard' : 'startWhiteboard';
      const filteredWhiteboardUsers = participantsCopy.filter(participant => participant.useBoard).map(({ name, useBoard }) => ({ name, useBoard }));
      await socket.emit(emitName, { whiteboardUsers: filteredWhiteboardUsers, roomName }, async (response) => {
        if (response.success) {
          showAlert({ message: 'Whiteboard active', type: 'success' });
          whiteboardStarted = true;
          whiteboardEnded = false;
          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);
          updateIsConfigureWhiteboardModalVisible(false);

          if (islevel != '2') {
            shareScreenStarted = true;
            await onScreenChanges({changed: true, parameters});
          }

          if (islevel == '2' && (recordStarted || recordResumed)) {
            if (!(recordPaused || recordStopped) && recordingMediaOptions == 'video') {
              await captureCanvasStream({parameters});
            }
          }
        } else {
          showAlert({ message: response.reason, type: 'danger' });
        }
      });
    }
  };

  const handleStopWhiteboard = async () => {
    await socket.emit('stopWhiteboard', { roomName }, async (response) => {
      if (response.success) {
        showAlert({ message: 'Whiteboard stopped', type: 'success' });
        whiteboardEnded = true;
        whiteboardStarted = false;
        updateWhiteboardStarted(false);
        updateWhiteboardEnded(true);
        updateIsConfigureWhiteboardModalVisible(false);

        shareScreenStarted = false;
        await onScreenChanges({changed: true, parameters});
        await prepopulateUserMedia({name: hostLabel, parameters});
        await rePort({restart: true, parameters});
      } else {
        showAlert({ message: response.reason, type: 'danger' });
      }
    });
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>
              Configure Whiteboard
            </h2>
            <button onClick={onConfigureWhiteboardClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} size='xl' style={{ fontSize: 20, color: 'black' }} />
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6>Assigned</h6>
                <ul className="list-group" ref={assignedListRef} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc' }}>
                  {participantsCopy.filter(participant => participant.useBoard).length > 0 ? (
                    participantsCopy.filter(participant => participant.useBoard).map(participant => (
                      <li key={participant.name} className="list-group-item d-flex justify-content-between align-items-center text-dark mb-2 mr-2">
                        {participant.name}
                        <button className="btn btn-danger btn-sm mr-2 ml-2" onClick={() => toggleParticipant(participant, false)}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                      None
                    </li>
                  )}
                </ul>
              </div>
              <div className="col-md-6 mt-xs-3 mb-3">
                <h6>Pending</h6>
                <ul className="list-group" ref={unassignedListRef} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc' }}>
                  {participantsCopy.filter(participant => !participant.useBoard).length > 0 ? (
                    participantsCopy.filter(participant => !participant.useBoard).map(participant => (
                      <li key={participant.name} className="list-group-item d-flex justify-content-between align-items-center text-dark mb-2 mr-2">
                        {participant.name}
                        <button className="btn btn-primary btn-sm mr-2 ml-2" onClick={() => toggleParticipant(participant, true)}>
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                      None
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-info" onClick={handleSaveWhiteboard}> 
              Save <FontAwesomeIcon icon={faSave} /> 
            </button>
          </div>
          <hr />
          {!isEditing && (
            <>
              {canStartWhiteboard && (
                whiteboardStarted && !whiteboardEnded ? (
                  <button className="btn btn-warning" onClick={handleStartWhiteboard}>
                    Update <FontAwesomeIcon icon={faSyncAlt} />
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleStartWhiteboard}>
                    Start <FontAwesomeIcon icon={faPlay} />
                  </button>
                )
              )}
              {whiteboardStarted && !whiteboardEnded && (
                <button className="btn btn-danger mt-2" onClick={handleStopWhiteboard}>
                  Stop <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigureWhiteboard;
