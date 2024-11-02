 
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faLock } from "@fortawesome/free-solid-svg-icons";
import {
  generatePageContent,
  GeneratePageContentOptions,
  GeneratePageContentParameters,
} from "../../consumers/generatePageContent";
import { Socket } from "socket.io-client";
import { ShowAlert, BreakoutParticipant } from "../../@types/types";

export interface PaginationParameters extends GeneratePageContentParameters {
  mainRoomsLength: number;
  memberRoom: number;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  member: string;
  breakoutRooms: BreakoutParticipant[][];
  hostNewRoom: number;
  roomName: string;
  islevel: string;
  showAlert?: ShowAlert;
  socket: Socket;

  // mediasfu functions
  getUpdatedAllParams: () => PaginationParameters;
  [key: string]: any;
}
export interface PaginationOptions {
  totalPages: number;
  currentUserPage: number;
  handlePageChange?: (options: GeneratePageContentOptions) => Promise<void>;
  position?: "left" | "middle" | "right";
  location?: "top" | "middle" | "bottom";
  direction?: "horizontal" | "vertical";
  buttonsContainerStyle?: React.CSSProperties;
  activePageStyle?: React.CSSProperties;
  inactivePageStyle?: React.CSSProperties;
  backgroundColor?: string;
  paginationHeight?: number;
  showAspect?: boolean;
  parameters: PaginationParameters;
}

export type PaginationType = (options: PaginationOptions) => JSX.Element;

/**
 * Pagination is a React component for navigating pages, with options for layout, style, and real-time updates.
 *
 * This component supports navigating through pages while managing breakout rooms with socket events and optional alerts for restricted access. It allows custom styling, positioning, and direction of pagination controls.
 *
 * @component
 * @param {PaginationOptions} props - The properties for the Pagination component.
 * @param {number} props.totalPages - Total number of pages.
 * @param {number} props.currentUserPage - Current active page of the user.
 * @param {function} [props.handlePageChange=generatePageContent] - Function to manage page changes.
 * @param {string} [props.position="middle"] - Horizontal alignment ('left', 'middle', 'right').
 * @param {string} [props.location="middle"] - Vertical alignment ('top', 'middle', 'bottom').
 * @param {string} [props.direction="horizontal"] - Layout direction ('horizontal' or 'vertical').
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Styles for the button container.
 * @param {React.CSSProperties} [props.activePageStyle={ backgroundColor: "#2c678f" }] - Styles for the active page button.
 * @param {React.CSSProperties} [props.inactivePageStyle] - Styles for the inactive page buttons.
 * @param {string} [props.backgroundColor="#ffffff"] - Background color of the pagination container.
 * @param {number} [props.paginationHeight=40] - Height of the pagination container.
 * @param {boolean} [props.showAspect=true] - Flag to control pagination visibility.
 * @param {PaginationParameters} props.parameters - Parameters for socket events, breakout rooms, and updates.
 *
 * @returns {JSX.Element} A pagination component for navigating pages.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { Pagination } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   const parameters = {
 *     mainRoomsLength: 2,
 *     memberRoom: 1,
 *     breakOutRoomStarted: true,
 *     breakOutRoomEnded: false,
 *     member: "John",
 *     breakoutRooms: [[{ name: "John" }], [{ name: "Jane" }]],
 *     hostNewRoom: 1,
 *     roomName: "Room 1",
 *     islevel: "1",
 *     socket,
 *     getUpdatedAllParams: () => parameters,
 *   };
 *   
 *   return (
 *     <Pagination
 *       totalPages={5}
 *       currentUserPage={2}
 *       handlePageChange={generatePageContent}
 *       position="middle"
 *       location="middle"
 *       direction="horizontal"
 *       buttonsContainerStyle={{ padding: 10 }}
 *       activePageStyle={{ backgroundColor: "#2c678f" }}
 *       inactivePageStyle={{ backgroundColor: "#ffffff" }}
 *       backgroundColor="#ffffff"
 *       paginationHeight={40}
 *       showAspect={true}
 *       parameters={parameters}
 *     />
 *   );
 * }
 * 
 * export default App;
 * ```
 */

const Pagination: React.FC<PaginationOptions> = ({
  totalPages,
  currentUserPage,
  handlePageChange = generatePageContent,
  position = "middle",
  location = "middle",
  direction = "horizontal",
  buttonsContainerStyle,
  activePageStyle = { backgroundColor: "#2c678f" },
  inactivePageStyle,
  backgroundColor = "#ffffff",
  paginationHeight = 40,
  showAspect = true,
  parameters,
}) => {
  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  const {
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
  } = parameters;

  const data = Array.from({ length: totalPages + 1 }, (_, index) => index); // Increase the length by 1

  const handleClick = async (page: number, offSet = mainRoomsLength) => {
    if (page === currentUserPage) {
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded && page !== 0) {
      const roomMember = breakoutRooms.find((r: any) =>
        r.find((p: any) => p.name === member)
      );
      const pageInt = page - offSet;
      let memberBreakRoom = -1;
      if (roomMember) {
        memberBreakRoom = breakoutRooms.indexOf(roomMember);
      }

      if (
        (memberBreakRoom === -1 || memberBreakRoom !== pageInt) &&
        pageInt >= 0
      ) {
        if (islevel !== "2") {
          if (showAlert) {
            showAlert({
              message: `You are not part of the breakout room ${pageInt + 1}.`,
              type: "danger",
            });
          }
          return;
        }

        await handlePageChange({
          page,
          parameters,
          breakRoom: pageInt,
          inBreakRoom: true,
        });
        if (hostNewRoom !== pageInt) {
          socket.emit(
            "updateHostBreakout",
            { newRoom: pageInt, roomName },
            () => {}
          );
        }
      } else {
        await handlePageChange({
          page,
          parameters,
          breakRoom: pageInt,
          inBreakRoom: pageInt >= 0,
        });
        if (islevel === "2" && hostNewRoom !== -1) {
          socket.emit(
            "updateHostBreakout",
            { prevRoom: hostNewRoom, newRoom: -1, roomName },
            () => {}
          );
        }
      }
    } else {
      await handlePageChange({
        page,
        parameters,
        breakRoom: 0,
        inBreakRoom: false,
      });
      if (islevel === "2" && hostNewRoom !== -1) {
        socket.emit(
          "updateHostBreakout",
          { prevRoom: hostNewRoom, newRoom: -1, roomName },
          () => {}
        );
      }
    }
  };

  const renderItem = (item: number) => {
    const isActive = item === currentUserPage;
    const pageStyle = isActive ? activePageStyle : inactivePageStyle;

    let displayItem: React.ReactNode = item;
    const targetPage = memberRoom;

    if (breakOutRoomStarted && !breakOutRoomEnded && item >= mainRoomsLength) {
      const roomNumber = item - (mainRoomsLength - 1);
      if (targetPage + 1 !== roomNumber) {
        if (islevel !== "2") {
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
    }

    return (
      <button
        key={item}
        className={`pageButton ${isActive ? "active" : ""}`}
        style={{
          ...pageStyle,
          ...buttonsContainerStyle,
        }}
        onClick={async () => await handleClick(item)}
      >
        {item === 0 ? (
          <FontAwesomeIcon
            icon={faStar}
            size="lg"
            color={isActive ? "yellow" : "gray"}
          />
        ) : (
          <span
            className="pageText"
            style={{ color: isActive ? "#ffffff" : "#000000" }}
          >
            {displayItem}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      style={{
        backgroundColor,
        justifyContent:
          position === "middle"
            ? "space-evenly"
            : position === "left"
            ? "flex-start"
            : "flex-end",
        alignItems:
          location === "middle"
            ? "center"
            : location === "top"
            ? "flex-start"
            : "flex-end",
        padding: 0,
        margin: 0,
        width: direction === "horizontal" ? "100%" : paginationHeight,
        height: direction === "horizontal" ? paginationHeight : "100%",
        display: showAspect ? "flex" : "none",
        maxHeight: direction === "horizontal" ? paginationHeight : "100%",
        maxWidth: direction === "horizontal" ? "100%" : paginationHeight,
        flexDirection: direction === "vertical" ? "column" : "row",
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
};

export default Pagination;
