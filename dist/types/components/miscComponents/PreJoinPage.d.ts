import React from "react";
import { ConnectSocketType, ShowAlert, ConnectLocalSocketType, RecordingParams, MeetingRoomParams, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from "../../@types/types";
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType } from "../../methods/utils/joinRoomOnMediaSFU";
import { Socket } from "socket.io-client";
export interface JoinLocalEventRoomParameters {
    eventID: string;
    userName: string;
    secureCode?: string;
    videoPreference?: string | null;
    audioPreference?: string | null;
    audioOutputPreference?: string | null;
}
export interface JoinLocalEventRoomOptions {
    joinData: JoinLocalEventRoomParameters;
    link?: string;
}
export interface CreateLocalRoomParameters {
    eventID: string;
    duration: number;
    capacity: number;
    userName: string;
    scheduledDate: Date;
    secureCode: string;
    waitRoom?: boolean;
    recordingParams?: RecordingParams;
    eventRoomParams?: MeetingRoomParams;
    videoPreference?: string | null;
    audioPreference?: string | null;
    audioOutputPreference?: string | null;
    mediasfuURL?: string;
}
export interface CreateLocalRoomOptions {
    createData: CreateLocalRoomParameters;
    link?: string;
}
export interface CreateJoinLocalRoomResponse {
    success: boolean;
    secret: string;
    reason?: string;
    url?: string;
}
export interface PreJoinPageParameters {
    imgSrc?: string;
    showAlert?: ShowAlert;
    updateIsLoadingModalVisible: (visible: boolean) => void;
    connectSocket: ConnectSocketType;
    connectLocalSocket?: ConnectLocalSocketType;
    updateSocket: (socket: Socket) => void;
    updateLocalSocket?: (socket: Socket) => void;
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
    localLink?: string;
    connectMediaSFU?: boolean;
    parameters: PreJoinPageParameters;
    credentials?: Credentials;
    returnUI?: boolean;
    noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
    createMediaSFURoom?: CreateRoomOnMediaSFUType;
    joinMediaSFURoom?: JoinRoomOnMediaSFUType;
}
export type PreJoinPageType = (options: PreJoinPageOptions) => React.JSX.Element;
/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 *
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {PreJoinPageParameters} props.parameters - Various parameters required for the component.
 * @param {ShowAlert} [props.parameters.showAlert] - Function to show alert messages.
 * @param {() => void} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {ConnectSocketType} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Socket} props.parameters.updateSocket - Function to update the socket.
 * @param {() => void} props.parameters.updateValidated - Function to update the validation status.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Credentials} [props.credentials=user_credentials] - The user credentials containing the API username and API key.
 * @param {boolean} [props.returnUI=false] - Flag to determine if the component should return the UI.
 * @param {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [props.noUIPreJoinOptions] - The options for creating/joining a room without UI.
 * @param {string} [props.localLink=""] - The link to the local server.
 * @param {boolean} [props.connectMediaSFU=true] - Flag to determine if the component should connect to MediaSFU.
 * @param {CreateRoomOnMediaSFUType} [props.createMediaSFURoom] - Function to create a room on MediaSFU.
 * @param {JoinRoomOnMediaSFUType} [props.joinMediaSFURoom] - Function to join a room on MediaSFU.
 *
 * @returns {React.JSX.Element} The rendered PreJoinPage component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * import { JoinLocalRoomOptions } from 'mediasfu-reactjs';
 *
 * const App = () => {
 *   const showAlertFunction = (message: string) => console.log(message);
 *   const updateLoadingFunction = (visible: boolean) => console.log(`Loading: ${visible}`);
 *   const connectSocketFunction = () => {}; // Connect socket function
 *   const updateSocketFunction = (socket: Socket) => {}; // Update socket function
 *   const updateValidatedFunction = (validated: boolean) => {}; // Update validated function
 *   const updateApiUserNameFunction = (userName: string) => {}; // Update API username function
 *   const updateApiTokenFunction = (token: string) => {}; // Update API token function
 *   const updateLinkFunction = (link: string) => {}; // Update link function
 *   const updateRoomNameFunction = (roomName: string) => {}; // Update room name function
 *   const updateMemberFunction = (member: string) => {}; // Update member function
 *
 *   return (
 *     <PreJoinPage
 *       parameters={{
 *         showAlert: showAlertFunction,
 *         updateIsLoadingModalVisible: updateLoadingFunction,
 *         connectSocket: connectSocketFunction,
 *         updateSocket: updateSocketFunction,
 *         updateValidated: updateValidatedFunction,
 *         updateApiUserName: updateApiUserNameFunction,
 *         updateApiToken: updateApiTokenFunction,
 *         updateLink: updateLinkFunction,
 *         updateRoomName: updateRoomNameFunction,
 *         updateMember: updateMemberFunction,
 *         imgSrc: "https://example.com/logo.png"
 *       }}
 *       credentials={{
 *         apiUserName: "user123",
 *         apiKey: "apikey123"
 *       }}
 *      returnUI={true}
 *      noUIPreJoinOptions={{
 *      action: "create",
 *      capacity: 10,
 *      duration: 15,
 *      eventType: "broadcast",
 *      userName: "Prince",
 *      }}
 *      connectMediaSFU={true}
 *      localLink="http://localhost:3000"
 *     />
 *   );
 * };
 *
 *
 * export default App;
 * ```
 */
declare const PreJoinPage: React.FC<PreJoinPageOptions>;
export default PreJoinPage;
//# sourceMappingURL=PreJoinPage.d.ts.map