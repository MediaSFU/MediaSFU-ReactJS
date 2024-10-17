import React from "react";
import { ConnectSocketType, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface PreJoinPageParameters {
    imgSrc?: string;
    showAlert?: ShowAlert;
    updateIsLoadingModalVisible: (visible: boolean) => void;
    connectSocket: ConnectSocketType;
    updateSocket: (socket: Socket) => void;
    updateValidated: (validated: boolean) => void;
    updateApiUserName: (userName: string) => void;
    updateApiToken: (token: string) => void;
    updateLink: (link: string) => void;
    updateRoomName: (roomName: string) => void;
    updateMember: (member: string) => void;
}
export interface Credentials {
    apiUserName: string;
    apiKey: string;
}
export interface PreJoinPageOptions {
    parameters: PreJoinPageParameters;
    credentials?: Credentials;
}
export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;
export interface CreateJoinRoomResponse {
    message: string;
    roomName: string;
    secureCode?: string;
    publicURL: string;
    link: string;
    secret: string;
    success: boolean;
}
export interface CreateJoinRoomError {
    error: string;
    success?: boolean;
}
export type CreateJoinRoomType = (options: {
    payload: any;
    apiUserName: string;
    apiKey: string;
}) => Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;
export type CreateRoomOnMediaSFUType = (options: {
    payload: any;
    apiUserName: string;
    apiKey: string;
}) => Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;
export declare function joinRoomOnMediaSFU({ payload, apiUserName, apiKey, }: {
    payload: any;
    apiUserName: string;
    apiKey: string;
}): Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;
export declare function createRoomOnMediaSFU({ payload, apiUserName, apiKey, }: {
    payload: any;
    apiUserName: string;
    apiKey: string;
}): Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;
/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 *
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {Object} props.parameters - Various parameters required for the component.
 * @param {Function} props.parameters.showAlert - Function to show alert messages.
 * @param {Function} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {Function} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Function} props.parameters.updateSocket - Function to update the socket.
 * @param {Function} props.parameters.updateValidated - Function to update the validation status.
 * @param {Function} props.parameters.updateApiUserName - Function to update the API username.
 * @param {Function} props.parameters.updateApiToken - Function to update the API token.
 * @param {Function} props.parameters.updateLink - Function to update the link.
 * @param {Function} props.parameters.updateRoomName - Function to update the room name.
 * @param {Function} props.parameters.updateMember - Function to update the member.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Object} [props.credentials=user_credentials] - The user credentials.
 *
 * @returns {JSX.Element} The rendered PreJoinPage component.
 *
 * @example
 * <PreJoinPage
 *   parameters={{
 *     showAlert: showAlertFunction,
 *     updateIsLoadingModalVisible: updateLoadingFunction,
 *     connectSocket: connectSocketFunction,
 *     updateSocket: updateSocketFunction,
 *     updateValidated: updateValidatedFunction,
 *     updateApiUserName: updateApiUserNameFunction,
 *     updateApiToken: updateApiTokenFunction,
 *     updateLink: updateLinkFunction,
 *     updateRoomName: updateRoomNameFunction,
 *     updateMember: updateMemberFunction,
 *     imgSrc: "https://example.com/logo.png"
 *   }}
 *   credentials={{
 *     apiUserName: "user123",
 *     apiKey: "apikey123"
 *   }}
 * />
 */
declare const PreJoinPage: React.FC<PreJoinPageOptions>;
export default PreJoinPage;
//# sourceMappingURL=PreJoinPage.d.ts.map