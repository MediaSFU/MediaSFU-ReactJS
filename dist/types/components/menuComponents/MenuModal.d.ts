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
    localLink?: string;
}
export type MenuModalType = (options: MenuModalOptions) => JSX.Element;
/**
 * MenuModal component displays a modal with various options and buttons.
 *
 * @component
 * @param {MenuModalOptions} options - The options for the MenuModal component.
 * @param {string} [options.backgroundColor="#83c0e9"] - Background color of the modal content.
 * @param {boolean} options.isVisible - Determines if the modal is visible.
 * @param {() => void} options.onClose - Function to call when the modal is closed.
 * @param {CustomButton[]} [options.customButtons=[]] - Array of custom buttons to display in the modal.
 * @param {boolean} [options.shareButtons=true] - Determines if share buttons should be displayed.
 * @param {string} [options.position="bottomRight"] - Position of the modal on the screen (e.g., "bottomRight").
 * @param {string} options.roomName - The name of the room.
 * @param {string} options.adminPasscode - The admin passcode for the meeting.
 * @param {string} options.islevel - The level of the user.
 * @param {EventType} options.eventType - The type of event.
 * @param {string} [options.localLink] - The local link for the event.
 *
 * @returns {JSX.Element} The rendered MenuModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MenuModal } from 'mediasfu-reactjs';
 * import { faSpinner } from '@fortawesome/free-solid-svg-icons';
 *
 * const customButtons = [
 *   {
 *     action: () => console.log("Button 1 clicked"),
 *     show: true,
 *     backgroundColor: "blue",
 *     disabled: false,
 *     icon: faSpinner,
 *     iconStyle: { color: "white" },
 *     text: "Button 1",
 *     textStyle: { color: "white" },
 *   },
 *   {
 *     action: () => console.log("Button 2 clicked"),
 *     show: true,
 *     backgroundColor: "red",
 *     disabled: false,
 *     icon: faSpinner,
 *     iconStyle: { color: "white" },
 *     text: "Button 2",
 *     textStyle: { color: "white" },
 *   },
 * ];
 *
 * const App = () => (
 *   <MenuModal
 *     backgroundColor="#83c0e9"
 *     isVisible={true}
 *     onClose={() => console.log("Modal closed")}
 *     customButtons={customButtons}
 *     shareButtons={true}
 *     position="bottomRight"
 *     roomName="1234567890"
 *     adminPasscode="1234"
 *     islevel="2"
 *     eventType="meeting"
 *     localLink="http://localhost:3000"
 *   />
 * );
 *
 * export default App;
 * ```
 */
declare const MenuModal: React.FC<MenuModalOptions>;
export default MenuModal;
//# sourceMappingURL=MenuModal.d.ts.map