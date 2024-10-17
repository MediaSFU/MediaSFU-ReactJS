 
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
 * Pagination component for navigating through pages.
 *
 * @component
 * @param {PaginationOptions} props - The properties for the Pagination component.
 * @param {number} props.totalPages - The total number of pages.
 * @param {number} props.currentUserPage - The current page of the user.
 * @param {function} [props.handlePageChange=generatePageContent] - Function to handle page change.
 * @param {string} [props.position="middle"] - The position of the pagination (left, middle, right).
 * @param {string} [props.location="middle"] - The location of the pagination (top, middle, bottom).
 * @param {string} [props.direction="horizontal"] - The direction of the pagination (horizontal, vertical).
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Custom styles for the buttons container.
 * @param {React.CSSProperties} [props.activePageStyle={ backgroundColor: "#2c678f" }] - Custom styles for the active page button.
 * @param {React.CSSProperties} [props.inactivePageStyle] - Custom styles for the inactive page buttons.
 * @param {string} [props.backgroundColor="#ffffff"] - Background color of the pagination container.
 * @param {number} [props.paginationHeight=40] - Height of the pagination container.
 * @param {boolean} [props.showAspect=true] - Flag to show or hide the pagination.
 * @param {object} props.parameters - Additional parameters for the pagination.
 *
 * @returns {JSX.Element} The rendered Pagination component.
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
