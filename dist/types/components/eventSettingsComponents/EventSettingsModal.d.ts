import React from "react";
import { ModifySettingsOptions } from "../../methods/settingsMethods/modifySettings";
import "./EventSettingsModal.css";
import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";
export interface EventSettingsModalOptions {
    isEventSettingsModalVisible: boolean;
    onEventSettingsClose: () => void;
    onModifyEventSettings?: (options: ModifySettingsOptions) => Promise<void>;
    position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    backgroundColor?: string;
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    updateAudioSetting: (setting: string) => void;
    updateVideoSetting: (setting: string) => void;
    updateScreenshareSetting: (setting: string) => void;
    updateChatSetting: (setting: string) => void;
    updateIsSettingsModalVisible: (isVisible: boolean) => void;
    roomName: string;
    socket: Socket;
    showAlert?: ShowAlert;
}
export type EventSettingsModalType = (options: EventSettingsModalOptions) => JSX.Element;
/**
 * EventSettingsModal component provides a modal interface for modifying event settings.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isEventSettingsModalVisible - Determines if the modal is visible.
 * @param {Function} props.onEventSettingsClose - Callback function to close the modal.
 * @param {Function} [props.onModifyEventSettings=modifySettings] - Callback function to modify event settings.
 * @param {string} props.audioSetting - Initial audio setting.
 * @param {string} props.videoSetting - Initial video setting.
 * @param {string} props.screenshareSetting - Initial screenshare setting.
 * @param {string} props.chatSetting - Initial chat setting.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {Function} props.updateAudioSetting - Callback function to update audio setting.
 * @param {Function} props.updateVideoSetting - Callback function to update video setting.
 * @param {Function} props.updateScreenshareSetting - Callback function to update screenshare setting.
 * @param {Function} props.updateChatSetting - Callback function to update chat setting.
 * @param {Function} props.updateIsSettingsModalVisible - Callback function to update modal visibility.
 * @param {string} props.roomName - Name of the room.
 * @param {Object} props.socket - Socket object for communication.
 * @param {Function} props.showAlert - Callback function to show alerts.
 *
 * @returns {JSX.Element} The rendered EventSettingsModal component.
 */
declare const EventSettingsModal: React.FC<EventSettingsModalOptions>;
export default EventSettingsModal;
//# sourceMappingURL=EventSettingsModal.d.ts.map