import React from "react";
import { GeneratePageContentOptions, GeneratePageContentParameters } from "../../consumers/generatePageContent";
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
declare const Pagination: React.FC<PaginationOptions>;
export default Pagination;
//# sourceMappingURL=Pagination.d.ts.map