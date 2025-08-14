import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { EventType } from "../../@types/types";
export interface ShareButton {
    icon: IconDefinition;
    action: () => void;
    show: boolean;
    color?: string;
    iconColor?: string;
}
export interface ShareButtonsComponentOptions {
    meetingID: string;
    shareButtons?: ShareButton[];
    eventType: EventType;
    localLink?: string;
}
export type ShareButtonsComponentType = (options: ShareButtonsComponentOptions) => React.JSX.Element;
/**
 * ShareButtonsComponent is a React functional component that renders a set of share buttons.
 * These buttons allow users to share a meeting link via various platforms such as clipboard, email, Facebook, WhatsApp, and Telegram.
 *
 * @param {ShareButtonsComponentOptions} props - The properties for the component.
 * @param {string} props.meetingID - The unique identifier for the meeting.
 * @param {ShareButton[]} [props.shareButtons=[]] - An optional array of share buttons to display. If not provided, default share buttons will be used.
 * @param {EventType} props.eventType - The type of event, which can be "chat", "broadcast", or "meeting". This determines the URL structure for sharing.
 * @param {string} [props.localLink=""] - An optional local link to use for sharing the event.
 *
 * @returns {React.JSX.Element} The rendered component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ShareButtonsComponent } from 'mediasfu-reactjs';
 * import { faTwitter } from '@fortawesome/free-brands-svg-icons';
 *
 * const customShareButtons = [
 *   {
 *     icon: faTwitter,
 *     action: () => window.open("https://twitter.com/intent/tweet?text=Join+my+meeting!", "_blank"),
 *     show: true,
 *     color: "#1DA1F2",
 *     iconColor: "#ffffff",
 *   },
 * ];
 *
 * const App = () => (
 *   <ShareButtonsComponent
 *     meetingID="1234567890"
 *     eventType="meeting"
 *     shareButtons={customShareButtons}
 *     localLink="https://example.com/meeting"
 *   />
 * );
 *
 * export default App;
 * ```
 */
declare const ShareButtonsComponent: React.FC<ShareButtonsComponentOptions>;
export default ShareButtonsComponent;
//# sourceMappingURL=ShareButtonsComponent.d.ts.map