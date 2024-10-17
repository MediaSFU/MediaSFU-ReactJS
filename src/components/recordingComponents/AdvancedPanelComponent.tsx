 
import React, { useEffect, useState } from "react";
import { EventType } from "../../@types/types";

export interface AdvancedPanelParameters {
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
  eventType: EventType;
  // [key: string]: any; // For additional properties
}

export interface AdvancedPanelOptions {
  parameters: AdvancedPanelParameters;
}

export type AdvancedPanelType = (options: AdvancedPanelOptions) => JSX.Element;

/**
 * AdvancedPanelComponent is a React functional component that provides a user interface
 * for configuring advanced recording options. It allows users to select and update various
 * recording parameters such as video type, display type, background color, custom text, 
 * name tags, and video orientation.
 *
 * @component
 * @param {AdvancedPanelOptions} parameters - The parameters for configuring the advanced recording options.
 * @param {string} parameters.recordingVideoType - The type of video recording.
 * @param {string} parameters.recordingDisplayType - The type of display for the recording.
 * @param {string} parameters.recordingBackgroundColor - The background color for the recording.
 * @param {string} parameters.recordingNameTagsColor - The color of the name tags in the recording.
 * @param {string} parameters.recordingOrientationVideo - The orientation of the video recording.
 * @param {boolean} parameters.recordingNameTags - Whether to include name tags in the recording.
 * @param {boolean} parameters.recordingAddText - Whether to add custom text to the recording.
 * @param {string} parameters.recordingCustomText - The custom text to add to the recording.
 * @param {string} parameters.recordingCustomTextPosition - The position of the custom text in the recording.
 * @param {string} parameters.recordingCustomTextColor - The color of the custom text in the recording.
 * @param {Function} parameters.updateRecordingVideoType - Function to update the recording video type.
 * @param {Function} parameters.updateRecordingDisplayType - Function to update the recording display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Function to update the recording background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Function to update the recording name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Function to update the recording orientation video.
 * @param {Function} parameters.updateRecordingNameTags - Function to update whether to include name tags in the recording.
 * @param {Function} parameters.updateRecordingAddText - Function to update whether to add custom text to the recording.
 * @param {Function} parameters.updateRecordingCustomText - Function to update the custom text in the recording.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Function to update the position of the custom text in the recording.
 * @param {Function} parameters.updateRecordingCustomTextColor - Function to update the color of the custom text in the recording.
 * @param {string} parameters.eventType - The type of event for which the recording is being configured.
 *
 * @returns {JSX.Element} The rendered component for configuring advanced recording options.
 */
const AdvancedPanelComponent: React.FC<AdvancedPanelOptions> = ({
  parameters,
}) => {
  const {
    recordingVideoType,
    recordingDisplayType,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingNameTags,
    recordingAddText,
    recordingCustomText,
    recordingCustomTextPosition,
    recordingCustomTextColor,
    updateRecordingVideoType,
    updateRecordingDisplayType,
    updateRecordingBackgroundColor,
    updateRecordingNameTagsColor,
    updateRecordingOrientationVideo,
    updateRecordingNameTags,
    updateRecordingAddText,
    updateRecordingCustomText,
    updateRecordingCustomTextPosition,
    updateRecordingCustomTextColor,
    eventType,
  } = parameters;

  const [selectedOrientationVideo, setSelectedOrientationVideo] = useState(
    recordingOrientationVideo
  );
  const [selectedRecordingNameTags, setSelectedRecordingNameTags] =
    useState(recordingNameTags);
  const [selectedRecordingVideoType, setSelectedRecordingVideoType] =
    useState(recordingVideoType);
  const [selectedRecordingDisplayType, setSelectedRecordingDisplayType] =
    useState(recordingDisplayType);

  const [recordingText, setRecordingText] = useState(recordingAddText);
  const [customText, setCustomText] = useState(recordingCustomText);
  const [recordingPosition, setRecordingPosition] = useState(
    recordingCustomTextPosition
  );

  const validateTextInput = (input: string) => {
    const regex = /^[a-zA-Z0-9\s]{1,40}$/;
    return regex.test(input);
  };

  const handleTextChange = (value: string | boolean) => {
    const isTrue = value === "true" || value === true;
    setRecordingText(isTrue);
    updateRecordingAddText(isTrue);
  };

  const onChangeTextHandler = (text: string) => {
    if (text.length === 0 || validateTextInput(text)) {
      updateRecordingCustomText(text);
      setCustomText(text);
    }
  };

  useEffect(() => {
    setSelectedOrientationVideo(recordingOrientationVideo);
  }, [recordingOrientationVideo]);

  const handleColorChange = (selectedColor: string, color: string) => {
    switch (selectedColor) {
      case "backgroundColor":
        updateRecordingBackgroundColor(color);
        break;
      case "customTextColor":
        updateRecordingCustomTextColor(color);
        break;
      case "nameTagsColor":
        updateRecordingNameTagsColor(color);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Video Type */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Video Type:
        </label>
        <select
          value={selectedRecordingVideoType}
          onChange={(e) => {
            updateRecordingVideoType(e.target.value);
            setSelectedRecordingVideoType(e.target.value);
          }}
        >
          <option value="fullDisplay">Full Display (no background)</option>
          <option value="bestDisplay">Full Video</option>
          <option value="all">All</option>
        </select>
      </div>
      <hr />

      {/* Display Type */}
      {eventType !== "broadcast" && (
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Display Type:
          </label>
          <select
            value={selectedRecordingDisplayType}
            onChange={(e) => {
              updateRecordingDisplayType(e.target.value as "video" | "media" | "all");
              setSelectedRecordingDisplayType(e.target.value as "video" | "media" | "all");
            }}
          >
            <option value="video">Only Video Participants</option>
            <option value="videoOpt">
              Only Video Participants (optimized)
            </option>
            <option value="media">Participants with media</option>
            <option value="all">All Participants</option>
          </select>
        </div>
      )}
      <hr />

      {/* Background Color */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Background Color:
        </label>
        <div
          style={{
            backgroundColor: recordingBackgroundColor,
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          {recordingBackgroundColor}
        </div>
        <input
          type="color"
          value={recordingBackgroundColor}
          onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
        />{" "}
        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          Click to select color
        </span>
      </div>
      <hr />

      {/* Add Text */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Add Text:
        </label>
        <select
          value={recordingText.toString()}
          onChange={(e) => handleTextChange(e.target.value)}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <hr />

      {/* Custom Text */}
      {recordingText && (
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Custom Text:
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => onChangeTextHandler(e.target.value)}
          />
          <hr />
        </div>
      )}

      {/* Custom Text Position */}
      {recordingText && (
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Custom Text Position:
          </label>
          <select
            value={recordingPosition}
            onChange={(e) => {
              updateRecordingCustomTextPosition(e.target.value);
              setRecordingPosition(e.target.value);
            }}
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
          <hr />
        </div>
      )}

      {/* Custom Text Color */}
      {recordingText && (
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Custom Text Color:
          </label>
          <div
            style={{
              backgroundColor: recordingCustomTextColor,
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            {recordingCustomTextColor}
          </div>
          <input
            type="color"
            value={recordingCustomTextColor}
            onChange={(e) =>
              handleColorChange("customTextColor", e.target.value)
            }
          />{" "}
          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
            Click to select color
          </span>
          <hr />
        </div>
      )}

      {/* Add name tags or not */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Add Name Tags:
        </label>
        <select
          value={selectedRecordingNameTags.toString()}
          onChange={(e) => {
            updateRecordingNameTags(e.target.value === "true");
            setSelectedRecordingNameTags(e.target.value === "true");
          }}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <hr />

      {/* Name Tags Color */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Name Tags Color:
        </label>
        <div
          style={{
            backgroundColor: recordingNameTagsColor,
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          {recordingNameTagsColor}
        </div>
        <input
          type="color"
          value={recordingNameTagsColor}
          onChange={(e) => handleColorChange("nameTagsColor", e.target.value)}
        />{" "}
        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          Click to select color
        </span>
      </div>
      <hr />

      {/* Orientation (Video) */}
      <div>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Orientation (Video):
        </label>
        <select
          value={selectedOrientationVideo}
          onChange={(e) => {
            updateRecordingOrientationVideo(e.target.value);
            setSelectedOrientationVideo(e.target.value);
          }}
        >
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="all">All</option>
        </select>
      </div>
      <hr />
    </div>
  );
};

export default AdvancedPanelComponent;
