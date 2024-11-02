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
/**
 * MediasfuBroadcast component optimizes the media experience for broadcasting events.
 * Only the host can share media (audio, video, *no screen share support*) with participants.
 * Participants can view the host's media and chat with each other.
 * It manages various states and references related to the media session, including
 * user credentials, room details, participants, and recording parameters.
 *
 * @typedef {Object} MediasfuBroadcastOptions - Configuration options for the MediasfuBroadcast component.
 * @property {React.ComponentType<PreJoinPageOptions | WelcomePageOptions>} [PrejoinPage=WelcomePage] - Component to render for the pre-join page.
 * @property {{ apiUserName: string; apiKey: string }} [credentials={ apiUserName: "", apiKey: "" }] - Credentials for API access.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {Object} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 *
 * @typedef {Object} SeedData - Data structure to populate initial state in the MediasfuBroadcast.
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
 *
 * @component
 * @param {MediasfuBroadcastOptions} props - Component properties.
 * @returns {React.ReactNode} The rendered component.
 *
 * @example
 * ```tsx
 * <MediasfuBroadcast
 *   PrejoinPage={WelcomePage}
 *   credentials={{ apiUserName: "username", apiKey: "apikey" }}
 *   useLocalUIMode={false}
 *   seedData={{}}
 *   useSeed={false}
 *   imgSrc="https://mediasfu.com/images/logo192.png"
 * />
 * ```
 */
declare const MediasfuBroadcast: React.FC<MediasfuBroadcastOptions>;
export default MediasfuBroadcast;
//# sourceMappingURL=MediasfuBroadcast.d.ts.map