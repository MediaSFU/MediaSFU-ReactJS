/**
 * MediasfuChat component handles the chat functionality within a media session.
 * It manages various states and references related to the media session, including
 * user credentials, room details, participants, and recording parameters.
 *
 * @param {Object} props - The properties object.
 * @param {React.ComponentType<any>} [props.PrejoinPage=WelcomePage] - The component to render before joining the chat.
 * @param {Object} [props.credentials={ apiUserName: "", apiKey: "" }] - The credentials for API access.
 * @param {string} props.credentials.apiUserName - The API username.
 * @param {string} props.credentials.apiKey - The API key.
 * @param {boolean} [props.useLocalUIMode=false] - Flag to determine if local UI mode should be used.
 * @param {SeedData} [props.seedData={}] - The seed data for initializing the chat.
 * @param {boolean} [props.useSeed=false] - Flag to determine if seed data should be used.
 * @param {string} [props.imgSrc="https://mediasfu.com/images/logo192.png"] - The image source for the logo.
 *
 * @returns {JSX.Element} The MediasfuChat component.
 */
import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { PreJoinPageOptions, SeedData } from "../../@types/types";
export type MediasfuChatOptions = {
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
declare const MediasfuChat: React.FC<MediasfuChatOptions>;
export default MediasfuChat;
//# sourceMappingURL=MediasfuChat.d.ts.map