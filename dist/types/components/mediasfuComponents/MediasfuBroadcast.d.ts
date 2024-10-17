/**
 * MediasfuBroadcast component options.
 *
 * @typedef {Object} MediasfuBroadcastOptions
 * @property {function} [PrejoinPage=WelcomePage] - Component to render for the pre-join page.
 * @property {Object} [credentials] - Credentials for API access.
 * @property {string} [credentials.apiUserName] - API username.
 * @property {string} [credentials.apiKey] - API key.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {Object} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 *
 * @typedef {Object} SeedData
 * @property {string} [member] - The member name.
 * @property {string} [host] - The host name.
 * @property {EventType} [eventType] - The type of event.
 * @property {Participant[]} [participants] - The list of participants.
 * @property {Message[]} [messages] - The list of messages.
 * @property {Poll[]} [polls] - The list of polls.
 * @property {BreakoutParticipant[][]} [breakoutRooms] - The list of breakout rooms.
 * @property {Request[]} [requests] - The list of requests.
 * @property {WaitingRoomParticipant[]} [waitingList] - The list of waiting room participants.
 * @property {WhiteboardUser[]} [whiteboardUsers] - The list of whiteboard users.
 */
/**
 * MediasfuBroadcast component.
 *
 * @component
 * @param {MediasfuBroadcastOptions} props - Component properties.
 * @returns {React.ReactNode} The rendered component.
 */
import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { PreJoinPageOptions, SeedData } from "../../@types/types";
export type MediasfuBroadcastOptions = {
    PrejoinPage?: (options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode;
    credentials?: {
        apiUserName: string;
        apiKey: string;
    };
    useLocalUIMode?: boolean;
    seedData?: SeedData;
    useSeed?: boolean;
    imgSrc?: string;
};
declare const MediasfuBroadcast: React.FC<MediasfuBroadcastOptions>;
export default MediasfuBroadcast;
//# sourceMappingURL=MediasfuBroadcast.d.ts.map