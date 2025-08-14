import React from "react";
import { Socket } from "socket.io-client";
import { ConnectSocketType } from "../../sockets/SocketManager";
import { ShowAlert } from "../../@types/types";
export interface WelcomePageParameters {
    imgSrc?: string;
    showAlert?: ShowAlert;
    updateIsLoadingModalVisible: (visible: boolean) => void;
    connectSocket: ConnectSocketType;
    updateSocket: (socket: Socket) => void;
    updateValidated: (validated: boolean) => void;
    updateApiUserName: (apiUserName: string) => void;
    updateApiToken: (apiToken: string) => void;
    updateLink: (link: string) => void;
    updateRoomName: (roomName: string) => void;
    updateMember: (userName: string) => void;
}
export interface WelcomePageOptions {
    parameters: WelcomePageParameters;
}
export type WelcomePageType = (options: WelcomePageOptions) => React.JSX.Element;
/**
 * WelcomePage component allows users to enter event details manually or by scanning a QR code.
 * It validates the input and attempts to connect to a socket with the provided credentials.
 *
 * @component
 * @param {WelcomePageOptions} parameters - The parameters for the WelcomePage component.
 * @param {Function} parameters.showAlert - Function to show alert messages.
 * @param {Function} parameters.updateIsLoadingModalVisible - Function to update loading modal visibility.
 * @param {Function} parameters.connectSocket - Function to connect to a socket.
 * @param {Function} parameters.updateSocket - Function to update the socket state.
 * @param {Function} parameters.updateValidated - Function to update validation state.
 * @param {Function} parameters.updateApiUserName - Function to update API username.
 * @param {Function} parameters.updateApiToken - Function to update API token.
 * @param {Function} parameters.updateLink - Function to update the event link.
 * @param {Function} parameters.updateRoomName - Function to update the room name.
 * @param {Function} parameters.updateMember - Function to update the member name.
 *
 * @returns {React.JSX.Element} The rendered WelcomePage component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { WelcomePage } from 'mediasfu-reactjs';
 *
 * const parameters = {
 *   showAlert: (message) => console.log(message),
 *   updateIsLoadingModalVisible: (visible) => console.log(visible),
 *   connectSocket: (socket) => console.log(socket),
 *   updateSocket: (socket) => console.log(socket),
 *   updateValidated: (validated) => console.log(validated),
 *   updateApiUserName: (apiUserName) => console.log(apiUserName),
 *   updateApiToken: (apiToken) => console.log(apiToken),
 *   updateLink: (link) => console.log(link),
 *   updateRoomName: (roomName) => console.log(roomName),
 *   updateMember: (userName) => console.log(userName),
 * };
 *
 * <WelcomePage parameters={parameters} />
 * ```
 */
declare const WelcomePage: React.FC<WelcomePageOptions>;
export default WelcomePage;
//# sourceMappingURL=WelcomePage.d.ts.map