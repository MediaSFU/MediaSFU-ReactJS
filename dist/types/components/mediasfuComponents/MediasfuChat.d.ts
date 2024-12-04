import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { PreJoinPageOptions, SeedData } from "../../@types/types";
export type MediasfuChatOptions = {
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
};
/**
 * MediasfuChat component optimizes the media experience for chatting events.
 * Only 2 participants can share media (audio, video, *no screen share support*) with each other.
 * Participants can view each other's media and chat with each other.
 * It manages various states and references related to the media session, including
 * user credentials, room details, participants, and recording parameters.
 *
 * @param {Object} props - The properties object.
 * @param {React.ComponentType<any>} [props.PrejoinPage=WelcomePage] - The component to render before joining the chat.
 * @param {string} [props.localLink=""] - The local link for the media server.
 * @param {boolean} [props.connectMediaSFU=false] - Flag to determine if the media server should be connected.
 * @param {Object} [props.credentials={ apiUserName: "", apiKey: "" }] - The credentials for API access.
 * @param {string} props.credentials.apiUserName - The API username.
 * @param {string} props.credentials.apiKey - The API key.
 * @param {boolean} [props.useLocalUIMode=false] - Flag to determine if local UI mode should be used.
 * @param {SeedData} [props.seedData={}] - The seed data for initializing the chat.
 * @param {boolean} [props.useSeed=false] - Flag to determine if seed data should be used.
 * @param {string} [props.imgSrc="https://mediasfu.com/images/logo192.png"] - The image source for the logo.
 *
 * @returns {JSX.Element} The MediasfuChat component.
 *
 * @example
 * ```tsx
 * const PrejoinPage = WelcomePage;
 * const credentials = {
 * apiUserName: "username",
 * apiKey: "key",
 * };
 * const useLocalUIMode = false;
 * const seedData = {};
 * const useSeed = false;
 * const imgSrc = "https://mediasfu.com/images/logo192.png";
 *
 * return (
 * <MediasfuChat
 * PrejoinPage={PrejoinPage}
 * credentials={credentials}
 * useLocalUIMode={useLocalUIMode}
 * seedData={seedData}
 * useSeed={useSeed}
 * imgSrc={imgSrc}
 * />
 * );
 * ```
 *
 */
declare const MediasfuChat: React.FC<MediasfuChatOptions>;
export default MediasfuChat;
//# sourceMappingURL=MediasfuChat.d.ts.map