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
) => React.JSX.Element;

/**
 * RecordingModal component provides an interface for configuring and controlling
 * recording settings within a modal. This component enables users to customize
 * recording parameters, such as video and display type, background color, custom text,
 * and orientation, and to initiate or confirm the recording process.
 *
 * @component
 * @param {boolean} isRecordingModalVisible - Controls the visibility of the modal.
 * @param {() => void} onClose - Callback function for closing the modal.
 * @param {string} [backgroundColor="#83c0e9"] - Background color of the modal content.
 * @param {string} [position="bottomRight"] - Screen position for the modal (e.g., "bottomRight").
 * @param {ConfirmRecordingType} confirmRecording - Function for confirming recording settings.
 * @param {StartRecordingType} startRecording - Function for starting the recording process.
 * @param {RecordingModalParameters} parameters - Object containing all customizable recording parameters.
 * @param {boolean} parameters.recordPaused - Indicates if recording is currently paused.
 * @param {string} parameters.recordingVideoType - Specifies the video type for recording.
 * @param {("video" | "media" | "all")} parameters.recordingDisplayType - Display type for recording.
 * @param {string} parameters.recordingBackgroundColor - Background color during recording.
 * @param {string} parameters.recordingNameTagsColor - Color of name tags in recording.
 * @param {string} parameters.recordingOrientationVideo - Orientation setting for video.
 * @param {boolean} parameters.recordingNameTags - Indicates if name tags are shown.
 * @param {boolean} parameters.recordingAddText - Specifies if custom text is added to recording.
 * @param {string} parameters.recordingCustomText - Text to be displayed in recording.
 * @param {string} parameters.recordingCustomTextPosition - Position for custom text.
 * @param {string} parameters.recordingCustomTextColor - Color of custom text.
 * @param {string} parameters.recordingMediaOptions - Media options for recording.
 * @param {string} parameters.recordingAudioOptions - Audio options for recording.
 * @param {string} parameters.recordingVideoOptions - Video options for recording.
 * @param {boolean} parameters.recordingAddHLS - Specifies if HLS is added to recording.
 * @param {EventType} parameters.eventType - Type of event the recording is associated with.
 * @param {Function} parameters.updateRecordingVideoType - Function to update video type.
 * @param {Function} parameters.updateRecordingDisplayType - Function to update display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Function to update background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Function to update name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Function to update orientation.
 * @param {Function} parameters.updateRecordingNameTags - Function to toggle name tags.
 * @param {Function} parameters.updateRecordingAddText - Function to toggle custom text.
 * @param {Function} parameters.updateRecordingCustomText - Function to set custom text.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Function to set custom text position.
 * @param {Function} parameters.updateRecordingCustomTextColor - Function to set custom text color.
 * @param {Function} parameters.updateRecordingMediaOptions - Function to set media options.
 * @param {Function} parameters.updateRecordingAudioOptions - Function to set audio options.
 * @param {Function} parameters.updateRecordingVideoOptions - Function to set video options.
 * @param {Function} parameters.updateRecordingAddHLS - Function to toggle HLS in recording.
 * 
 * @example
 * ```tsx
 * import { RecordingModal } from 'mediasfu-reactjs';
 *
 * // Define the recording parameters
 * const recordingParams = {
 *   recordPaused: false,
 *   recordingVideoType: "bestDisplay",
 *   recordingDisplayType: "video",
 *   recordingBackgroundColor: "#000000",
 *   recordingNameTagsColor: "#FFFFFF",
 *   recordingOrientationVideo: "landscape",
 *   recordingNameTags: true,
 *   recordingAddText: true,
 *   recordingCustomText: "Sample Text",
 *   recordingCustomTextPosition: "top",
 *   recordingCustomTextColor: "#FF0000",
 *   recordingMediaOptions: "option1",
 *   recordingAudioOptions: "option2",
 *   recordingVideoOptions: "option3",
 *   recordingAddHLS: true,
 *   eventType: "meeting",
 *   updateRecordingVideoType: (value) => console.log(value),
 *   updateRecordingDisplayType: (value) => console.log(value),
 *   updateRecordingBackgroundColor: (value) => console.log(value),
 *   updateRecordingNameTagsColor: (value) => console.log(value),
 *   updateRecordingOrientationVideo: (value) => console.log(value),
 *   updateRecordingNameTags: (value) => console.log(value),
 *   updateRecordingAddText: (value) => console.log(value),
 *   updateRecordingCustomText: (value) => console.log(value),
 *   updateRecordingCustomTextPosition: (value) => console.log(value),
 *   updateRecordingCustomTextColor: (value) => console.log(value),
 *   updateRecordingMediaOptions: (value) => console.log(value),
 *   updateRecordingAudioOptions: (value) => console.log(value),
 *   updateRecordingVideoOptions: (value) => console.log(value),
 *   updateRecordingAddHLS: (value) => console.log(value),
 * };
 * 
 * // Render the RecordingModal component
 * <RecordingModal
 *   isRecordingModalVisible={true}
 *   onClose={() => console.log("Modal closed")}
 *   backgroundColor="#83c0e9"
 *   position="bottomRight"
 *   confirmRecording={() => console.log("Recording confirmed")}
 *   startRecording={() => console.log("Recording started")}
 *   parameters={recordingParams}
 * />
 * ```
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
