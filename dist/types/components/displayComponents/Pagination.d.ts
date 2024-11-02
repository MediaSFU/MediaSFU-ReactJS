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
declare const Pagination: React.FC<PaginationOptions>;
export default Pagination;
//# sourceMappingURL=Pagination.d.ts.map