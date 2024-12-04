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
    localLink?: string;
}
export type ShareEventModalType = (options: ShareEventModalOptions) => void;
/**
 * ShareEventModal component renders a modal for sharing event details.
 *
 * @param {ShareEventModalOptions} props - The properties object.
 * @param {string} [props.backgroundColor="rgba(255, 255, 255, 0.25)"] - The background color of the modal content.
 * @param {boolean} props.isShareEventModalVisible - Flag to control the visibility of the modal.
 * @param {() => void} props.onShareEventClose - Callback function to handle the closing of the modal.
 * @param {boolean} [props.shareButtons=true] - Flag to control the visibility of share buttons.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} props.roomName - The name of the room to be shared.
 * @param {string} [props.adminPasscode] - The admin passcode for the meeting.
 * @param {string} [props.islevel] - The level of the user.
 * @param {EventType} props.eventType - The type of the event.
 * @param {string} [props.localLink] - The local link for the event.
 *
 * @returns {JSX.Element} The rendered ShareEventModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ShareEventModal } from 'mediasfu-reactjs';
 *
 * const App = () => {
 *   const handleCloseModal = () => console.log("Modal closed");
 *
 *   return (
 *     <ShareEventModal
 *       backgroundColor="rgba(255, 255, 255, 0.25)"
 *       isShareEventModalVisible={true}
 *       onShareEventClose={handleCloseModal}
 *       shareButtons={true}
 *       position="topRight"
 *       roomName="Room 1"
 *       adminPasscode="1234"
 *       islevel="2"
 *       eventType="meeting"
 *       localLink="http://localhost:3000"
 *     />
 *   );
 * };
 *
 * export default App;
 * ```
 */
declare const ShareEventModal: React.FC<ShareEventModalOptions>;
export default ShareEventModal;
//# sourceMappingURL=ShareEventModal.d.ts.map