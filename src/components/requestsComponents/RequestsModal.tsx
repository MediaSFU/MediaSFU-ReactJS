/**
 * Renders a modal for displaying and handling participant requests.
 *
 * @param {Object} props - The props containing information about the requests modal.
 * @param {boolean} props.isRequestsModalVisible - Determines whether the requests modal is visible.
 * @param {Function} props.onRequestClose - The function to handle the close event of the requests modal.
 * @param {number} props.requestCounter - The counter for the number of requests.
 * @param {Function} props.onRequestFilterChange - The function to handle the filter change event for requests.
 * @param {Function} props.onRequestItemPress - The function to handle the press event on a request item.
 * @param {Array} props.requestList - The array of participant requests.
 * @param {Function} props.updateRequestList - The function to update the participant request list.
 * @param {string} props.roomName - The name of the room where the request is being responded to.
 * @param {Function} props.renderRequestComponent - The function to render the individual request component.
 * @param {string} props.backgroundColor - The background color of the requests modal.
 * @param {string} props.position - The position of the requests modal.
 * @param {Object} props.parameters - Additional parameters for handling requests.
 *
 * @returns {React.Element} - The rendered component for displaying and handling participant requests modal.
 *
 * @example
 * // Example usage of RequestsModal
 * <RequestsModal
 *   isRequestsModalVisible={true}
 *   onRequestClose={() => handleCloseRequestsModal()}
 *   requestCounter={3}
 *   onRequestFilterChange={(text) => handleRequestFilterChange(text)}
 *   onRequestItemPress={(params) => handleRequestItemPress(params)}
 *   requestList={requestList}
 *   updateRequestList={(newRequestList) => updateRequestList(newRequestList)}
 *   roomName="exampleRoom"
 *   renderRequestComponent={(request, onRequestItemPress, requestList, updateRequestList, roomName) => (
 *     <RenderRequestComponent
 *       request={request}
 *       onRequestItemPress={onRequestItemPress}
 *       requestList={requestList}
 *       updateRequestList={updateRequestList}
 *       roomName={roomName}
 *     />
 *   )}
 *   backgroundColor="#83c0e9"
 *   position="topRight"
 *   parameters={additionalParameters}
 * />
 */
import React, { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import RenderRequestComponent from './RenderRequestComponent';
import { respondToRequests } from '../../methods/requestsMethods/respondToRequests';


const RequestsModal = ({
  isRequestsModalVisible,
  onRequestClose,
  requestCounter,
  onRequestFilterChange,
  onRequestItemPress = respondToRequests,
  requestList,
  updateRequestList,
  roomName,
  socket,
  renderRequestComponent = RenderRequestComponent,
  backgroundColor = '#83c0e9',
  position = 'topRight',
  parameters,
}) => {

  const [requestList_s, setRequestList_s] = useState(requestList);
  const [requestCounter_s, setRequestCounter_s] = useState(requestCounter);
  const [reRender, setReRender] = useState(false);

  const handleModalClose = () => {
    onRequestClose();
  };

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
    display: isRequestsModalVisible ? 'block' : 'none',
    zIndex: 999
  };

  const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%', // Set max height here
    overflowY: 'auto', // Add overflow auto for scrollability
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto'
  };

  const styles = {
    input: {
      width: '90%',
      padding: 10,
      borderRadius: 5,
      border: '1px solid #000',
      fontSize: 16,
      marginBottom: 10
    }
  };

  useEffect(() => {

    let { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams();
    

    setRequestList_s(parameters.filteredRequestList);
    setRequestCounter_s(parameters.filteredRequestList.length);
  }, [requestList, reRender]);


  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
              Requests <span style={{ backgroundColor: '#fff', color: '#000', borderRadius: 10, padding: 5 }}>{requestCounter_s}</span>
            </div>
            <div onClick={handleModalClose} style={{ padding: 5 }}>
              <FontAwesomeIcon icon={faTimes} size='xl' style={{ fontSize: 20, color: 'black' }} />
            </div>
          </div>
          <hr style={{ height: 1, backgroundColor: 'black', margin: '5px 0' }} />
          <div style={{ marginBottom: 20 }}>
            <input style={styles.input} placeholder="Search ..." onChange={(e) => {onRequestFilterChange(e.target.value); setReRender(!reRender)}} />
          </div>
          <div style={{ maxHeight: 'calc(100% - 150px)', overflowY: 'auto' }}>
            <div id="request-list">
              {requestList_s && requestList_s.length > 0 && requestList_s.map((requestItem, index) => (
                <div key={index} style={{ marginTop: 5 }}>
                  {renderRequestComponent(requestItem, onRequestItemPress, requestList, updateRequestList, roomName, socket)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsModal;