import React from "react";
import StandardPanelComponent from "./StandardPanelComponent";
import AdvancedPanelComponent from "./AdvancedPanelComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  EventType,
  ConfirmRecordingType,
  StartRecordingType,
  ConfirmRecordingParameters,
  StartRecordingParameters,
} from "../../@types/types";

export interface RecordingModalParameters
  extends ConfirmRecordingParameters,
    StartRecordingParameters {
  recordPaused: boolean;
  recordingVideoType: string;
  recordingDisplayType: "video" | "media" | "all";
  recordingBackgroundColor: string;
  recordingNameTagsColor: string;
  recordingOrientationVideo: string;
  recordingNameTags: boolean;
  recordingAddText: boolean;
  recordingCustomText: string;
  recordingCustomTextPosition: string;
  recordingCustomTextColor: string;
  recordingMediaOptions: string;
  recordingAudioOptions: string;
  recordingVideoOptions: string;
  recordingAddHLS: boolean;
  eventType: EventType;
  updateRecordingVideoType: (value: string) => void;
  updateRecordingDisplayType: (value: "video" | "media" | "all") => void;
  updateRecordingBackgroundColor: (value: string) => void;
  updateRecordingNameTagsColor: (value: string) => void;
  updateRecordingOrientationVideo: (value: string) => void;
  updateRecordingNameTags: (value: boolean) => void;
  updateRecordingAddText: (value: boolean) => void;
  updateRecordingCustomText: (value: string) => void;
  updateRecordingCustomTextPosition: (value: string) => void;
  updateRecordingCustomTextColor: (value: string) => void;
  updateRecordingMediaOptions: (value: string) => void;
  updateRecordingAudioOptions: (value: string) => void;
  updateRecordingVideoOptions: (value: string) => void;
  updateRecordingAddHLS: (value: boolean) => void;

  // mediasfu functions
  getUpdatedAllParams: () => RecordingModalParameters;
  [key: string]: any;
}

export interface RecordingModalOptions {
  isRecordingModalVisible: boolean;
  onClose: () => void;
  backgroundColor?: string;
  position?: string;

  confirmRecording: ConfirmRecordingType;
  startRecording: StartRecordingType;
  parameters: RecordingModalParameters;
}

export type RecordingModalType = (
  options: RecordingModalOptions
) => JSX.Element;

/**
 * RecordingModal component renders a modal for recording settings.
 *
 * @param {object} props - The properties object.
 * @param {boolean} props.isRecordingModalVisible - Determines if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {string} [props.position="bottomRight"] - Position of the modal on the screen.
 * @param {function} props.confirmRecording - Function to call when confirming the recording.
 * @param {function} props.startRecording - Function to call when starting the recording.
 * @param {object} props.parameters - Parameters for the recording.
 * @param {boolean} props.parameters.recordPaused - Indicates if the recording is paused.
 *
 * @returns {JSX.Element} The rendered RecordingModal component.
 */
const RecordingModal: React.FC<RecordingModalOptions> = ({
  isRecordingModalVisible,
  onClose,
  backgroundColor = "#83c0e9",
  position = "bottomRight",
  confirmRecording,
  startRecording,
  parameters,
}) => {
  const { recordPaused } = parameters;

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
    display: isRecordingModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "85%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <h2
              style={{
                fontSize: "x-large",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Recording Settings
            </h2>
            <button
              onClick={onClose}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size="xl"
                style={{ fontSize: 20, color: "black" }}
              />
            </button>
          </div>
          <hr
            style={{
              height: 1,
              backgroundColor: "black",
              marginTop: 5,
              marginBottom: 5,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(100% - 120px)",
                padding: 0,
              }}
            >
              <div style={{ margin: 0, padding: 0 }}>
                <StandardPanelComponent parameters={parameters} />
                <AdvancedPanelComponent parameters={parameters} />
              </div>
            </div>
            <div
              style={{
                height: 1,
                backgroundColor: "white",
                marginTop: 0,
                marginBottom: 0,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <button
                onClick={() =>
                  confirmRecording({ parameters: { ...parameters } })
                }
                style={{
                  flex: 1,
                  padding: 5,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 10px",
                  background: "#4CAF50",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: "black", fontSize: 14 }}>Confirm</span>
              </button>
              {!recordPaused && (
                <button
                  onClick={() =>
                    startRecording({ parameters: { ...parameters } })
                  }
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 10px",
                    background: "#f44336",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "black", fontSize: 14 }}>
                    Start <i className="fas fa-play" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;
