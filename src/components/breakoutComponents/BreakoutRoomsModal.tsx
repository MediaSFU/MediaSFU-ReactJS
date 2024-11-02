
 
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes, faPlus, faPlay, faSyncAlt, faStop, faDoorOpen, faSave, faRandom, faUsers, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { BreakoutParticipant, Participant, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';


interface RoomOptions {
  rooms: BreakoutParticipant[][];
  handleEditRoom: (roomIndex: number) => void;
  handleDeleteRoom: (roomIndex: number) => void;
  handleRemoveParticipant: (roomIndex: number, participant: BreakoutParticipant) => void;
}

interface EditRoomModalOptions {
  editRoomModalVisible: boolean;
  setEditRoomModalVisible: (visible: boolean) => void;
  currentRoom: BreakoutParticipant[] | null;
  participantsRef: React.MutableRefObject<Participant[]>;
  handleAddParticipant: (roomIndex: number, participant: (Participant | BreakoutParticipant)) => void;
  handleRemoveParticipant: (roomIndex: number, participant: (Participant | BreakoutParticipant)) => void;
  currentRoomIndex: number | null;
}

export interface BreakoutRoomsModalParameters {
  participants: Participant[];
  showAlert?: ShowAlert;
  socket: Socket;
  itemPageLimit: number;
  meetingDisplayType: string;
  prevMeetingDisplayType: string;
  roomName: string;
  shareScreenStarted: boolean;
  shared: boolean;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  isBreakoutRoomsModalVisible: boolean;
  currentRoomIndex: number | null;
  canStartBreakout: boolean;
  breakoutRooms: BreakoutParticipant[][];
  updateBreakOutRoomStarted: (started: boolean) => void;
  updateBreakOutRoomEnded: (ended: boolean) => void;
  updateCurrentRoomIndex: (roomIndex: number) => void;
  updateCanStartBreakout: (canStart: boolean) => void;
  updateBreakoutRooms: (breakoutRooms: BreakoutParticipant[][]) => void;
  updateMeetingDisplayType: (displayType: string) => void;
  
  getUpdatedAllParams: () => BreakoutRoomsModalParameters;
  [key: string]: any;
}

export interface BreakoutRoomsModalOptions {
  isVisible: boolean;
  onBreakoutRoomsClose: () => void;
  parameters: BreakoutRoomsModalParameters;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
}

// Export the type definition for the function
export type BreakoutRoomsModalType = (options: BreakoutRoomsModalOptions) => JSX.Element;

// RoomList component with types
const RoomList: React.FC<RoomOptions> = ({ rooms, handleEditRoom, handleDeleteRoom, handleRemoveParticipant }) => {
  return (
    <>
      {rooms.map((room, roomIndex) => (
        <div className="card mb-3 text-dark" key={roomIndex}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Room {roomIndex + 1} <FontAwesomeIcon icon={faUsers} /></span>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEditRoom(roomIndex)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoom(roomIndex)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {room.map((participant, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  {participant.name}
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveParticipant(roomIndex, participant)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

// EditRoomModal component with types
const EditRoomModal: React.FC<EditRoomModalOptions> = ({
  editRoomModalVisible,
  setEditRoomModalVisible,
  currentRoom,
  participantsRef,
  handleAddParticipant,
  handleRemoveParticipant,
  currentRoomIndex,
}) => {
  const modalContainerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: editRoomModalVisible ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
  };

  const listContainerStyle = {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <h5 className="modal-title">
            Edit Room {currentRoomIndex! + 1} <FontAwesomeIcon icon={faPen} />
          </h5>
          <button type="button" className="close" onClick={() => setEditRoomModalVisible(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <div style={listContainerStyle}>
            <h5>
              Assigned Participants <FontAwesomeIcon icon={faUsers} />
            </h5>
            <ul className="list-group">
              {currentRoom && currentRoom.length > 0 ? (
                currentRoom.map((participant, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center text-dark">
                    {participant.name}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveParticipant(currentRoomIndex!, participant)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  None assigned
                </li>
              )}
            </ul>
          </div>
          <div style={listContainerStyle}>
            <h5>
              Unassigned Participants <FontAwesomeIcon icon={faUsers} />
            </h5>
            <ul className="list-group">
              {participantsRef.current
                .filter((participant) => participant.breakRoom == null)
                .length > 0 ? (
                participantsRef.current
                  .filter((participant) => participant.breakRoom == null)
                  .map((participant, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center text-dark"
                    >
                      {participant.name}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddParticipant(currentRoomIndex!, participant)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </li>
                  ))
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  None pending
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setEditRoomModalVisible(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// BreakoutRoomsModal component with types
/**
 * BreakoutRoomsModal component is a React functional component that manages the breakout rooms modal.
 * It allows users to create, edit, and manage breakout rooms for participants in a meeting.
 *
 * @component
 * @param {BreakoutRoomsModalOptions} props - The properties for the BreakoutRoomsModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {Function} props.onBreakoutRoomsClose - Callback function to close the modal.
 * @param {Object} props.parameters - Parameters for managing breakout rooms.
 * @param {string} [props.position='topRight'] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal.
 *
 * @returns {JSX.Element} The rendered BreakoutRoomsModal component.
 *
 * @example
 * ```tsx
 * <BreakoutRoomsModal
 *   isVisible={true}
 *   onBreakoutRoomsClose={handleClose}
 *   parameters={parameters}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 * />
 * ```
 */
const BreakoutRoomsModal: React.FC<BreakoutRoomsModalOptions> = ({
  isVisible,
  onBreakoutRoomsClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    meetingDisplayType,
    prevMeetingDisplayType,
    roomName,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    isBreakoutRoomsModalVisible,
    currentRoomIndex,
    canStartBreakout,
    breakoutRooms,
    updateBreakOutRoomStarted,
    updateBreakOutRoomEnded,
    updateCurrentRoomIndex,
    updateCanStartBreakout,
    updateBreakoutRooms,
    updateMeetingDisplayType,
  } = parameters;

  const participantsRef = useRef<Participant[]>(participants);
  const breakoutRoomsRef = useRef<BreakoutParticipant[][]>(breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : []);

  const [numRooms, setNumRooms] = useState<string>('');
  const [newParticipantAction, setNewParticipantAction] = useState<string>('autoAssignNewRoom');
  const [currentRoom, setCurrentRoom] = useState<BreakoutParticipant[]>([]);
  const [editRoomModalVisible, setEditRoomModalVisible] = useState<boolean>(false);

  const [startBreakoutButtonVisible, setStartBreakoutButtonVisible] = useState<boolean>(false);
  const [stopBreakoutButtonVisible, setStopBreakoutButtonVisible] = useState<boolean>(false);

  const screenWidth = window.innerWidth;
  let modalWidth = 0.9 * screenWidth;
  if (modalWidth > 600) {
    modalWidth = 600;
  }

  const modalContainerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isBreakoutRoomsModalVisible ? 'block' : 'none',
    zIndex: 999,
  };

  const modalContentStyle = {
    position: 'fixed' as const,
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%',
    maxWidth: modalWidth,
    overflowX: 'hidden' as const,
    overflowY: 'auto' as const,
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto',
  };

  const roomsContainerRef = useRef<HTMLDivElement | null>(null);

  const checkCanStartBreakout = () => {
    if (canStartBreakout) {
      setStartBreakoutButtonVisible(true);
      setStopBreakoutButtonVisible(breakOutRoomStarted && !breakOutRoomEnded);
    } else {
      setStartBreakoutButtonVisible(false);
      setStopBreakoutButtonVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter((participant: Participant) => participant.islevel != '2');
      participantsRef.current = filteredParticipants;
      breakoutRoomsRef.current = breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : [];
      checkCanStartBreakout();
    }
  }, [isVisible]);

  const handleRandomAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    const newBreakoutRooms: BreakoutParticipant[][] = Array.from({ length: numRoomsInt }, () => []);
    const shuffledParticipants = [...participantsRef.current].sort(() => 0.5 - Math.random());

    shuffledParticipants.forEach((participant, index) => {
      const roomIndex = index % numRoomsInt;
      if (newBreakoutRooms[roomIndex].length < itemPageLimit) {
        const participant_: BreakoutParticipant = { name: participant.name, breakRoom: roomIndex };
        newBreakoutRooms[roomIndex].push(participant_);
        participant.breakRoom = roomIndex;
      } else {
        for (let i = 0; i < numRoomsInt; i++) {
          if (newBreakoutRooms[i].length < itemPageLimit) {
            newBreakoutRooms[i].push(participant);
            participant.breakRoom = i;
            break;
          }
        }
      }
    });
    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleManualAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    breakoutRoomsRef.current = Array.from({ length: numRoomsInt }, () => []);
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleAddRoom = () => {
    breakoutRoomsRef.current = [...breakoutRoomsRef.current, []];
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleSaveRooms = () => {
    if (validateRooms()) {
      updateBreakoutRooms(breakoutRoomsRef.current);
      updateCanStartBreakout(true);
      checkCanStartBreakout();
      showAlert?.({ message: 'Rooms saved successfully', type: 'success' });
    } else {
      showAlert?.({ message: 'Rooms validation failed', type: 'danger' });
    }
  };

  const validateRooms = (): boolean => {
    if (breakoutRoomsRef.current.length === 0) {
      showAlert?.({ message: 'There must be at least one room', type: 'danger' });
      return false;
    }

    for (let room of breakoutRoomsRef.current) {
      if (room.length === 0) {
        showAlert?.({ message: 'Rooms must not be empty', type: 'danger' });
        return false;
      }

      const participantNames = room.map((p) => p.name);
      const uniqueNames = new Set(participantNames);
      if (participantNames.length !== uniqueNames.size) {
        showAlert?.({ message: 'Duplicate participant names in a room', type: 'danger' });
        return false;
      }

      if (room.length > itemPageLimit) {
        showAlert?.({ message: 'A room exceeds the participant limit', type: 'danger' });
        return false;
      }
    }

    return true;
  };

  const handleStartBreakout = () => {
    if (shareScreenStarted || shared) {
      showAlert?.({ message: 'You cannot start breakout rooms while screen sharing is active', type: 'danger' });
      return;
    }

    if (canStartBreakout) {
      const emitName = breakOutRoomStarted && !breakOutRoomEnded ? 'updateBreakout' : 'startBreakout';
      const filteredBreakoutRooms = breakoutRoomsRef.current.map((room) =>
        room.map(({ name, breakRoom }) => ({ name, breakRoom }))
      );
      socket.emit(emitName, { breakoutRooms: filteredBreakoutRooms, newParticipantAction, roomName }, (response: { success: boolean; reason: string }) => {
        if (response.success) {
          showAlert?.({ message: 'Breakout rooms active', type: 'success' });
          updateBreakOutRoomStarted(true);
          updateBreakOutRoomEnded(false);
          onBreakoutRoomsClose();
          if (meetingDisplayType !== 'all') {
            updateMeetingDisplayType('all');
          }
        } else {
          showAlert?.({ message: response.reason, type: 'danger' });
        }
      });
    }
  };

  const handleStopBreakout = () => {
    socket.emit('stopBreakout', { roomName }, (response: { success: boolean; reason: string }) => {
      if (response.success) {
        showAlert?.({ message: 'Breakout rooms stopped', type: 'success' });
        updateBreakOutRoomStarted(false);
        updateBreakOutRoomEnded(true);
        onBreakoutRoomsClose();
        if (meetingDisplayType !== prevMeetingDisplayType) {
          updateMeetingDisplayType(prevMeetingDisplayType);
        }
      } else {
        showAlert?.({ message: response.reason, type: 'danger' });
      }
    });
  };

  const handleEditRoom = (roomIndex: number) => {
    updateCurrentRoomIndex(roomIndex);
    setCurrentRoom(breakoutRoomsRef.current[roomIndex]);
    setEditRoomModalVisible(true);
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleDeleteRoom = (roomIndex: number) => {
    const room = breakoutRoomsRef.current[roomIndex];
    room.forEach((participant) => (participant.breakRoom = null));
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms.splice(roomIndex, 1);

    newBreakoutRooms.forEach((room, index) => {
      room.forEach((participant) => (participant.breakRoom = index));
    });

    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleAddParticipant = (roomIndex: number, participant: (Participant | BreakoutParticipant)) => {
    if (breakoutRoomsRef.current[roomIndex].length < itemPageLimit) {
      const newBreakoutRooms = [...breakoutRoomsRef.current];
      const participant_: BreakoutParticipant = { name: participant.name, breakRoom: roomIndex };
      newBreakoutRooms[roomIndex].push(participant_);
      breakoutRoomsRef.current = newBreakoutRooms;
      participant.breakRoom = roomIndex;
      if (currentRoomIndex != null) {
        handleEditRoom(currentRoomIndex);
      }
    } else {
      showAlert?.({ message: 'Room is full', type: 'danger' });
    }
  };

  const handleRemoveParticipant = (roomIndex: number, participant: (Participant | BreakoutParticipant)) => {
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms[roomIndex] = newBreakoutRooms[roomIndex].filter((p) => p !== participant);
    breakoutRoomsRef.current = newBreakoutRooms;
    participant.breakRoom = null;
    if (currentRoomIndex != null) {
      handleEditRoom(currentRoomIndex);
    }
  };

  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      <div style={modalContainerStyle}>
        <div style={modalContentStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>
              Breakout Rooms <FontAwesomeIcon icon={faDoorOpen} />
            </h2>
            <button onClick={onBreakoutRoomsClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} size="xl" style={{ fontSize: 20, color: 'black' }} />
            </button>
          </div>
          <hr style={{ height: 1, backgroundColor: 'black', marginTop: 5, marginBottom: 5 }} />
          <div className="form-group">
            <label htmlFor="numRooms">
              Number of Rooms <FontAwesomeIcon icon={faUsers} />
            </label>
            <input
              type="number"
              className="form-control"
              id="numRooms"
              value={numRooms}
              onChange={(e) => setNumRooms(e.target.value)}
            />
          </div>
          <div className="form-group d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" onClick={handleRandomAssign}>
              Random Assign <FontAwesomeIcon icon={faRandom} />
            </button>
            <button className="btn btn-secondary" onClick={handleManualAssign}>
              Manual Assign <FontAwesomeIcon icon={faHandPointer} />
            </button>
            <button className="btn btn-success" onClick={handleAddRoom}>
              Add Room <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn btn-info" onClick={handleSaveRooms}>
              Save Rooms <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="newParticipantAction">
              New Participant Action <FontAwesomeIcon icon={faUsers} />
            </label>
            <select
              className="form-control"
              id="newParticipantAction"
              value={newParticipantAction}
              onChange={(e) => setNewParticipantAction(e.target.value)}
            >
              <option value="autoAssignNewRoom">Add to new room</option>
              <option value="autoAssignAvailableRoom">Add to open room</option>
              <option value="manualAssign">No action</option>
            </select>
          </div>
          <div ref={roomsContainerRef}>
            <RoomList
              rooms={breakoutRoomsRef.current}
              handleEditRoom={handleEditRoom}
              handleDeleteRoom={handleDeleteRoom}
              handleRemoveParticipant={handleRemoveParticipant}
            />
          </div>
          {startBreakoutButtonVisible && (
            <button className="btn btn-primary mr-2 mb-2" onClick={handleStartBreakout}>
              {breakOutRoomStarted && !breakOutRoomEnded ? 'Update Breakout ' : 'Start Breakout '}
              <FontAwesomeIcon icon={breakOutRoomStarted && !breakOutRoomEnded ? faSyncAlt : faPlay} />
            </button>
          )}
          {stopBreakoutButtonVisible && (
            <button className="btn btn-danger mr-2 mb-2" onClick={handleStopBreakout}>
              Stop Breakout <FontAwesomeIcon icon={faStop} />
            </button>
          )}
        </div>
      </div>
      <EditRoomModal
        editRoomModalVisible={editRoomModalVisible}
        setEditRoomModalVisible={setEditRoomModalVisible}
        currentRoom={currentRoom}
        participantsRef={participantsRef}
        handleAddParticipant={handleAddParticipant}
        handleRemoveParticipant={handleRemoveParticipant}
        currentRoomIndex={currentRoomIndex}
      />
    </div>
  );
};

export default BreakoutRoomsModal;
