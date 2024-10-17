/**
 * Pagination component for navigating through multiple pages.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.totalPages - Total number of pages.
 * @param {number} props.currentUserPage - The currently active page.
 * @param {Function} props.handlePageChange - Function to handle page change. Default: generatePageContent
 * @param {string} [props.position='middle'] - Position of the pagination. Can be 'left', 'middle', or 'right'.
 * @param {string} [props.location='middle'] - Location of the pagination. Can be 'top', 'middle', or 'bottom'.
 * @param {string} [props.direction='horizontal'] - Direction of pagination layout. Can be 'horizontal' or 'vertical'.
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the pagination buttons container.
 * @param {React.ReactNode} [props.alternateIconComponent] - An alternate icon component to use instead of FontAwesomeIcon.
 * @param {React.ReactNode} [props.iconComponent] - An icon component to use instead of FontAwesomeIcon.
 * @param {Object} [props.activePageStyle] - Styles for the active page button.
 * @param {Object} [props.inactivePageStyle] - Styles for the inactive page buttons.
 * @param {string} [props.backgroundColor='#ffffff'] - Background color of the pagination container.
 * @param {number} [props.paginationHeight=40] - Height of the pagination container.
 * @param {boolean} [props.showAspect=true] - Whether to display the pagination or not.
 * @param {Object} props.parameters - Additional parameters for handlePageChange function.
 * @returns {JSX.Element} Pagination component.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faLock } from '@fortawesome/free-solid-svg-icons';
import { generatePageContent } from '../../consumers/generatePageContent';

const Pagination = ({
  totalPages,
  currentUserPage,
  handlePageChange = generatePageContent,
  position = 'middle',
  location = 'middle',
  direction = 'horizontal',
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
  activePageStyle = { backgroundColor: '#2c678f' },
  inactivePageStyle,
  backgroundColor = '#ffffff',
  paginationHeight = 40,
  showAspect = true,
  
  parameters,


}) => {
  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  let {
    mainRoomsLength,
    memberRoom,
    breakOutRoomStarted,
    breakOutRoomEnded,
    member,
    breakoutRooms,
    hostNewRoom,
    roomName,
    islevel,
    showAlert,
    socket,
  
    //mediaSfu functions
    onScreenChanges,
  } = parameters;

  const data = Array.from({ length: totalPages + 1 }, (_, index) => index); // Increase the length by 1

  const handleClick = async (page, offSet = mainRoomsLength) => {
    if (page == currentUserPage) {
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded && page != '0') {
      //check if you are part of the breakout room
      const roomMember = await breakoutRooms.find(r => r.find(p => p.name == member));
      const pageInt = parseInt(page) - offSet;
      let memberBreakRoom = -1;
      if (roomMember) {
        memberBreakRoom = await breakoutRooms.indexOf(roomMember);
      }

      if ((memberBreakRoom == -1 || memberBreakRoom != pageInt) && pageInt >= 0) {
        if (islevel != '2') {
          if (showAlert) {
            showAlert({ message: `You are not part of the breakout room ${pageInt + 1}.`, type: 'danger' });
          }
          return;
          //generate the page content for the memberBreakRoom
          if (memberBreakRoom != -1) {
            page = `${memberBreakRoom}`;
          } else {
            await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: true });
            await onScreenChanges({ changed: true, parameters });
          }
          return;
        }

        await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: true });
        if (hostNewRoom != pageInt) {
          //update the breakout room by moving the user to the breakout room  
          await socket.emit('updateHostBreakout', { newRoom: pageInt, roomName }, async (response) => { });
        }
      } else {
        await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: pageInt >= 0 });
        //if host; update the breakout room for moving out
        if (islevel == '2' && hostNewRoom != -1) {
          await socket.emit('updateHostBreakout', { prevRoom: hostNewRoom, newRoom: -1, roomName }, async (response) => { });
        }
      }
    } else {
      await handlePageChange({ page, parameters, breakRoom: 0, inBreakRoom: false });
      //if host; update the breakout room for moving out
      if (islevel == '2' && hostNewRoom != -1) {
        await socket.emit('updateHostBreakout', { prevRoom: hostNewRoom, newRoom: -1, roomName }, async (response) => { });
      }
    }
  };

  const renderItem = (item) => {
    const isActive = item == currentUserPage;
    const pageStyle = isActive ? activePageStyle : inactivePageStyle;

    let displayItem = item;
    const targetPage = memberRoom;
    if (breakOutRoomStarted && !breakOutRoomEnded && item >= mainRoomsLength) {
      const roomNumber = item - (mainRoomsLength - 1);

      if (targetPage+1 != roomNumber) {
        if (islevel != '2') {
          displayItem = (
            <>
              Room {roomNumber} <FontAwesomeIcon icon={faLock} />
            </>
          );
        } else {
          displayItem = `Room ${roomNumber}`;
        }
      } else {
        displayItem = `Room ${roomNumber}`;
      }
    } else {
      displayItem = item;
    }

    return (
      <button
        key={item}
        className={`pageButton ${isActive ? 'active' : ''}`}
        style={{
          ...pageStyle,
          ...buttonsContainerStyle,
        }}
        onClick={async () => await handleClick(item)}
      >
        {item == 0 ? (
          <FontAwesomeIcon icon={faStar} size="lg" color={isActive ? 'yellow' : 'gray'} />
        ) : (
          <span className="pageText" style={{ color: isActive ? '#ffffff' : '#000000' }}>{displayItem}</span>
        )}
      </button>
    );
  };

  return (
    <div
      style={{
        backgroundColor,
        justifyContent: position == 'middle' ? 'space-evenly' : position == 'left' ? 'flex-start' : 'flex-end',
        alignItems: location == 'middle' ? 'center' : location == 'top' ? 'flex-start' : 'flex-end',
        padding: 0,
        margin: 0,
        width: direction == 'horizontal' ? '100%' : paginationHeight,
        height: direction == 'horizontal' ? paginationHeight : '100%',
        display: showAspect ? 'flex' : 'none',
        maxHeight: direction == 'horizontal' ? paginationHeight : '100%',
        maxWidth: direction == 'horizontal' ? '100%' : paginationHeight,
        display: showAspect ? 'flex' : 'none',
        flexDirection: direction == 'vertical' ? 'column' : 'row',
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
};

export default Pagination;
