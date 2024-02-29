/**
 * Renders a component for displaying and handling participant requests.
 *
 * @param {Object} props - The props containing information about the participant request.
 * @param {Object} props.request - The request object containing information about the participant request.
 * @param {Function} props.onRequestItemPress - The function to handle the press event on the request item.
 * @param {Array} props.requestList - The array of participant requests.
 * @param {Function} props.updateRequestList - The function to update the participant request list.
 * @param {string} props.roomName - The name of the room where the request is being responded to.
 * @param {Function} props.socket - The socket object for communication.
 *
 * @returns {React.Element} - The rendered component for displaying participant requests.
 *
 * @example
 * // Example usage of RenderRequestComponent
 * <RenderRequestComponent
 *   request={{ id: '12345', name: 'John Doe', icon: 'fa-microphone' }}
 *   onRequestItemPress={(params) => handleRequestItemPress(params)}
 *   requestList={requestList}
 *   updateRequestList={(newRequestList) => updateRequestList(newRequestList)}
 *   roomName="exampleRoom"
 * />
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faDesktop, faVideo, faComments, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const RenderRequestComponent = ( request, onRequestItemPress, requestList, updateRequestList, roomName, socket ) => {
  const keyMap = {
    'fa-microphone': faMicrophone,
    'fa-desktop': faDesktop,
    'fa-video': faVideo,
    'fa-comments': faComments,
  };

  const handleRequestAction = (action) => {
    onRequestItemPress({
      parameters: {
        request,
        updateRequestList,
        requestList,
        action,
        roomName,
        socket,
      },
    });
  };

  return (
    <div key={request.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px 0' , paddingBottom: '5px'}} >
      <div style={{ flex: 5 }}>
        <span>{request.name}</span>
      </div>
      <div style={{ flex: 2, alignItems: 'center' }}>
        {/* Use FontAwesomeIcon component for rendering icons */}
        <FontAwesomeIcon icon={keyMap[request.icon]} size="lg" color="black" />
      </div>
      <div style={{ flex: 2, alignItems: 'center', paddingRight:'10px' }}>
        {/* Accept button */}
        <button onClick={() => handleRequestAction('accepted')}>
          <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
        </button>
      </div>
      <div style={{ flex: 2, alignItems: 'center' }}>
        {/* Reject button */}
        <button onClick={() => handleRequestAction('rejected')}>
          <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
        </button>
      </div>
      <div style={{ flex: 1 , marginBottom:'2px'}} >

      </div>
    </div>
  );
};

export default RenderRequestComponent;
