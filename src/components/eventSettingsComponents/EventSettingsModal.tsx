
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  modifySettings,
  ModifySettingsOptions,
} from "../../methods/settingsMethods/modifySettings";
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
const EventSettingsModal: React.FC<EventSettingsModalOptions> = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  audioSetting,
  videoSetting,
  screenshareSetting,
  chatSetting,
  position = "topRight",
  backgroundColor = "#83c0e9",
  updateAudioSetting,
  updateVideoSetting,
  updateScreenshareSetting,
  updateChatSetting,
  updateIsSettingsModalVisible,
  roomName,
  socket,
  showAlert,
}) => {
  const [audioState, setAudioState] = useState<string>(audioSetting);
  const [videoState, setVideoState] = useState<string>(videoSetting);
  const [screenshareState, setScreenshareState] =
    useState<string>(screenshareSetting);
  const [chatState, setChatState] = useState<string>(chatSetting);

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isEventSettingsModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "65%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  useEffect(() => {
    if (isEventSettingsModalVisible) {
      setAudioState(audioSetting);
      setVideoState(videoSetting);
      setScreenshareState(screenshareSetting);
      setChatState(chatSetting);
    }
  }, [isEventSettingsModalVisible]);

  const closeModal = () => {
    onEventSettingsClose();
  };

  const handleSaveSettings = async () => {
    await onModifyEventSettings({
      audioSet: audioState,
      videoSet: videoState,
      screenshareSet: screenshareState,
      chatSet: chatState,
      updateAudioSetting: updateAudioSetting,
      updateVideoSetting: updateVideoSetting,
      updateScreenshareSetting: updateScreenshareSetting,
      updateChatSetting: updateChatSetting,
      updateIsSettingsModalVisible: updateIsSettingsModalVisible,
      roomName,
      socket,
      showAlert,
    });
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">Event Settings</div>
          <div onClick={closeModal} style={{ padding: 5 }}>
            <FontAwesomeIcon icon={faTimes} className="icon" size="xl" />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <label className="label">User audio:</label>
            <select
              className="picker-select"
              value={audioState}
              onChange={(e) => setAudioState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User video:</label>
            <select
              className="picker-select"
              value={videoState}
              onChange={(e) => setVideoState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User screenshare:</label>
            <select
              className="picker-select"
              value={screenshareState}
              onChange={(e) => setScreenshareState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
              <option value="approval">Upon approval</option>
            </select>
          </div>
          <div className="sep"></div>
          <div className="form-group">
            <label className="label">User chat:</label>
            <select
              className="picker-select"
              value={chatState}
              onChange={(e) => setChatState(e.target.value)}
            >
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-apply-settings" onClick={handleSaveSettings}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSettingsModal;
