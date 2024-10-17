import React from "react";
import { CustomButton } from "./CustomButtons";
import { EventType } from "../../@types/types";
export interface MenuModalOptions {
    backgroundColor?: string;
    isVisible: boolean;
    onClose: () => void;
    customButtons?: CustomButton[];
    shareButtons?: boolean;
    position?: string;
    roomName: string;
    adminPasscode: string;
    islevel: string;
    eventType: EventType;
}
export type MenuModalType = (options: MenuModalOptions) => JSX.Element;
/**
 * MenuModal component displays a modal with various options and buttons.
 *
 * @param {string} backgroundColor - The background color of the modal content.
 * @param {boolean} isVisible - Determines if the modal is visible.
 * @param {() => void} onClose - Function to call when the modal is closed.
 * @param {Array} customButtons - Array of custom buttons to display in the modal.
 * @param {boolean} shareButtons - Determines if share buttons should be displayed.
 * @param {string} position - Position of the modal on the screen (e.g., "bottomRight").
 * @param {string} roomName - The name of the room.
 * @param {string} adminPasscode - The admin passcode for the meeting.
 * @param {string} islevel - The level of the user.
 * @param {string} eventType - The type of event.
 *
 * @returns {JSX.Element} The rendered MenuModal component.
 */
declare const MenuModal: React.FC<MenuModalOptions>;
export default MenuModal;
//# sourceMappingURL=MenuModal.d.ts.map