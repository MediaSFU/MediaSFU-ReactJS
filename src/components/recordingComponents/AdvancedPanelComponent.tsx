 
import React, { useEffect, useState } from "react";
import { EventType } from "../../@types/types";

export type AdvancedOptionItem = { value: string; label: string; tooltip?: string };

export const recordingVideoTypeItems: AdvancedOptionItem[] = [
  { value: "fullDisplay", label: "Full Display (no background)", tooltip: "Use the full incoming display" },
  { value: "bestDisplay", label: "Full Video", tooltip: "Optimized full video feed" },
  { value: "all", label: "All", tooltip: "Mix all displays" },
];

export const recordingDisplayTypeItems: AdvancedOptionItem[] = [
  { value: "video", label: "Only Video Participants", tooltip: "Include participants with video" },
  { value: "media", label: "Participants with media", tooltip: "Include participants with media" },
  { value: "all", label: "All Participants", tooltip: "Include everyone" },
];

export const recordingTextPositionItems: AdvancedOptionItem[] = [
  { value: "top", label: "Top", tooltip: "Place custom text at the top" },
  { value: "middle", label: "Middle", tooltip: "Place custom text in the middle" },
  { value: "bottom", label: "Bottom", tooltip: "Place custom text at the bottom" },
];

export const recordingNameTagToggleItems: AdvancedOptionItem[] = [
  { value: "true", label: "Show", tooltip: "Display name tags" },
  { value: "false", label: "Hide", tooltip: "Hide name tags" },
];

export const recordingOrientationItems: AdvancedOptionItem[] = [
  { value: "landscape", label: "Landscape", tooltip: "Horizontal orientation" },
  { value: "portrait", label: "Portrait", tooltip: "Vertical orientation" },
  { value: "all", label: "All", tooltip: "Choose orientation automatically" },
];

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

export type AdvancedPanelType = (options: AdvancedPanelOptions) => React.JSX.Element;

/**
 * AdvancedPanelComponent is a React component for configuring advanced recording options.
 * 
 * @component
 * @param {AdvancedPanelOptions} parameters - Parameters for advanced recording configuration.
 * @param {string} parameters.recordingVideoType - The type of video recording (e.g., "fullDisplay").
 * @param {string} parameters.recordingDisplayType - Display type for recording (e.g., "video").
 * @param {string} parameters.recordingBackgroundColor - Background color for recording.
 * @param {string} parameters.recordingNameTagsColor - Color for name tags in recording.
 * @param {string} parameters.recordingOrientationVideo - Orientation of video recording (e.g., "landscape").
 * @param {boolean} parameters.recordingNameTags - Flag to include name tags in the recording.
 * @param {boolean} parameters.recordingAddText - Flag to add custom text to recording.
 * @param {string} parameters.recordingCustomText - Custom text to include in the recording.
 * @param {string} parameters.recordingCustomTextPosition - Position of custom text in recording (e.g., "top").
 * @param {string} parameters.recordingCustomTextColor - Color of custom text in recording.
 * @param {Function} parameters.updateRecordingVideoType - Updates the recording video type.
 * @param {Function} parameters.updateRecordingDisplayType - Updates the recording display type.
 * @param {Function} parameters.updateRecordingBackgroundColor - Updates recording background color.
 * @param {Function} parameters.updateRecordingNameTagsColor - Updates recording name tags color.
 * @param {Function} parameters.updateRecordingOrientationVideo - Updates recording orientation.
 * @param {Function} parameters.updateRecordingNameTags - Updates name tags inclusion status.
 * @param {Function} parameters.updateRecordingAddText - Updates custom text inclusion status.
 * @param {Function} parameters.updateRecordingCustomText - Updates custom text.
 * @param {Function} parameters.updateRecordingCustomTextPosition - Updates custom text position.
 * @param {Function} parameters.updateRecordingCustomTextColor - Updates custom text color.
 * @param {EventType} parameters.eventType - Event type associated with the recording.
 * 
 * @returns {React.JSX.Element} Rendered component for configuring advanced recording options.
 * 
 * @example
 * ```tsx
 * import { AdvancedPanelComponent } from 'mediasfu-reactjs';
 * 
 * // Define the recording parameters for the advanced panel
 * const parameters = {
 *   recordingVideoType: 'fullDisplay',
 *   recordingDisplayType: 'video',
 *   recordingBackgroundColor: '#000000',
 *   recordingNameTagsColor: '#FFFFFF',
 *   recordingOrientationVideo: 'landscape',
 *   recordingNameTags: true,
 *   recordingAddText: true,
 *   recordingCustomText: 'Custom Text',
 *   recordingCustomTextPosition: 'top',
 *   recordingCustomTextColor: '#FFFFFF',
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
 *   eventType: 'webinar',
 * };
 * 
 * // Render the AdvancedPanelComponent
 * <AdvancedPanelComponent parameters={parameters} />
 * ```
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

  const renderOption = (item: AdvancedOptionItem) => (
    <option key={item.value} value={item.value} title={item.tooltip || item.label}>
      {item.label}
    </option>
  );

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
          {recordingVideoTypeItems.map(renderOption)}
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
              const value = e.target.value as "video" | "media" | "all";
              updateRecordingDisplayType(value);
              setSelectedRecordingDisplayType(value);
            }}
          >
            {recordingDisplayTypeItems.map(renderOption)}
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
            {recordingTextPositionItems.map(renderOption)}
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
          {recordingNameTagToggleItems.map(renderOption)}
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
          {recordingOrientationItems.map(renderOption)}
        </select>
      </div>
      <hr />
    </div>
  );
};

export default AdvancedPanelComponent;
