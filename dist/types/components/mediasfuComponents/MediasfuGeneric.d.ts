import React from "react";
import './MediasfuCSS.css';
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions, JoinRoomOnMediaSFUType, CreateRoomOnMediaSFUType } from "../../@types/types";
export type MediasfuGenericOptions = {
    PrejoinPage?: (options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode;
    localLink?: string;
    connectMediaSFU?: boolean;
    credentials?: {
        apiUserName: string;
        apiKey: string;
    };
    useLocalUIMode?: boolean;
    seedData?: SeedData;
    useSeed?: boolean;
    imgSrc?: string;
    sourceParameters?: {
        [key: string]: any;
    };
    updateSourceParameters?: (data: {
        [key: string]: any;
    }) => void;
    returnUI?: boolean;
    noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
    joinMediaSFURoom?: JoinRoomOnMediaSFUType;
    createMediaSFURoom?: CreateRoomOnMediaSFUType;
};
/**
 * MediasfuGeneric component provides and combines the generic functionalities for MediaSFU.
 * It supports webinar, broadcast, chat, conference views
 * Participants can share media (audio, video, screen share) with each other.
 * Participants can chat with each other and engage in polls and breakout rooms, share screens, and more during the conference.
 *
 * @typedef {Object} MediasfuGenericOptions
 * @property {function} [PrejoinPage=WelcomePage] - Function to render the prejoin page.
 * @property {string} [localLink=""] - Local link for the media server (if using Community Edition).
 * @property {boolean} [connectMediaSFU=true] - Flag to connect to the MediaSFU server (if using Community Edition and still need to connect to the server)
 * @property {Object} [credentials={ apiUserName: "", apiKey: "" }] - API credentials.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {SeedData} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 * @property {Object} [sourceParameters={}] - Source parameters.
 * @property {function} [updateSourceParameters] - Function to update source parameters.
 * @property {boolean} [returnUI=true] - Flag to return the UI.
 * @property {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [noUIPreJoinOptions] - Options for the prejoin page.
 * @property {JoinRoomOnMediaSFUType} [joinMediaSFURoom] - Function to join a room on MediaSFU.
 * @property {CreateRoomOnMediaSFUType} [createMediaSFURoom] - Function to create a room on MediaSFU.
 *
 * MediasfuGeneric component.
 *
 * @component
 * @param {MediasfuGenericOptions} props - Component properties.
 * @returns {React.FC<MediasfuGenericOptions>} - React functional component.
 *
 * @example
 * ```tsx
 * <MediasfuGeneric
 *   PrejoinPage={CustomPrejoinPage}
 *   localLink="https://localhost:3000"
 *   connectMediaSFU={true}
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   useLocalUIMode={true}
 *   seedData={customSeedData}
 *   useSeed={true}
 *   imgSrc="https://example.com/logo.png"
 *   sourceParameters={{ key: value }}
 *   updateSourceParameters={updateSourceParameters}
 *   returnUI={true}
 *   noUIPreJoinOptions={customPreJoinOptions}
 *   joinMediaSFURoom={joinRoomOnMediaSFU}
 *   createMediaSFURoom={createRoomOnMediaSFU}
 * />
 * ```
 *
 * @description
 * This component handles the generic functionalities for MediaSFU, including joining rooms,
 * managing participants, and handling media streams. It uses various hooks and methods to
 * manage state and perform actions such as joining a room, updating initial values, and
 * handling media streams.
 *
 */
declare const MediasfuGeneric: React.FC<MediasfuGenericOptions>;
export default MediasfuGeneric;
//# sourceMappingURL=MediasfuGeneric.d.ts.map