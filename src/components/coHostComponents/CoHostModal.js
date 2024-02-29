/**
 * CoHostModal - A modal component for managing co-host settings.
 * @param {Object} props - The properties passed to the CoHostModal component.
 * @param {boolean} props.isCoHostModalVisible - A boolean to control the visibility of the co-host modal.
 * @param {Function} props.onCoHostClose - A function to handle closing the co-host modal.
 * @param {Function} props.onModifyEventSettings - A function to modify co-host settings.
 * @param {string} props.currentCohost - The current co-host.
 * @param {Array} props.participants - The list of participants.
 * @param {Array} props.coHostResponsibility - The co-host responsibilities.
 * @param {Object} props.parameters - Additional parameters for co-host modal functionality.
 * @param {string} props.position - The position of the modal.
 * @param {string} props.backgroundColor - The background color of the modal.
 * @returns {JSX.Element} - The CoHostModal component JSX element.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './CoHostModal.css'; // Import your custom CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';

const CoHostModal = ({
  isCoHostModalVisible,
  onCoHostClose,
  onModifyEventSettings = modifyCoHostSettings,
  currentCohost = 'No coHost',
  participants,
  coHostResponsibility,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
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
    display: isCoHostModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%',
    maxWidth: modalWidth,
    overflowX: 'hidden',
    overflowY: 'auto',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  const [selectedCohost, setSelectedCohost] = useState(currentCohost);

  const [CoHostResponsibilityCopy, setCoHostResponsibilityCopy] = useState([...coHostResponsibility]);
  const [CoHostResponsibilityCopyAlt, setCoHostResponsibilityCopyAlt] = useState([...coHostResponsibility]);
  const initialResponsibilities = CoHostResponsibilityCopyAlt.reduce((acc, item) => {
    let str = item.name;
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    let keyed = `manage${str2}`;
    acc[keyed] = item.value;
    acc[`dedicateTo${keyed}`] = item.dedicated;
    return acc;
  }, {});


  const [responsibilities, setResponsibilities] = useState(initialResponsibilities);

  const responsibilityItems = [
    { name: 'manageParticipants', label: 'Manage Participants' },
    { name: 'manageMedia', label: 'Manage Media' },
    { name: 'manageWaiting', label: 'Manage Waiting Room' },
    { name: 'manageChat', label: 'Manage Chat' },
  ];


  //filter out the current cohost from the list of participants and any participant with islevel '2'
  const filteredParticipants = participants && participants.filter((participant) => participant.name != currentCohost && participant.islevel != '2');


  const handleToggleSwitch = (responsibility) => {
    setResponsibilities((prevResponsibilities) => ({
      ...prevResponsibilities,
      [responsibility]: !prevResponsibilities[responsibility],

    }));


    //update the coHostResponsibilityCopy
    if (responsibility.startsWith('dedicateTo')) {
      const responsibilityName = responsibility.replace('dedicateTomanage', '').toLowerCase();
      const responsibilityDedicated = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).dedicated;
      CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).dedicated = !responsibilityDedicated;
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);
    } else if (responsibility.startsWith('manage')) {
      const responsibilityName = responsibility.replace('manage', '').toLowerCase();
      const responsibilityValue = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).value;
      CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).value = !responsibilityValue;
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);

    }


  };


  useEffect(() => {
    const populateResponsibilities = () => {

      setCoHostResponsibilityCopyAlt([...coHostResponsibility]);
      setCoHostResponsibilityCopy([...coHostResponsibility]);
      const responsibilities = CoHostResponsibilityCopyAlt.reduce((acc, item) => {
        let str = item.name;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        let keyed = `manage${str2}`;
        acc[keyed] = item.value;
        acc[`dedicateTo${keyed}`] = item.dedicated;
        return acc;
      }, {});
      setResponsibilities(responsibilities);

    };

    if (isCoHostModalVisible) {
      populateResponsibilities();
    }
  }, [isCoHostModalVisible, coHostResponsibility]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">Manage Co-Host</div>
          <div className="btn-close-settings" onClick={onCoHostClose}>
            <FontAwesomeIcon icon={faTimes} className="icon" />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <label className="font-weight-bold">Current Co-host:</label>
            <input className="form-control" value={currentCohost} readOnly />
          </div>
          <div className="form-group">
            <label className="font-weight-bold">Select New Co-host:</label>
            <select
              className="form-control"
              value={selectedCohost}
              onChange={(e) => setSelectedCohost(e.target.value)}
            >
              <option value="">Select a participant</option>
              {filteredParticipants.map(participant => (
                <option key={participant.name} value={participant.name}>{participant.name}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="col-5">
              <label style={{ fontWeight: 'bold' }}>Responsibility</label>
            </div>
            <div className="col-3">
              <label style={{ fontWeight: 'bold' }}>Select</label>
            </div>
            <div className="col-4">
              <label style={{ fontWeight: 'bold' }}>Dedicated</label>
            </div>
          </div>
          {responsibilityItems &&
            responsibilityItems.map((item) => (
              <div className="row" key={item.name} style={{ marginBottom: 10 }}>
                <div className="col-5" style={{ fontWeight: 'bold' }} >{item.label}</div>
                <div className="col-3">
                  <input
                    type="checkbox"
                    checked={responsibilities[item.name]}
                    onChange={() => handleToggleSwitch(item.name)}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="checkbox"
                    checked={responsibilities[item.name] && responsibilities[`dedicateTo${item.name}`]}
                    onChange={() => handleToggleSwitch(`dedicateTo${item.name}`)}
                    disabled={!responsibilities[item.name]}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="modal-footer">
          <button className="btn-apply-settings" onClick={() => onModifyEventSettings({
            parameters: {
              ...parameters,
              selectedParticipant: selectedCohost,
              coHost: currentCohost,
              coHostResponsibility: CoHostResponsibilityCopy,
              responsibilities
            }
          }
          )} // Pass the parameters to the function

          > save </button>
        </div>
      </div>
    </div>
  );
};

export default CoHostModal;
