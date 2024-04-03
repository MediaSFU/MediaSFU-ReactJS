/**
 * Component for displaying a modal for managing participants in the waiting room.
 *
 * @component
 * @example
 * // Example usage of WaitingRoomModal component
 * <WaitingRoomModal
 *   isWaitingModalVisible={true}
 *   onWaitingRoomClose={() => {}}
 *   waitingRoomCounter={3}
 *   onWaitingRoomFilterChange={() => {}}
 *   waitingRoomList={[
 *     { id: '1', name: 'Alice' },
 *     { id: '2', name: 'Bob' },
 *     { id: '3', name: 'Charlie' },
 *   ]}
 *   updateWaitingList={() => {}}
 *   roomName="Event Room"
 * />
 */

import React, {useState,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { respondToWaiting } from '../../methods/waitingMethods/respondToWaiting';
import './WaitingRoomModal.css';

const WaitingRoomModal = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  waitingRoomList,
  updateWaitingList,
  roomName,
  socket,
  onWaitingRoomItemPress = respondToWaiting,
  position = 'topRight',
  backgroundColor = '#83c0e9', 
  parameters,
}) => {


  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isWaitingModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%',
    overflowY: 'auto',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  const inputStyle = {
    width: '90%',
    padding: 10,
    borderRadius: 5,
    border: '1px solid #000',
    fontSize: 16,
    marginBottom: 10
  };

  const handleModalClose = () => {
    onWaitingRoomClose();
  };

  const [waitingRoomList_s, setWaitingRoomList_s] = useState(waitingRoomList);
  const [waitingRoomCounter_s, setWaitingRoomCounter_s] = useState(waitingRoomCounter);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {

    let { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams();


    setWaitingRoomList_s(parameters.filteredWaitingRoomList);
    setWaitingRoomCounter_s(parameters.filteredWaitingRoomList.length);
  }, [waitingRoomList, reRender]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">
            Waiting <span style={{ backgroundColor: '#fff', color: '#000', borderRadius: 10, padding: 5 }} className="badge">{waitingRoomCounter_s}</span>
          </div>
          <div onClick={onWaitingRoomClose} className="btn-close-waitings">
            <FontAwesomeIcon icon={faTimes} className="icon" />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <input style={inputStyle} placeholder="Search ..." onChange={(e) => {onWaitingRoomFilterChange(e.target.value); setReRender(!reRender)}} />
          </div>
          <div className="waiting-list">
            {waitingRoomList_s && waitingRoomList_s.map((participant, index) => (
              <div key={index} className="waiting-item" style={{ marginTop: 5, flexDirection: 'row', flex:1 }}>
                <div className="col7">{participant.name}</div>
                <div className="col2">
                  <button onClick={() => onWaitingRoomItemPress({parameters:{
                          participantId:participant.id,
                          participantName:participant.name,
                          waiting:participant,
                          updateWaitingList,
                          waitingList:waitingRoomList,
                          roomName,
                          type:false, //rejected
                          socket:socket,
                        }})}>
                    <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
                  </button>
                </div>
                <div className="col2">
                  <button onClick={() => onWaitingRoomItemPress({parameters:{
                          participantId:participant.id,
                          participantName:participant.name,
                          waiting:participant,
                          updateWaitingList,
                          waitingList:waitingRoomList,
                          roomName,
                          type:false, //rejected
                          socket:socket,
                        }})}>
                    <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
                  </button>
                </div>
                <div className="col1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomModal;
