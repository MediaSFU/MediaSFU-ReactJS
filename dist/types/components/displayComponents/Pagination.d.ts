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
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    pageButtonProps?: (context: {
        page: number;
        isActive: boolean;
        isHomePage: boolean;
    }) => React.ButtonHTMLAttributes<HTMLButtonElement> | undefined;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        pages: number[];
    }) => React.ReactNode;
    renderPageButton?: (options: {
        defaultButton: React.ReactNode;
        page: number;
        isActive: boolean;
        isHomePage: boolean;
        onSelect: () => Promise<void>;
        label: React.ReactNode;
    }) => React.ReactNode;
    renderPageContent?: (options: {
        defaultContent: React.ReactNode;
        page: number;
        isActive: boolean;
        isHomePage: boolean;
        label: React.ReactNode;
    }) => React.ReactNode;
}
export type PaginationType = (options: PaginationOptions) => React.JSX.Element;
/**
 * Pagination is a React component for navigating pages with support for breakout rooms,
 * custom styling, and flexible layouts.
 *
 * This component handles page navigation in multi-page layouts (especially useful for large
 * participant grids) and integrates with MediaSFU's breakout room system. It supports:
 * - Horizontal and vertical layouts
 * - Custom positioning (top/middle/bottom, left/middle/right)
 * - Active/inactive page styling
 * - Breakout room navigation with socket events
 * - Custom page button and container renderers
 * - Override patterns for use in MediaSFU UI components
 *
 * @component
 * @param {PaginationOptions} props - The properties for the Pagination component.
 * @param {number} props.totalPages - Total number of pages available for navigation.
 * @param {number} props.currentUserPage - Current active page of the user (0-indexed).
 * @param {function} [props.handlePageChange=generatePageContent] - Function to handle page changes. Receives GeneratePageContentOptions.
 * @param {string} [props.position="middle"] - Horizontal alignment: 'left', 'middle', or 'right'.
 * @param {string} [props.location="middle"] - Vertical alignment: 'top', 'middle', or 'bottom'.
 * @param {string} [props.direction="horizontal"] - Layout direction: 'horizontal' or 'vertical'.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Custom styles for the button container.
 * @param {React.CSSProperties} [props.activePageStyle={ backgroundColor: "#2c678f" }] - Styles for the active page button.
 * @param {React.CSSProperties} [props.inactivePageStyle] - Styles for inactive page buttons.
 * @param {string} [props.backgroundColor="#ffffff"] - Background color of the pagination container.
 * @param {number} [props.paginationHeight=40] - Height of the pagination container in pixels.
 * @param {boolean} [props.showAspect=true] - Whether to show the pagination component.
 * @param {PaginationParameters} props.parameters - Parameters for socket events, breakout rooms, and state updates.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML props for the pagination container.
 * @param {Function} [props.pageButtonProps] - Function returning HTML props for page buttons based on context.
 * @param {Function} [props.renderContainer] - Custom render function for the pagination container.
 * @param {Function} [props.renderPageButton] - Custom render function for individual page buttons.
 * @param {Function} [props.renderPageContent] - Custom render function for page button content.
 *
 * @returns {React.JSX.Element} A pagination component for navigating pages.
 *
 * @example
 * **Basic Usage**
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
 * ```
 *
 * @example
 * **Custom Page Button Renderer**
 * ```tsx
 * import React from 'react';
 * import { Pagination } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <Pagination
 *       totalPages={10}
 *       currentUserPage={3}
 *       parameters={parameters}
 *       renderPageButton={({ defaultButton, page, isActive, onSelect }) => (
 *         <button
 *           onClick={onSelect}
 *           style={{
 *             background: isActive ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#e2e8f0',
 *             color: isActive ? 'white' : '#4a5568',
 *             border: 'none',
 *             borderRadius: '50%',
 *             width: 40,
 *             height: 40,
 *             margin: 5,
 *             cursor: 'pointer',
 *             fontWeight: 'bold',
 *             boxShadow: isActive ? '0 4px 10px rgba(102,126,234,0.5)' : 'none'
 *           }}
 *         >
 *           {page}
 *         </button>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Using in uiOverrides (MediasfuGeneric)**
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, Pagination } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomPagination = (props: any) => (
 *     <Pagination
 *       {...props}
 *       direction="vertical"
 *       position="right"
 *       location="middle"
 *       activePageStyle={{
 *         backgroundColor: '#10b981',
 *         color: 'white',
 *         fontWeight: 'bold',
 *         boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
 *       }}
 *       renderContainer={({ defaultContainer }) => (
 *         <div style={{
 *           border: '2px solid #10b981',
 *           borderRadius: 12,
 *           padding: 8,
 *           background: 'rgba(16, 185, 129, 0.1)'
 *         }}>
 *           {defaultContainer}
 *         </div>
 *       )}
 *     />
 *   );
 *
 *   return (
 *     <MediasfuGeneric
 *       useLocalUIMode={true}
 *       useSeed={true}
 *       seedData={mySeedData}
 *       uiOverrides={{
 *         pagination: CustomPagination
 *       }}
 *     />
 *   );
 * }
 * ```
 */
declare const Pagination: React.FC<PaginationOptions>;
export default Pagination;
//# sourceMappingURL=Pagination.d.ts.map