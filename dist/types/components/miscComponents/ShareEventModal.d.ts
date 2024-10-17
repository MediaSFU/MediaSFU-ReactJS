import React from "react";
import { EventType } from "../../@types/types";
export interface ShareEventModalOptions {
    backgroundColor?: string;
    isShareEventModalVisible: boolean;
    onShareEventClose: () => void;
    shareButtons?: boolean;
    position?: string;
    roomName: string;
    adminPasscode?: string;
    islevel?: string;
    eventType: EventType;
}
export type ShareEventModalType = (options: ShareEventModalOptions) => void;
/**
 * ShareEventModal component renders a modal for sharing event details.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.backgroundColor="rgba(255, 255, 255, 0.25)"] - The background color of the modal content.
 * @param {boolean} props.isShareEventModalVisible - Flag to control the visibility of the modal.
 * @param {Function} props.onShareEventClose - Callback function to handle the closing of the modal.
 * @param {boolean} [props.shareButtons=true] - Flag to control the visibility of share buttons.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} props.roomName - The name of the room to be shared.
 * @param {string} props.adminPasscode - The admin passcode for the meeting.
 * @param {string} props.islevel - The level of the user.
 * @param {string} props.eventType - The type of the event.
 *
 * @returns {JSX.Element} The rendered ShareEventModal component.
 */
declare const ShareEventModal: React.FC<ShareEventModalOptions>;
export default ShareEventModal;
//# sourceMappingURL=ShareEventModal.d.ts.map