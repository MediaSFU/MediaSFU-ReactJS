import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  modifyDisplaySettings,
  ModifyDisplaySettingsOptions,
  ModifyDisplaySettingsParameters,
} from "../../methods/displaySettingsMethods/modifyDisplaySettings";

export interface DisplaySettingsModalParameters
  extends ModifyDisplaySettingsParameters {
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  meetingVideoOptimized: boolean;
}

export interface DisplaySettingsModalOptions {
  isDisplaySettingsModalVisible: boolean;
  onDisplaySettingsClose: () => void;
  onModifyDisplaySettings?: (
    options: ModifyDisplaySettingsOptions
  ) => Promise<void>;
  parameters: DisplaySettingsModalParameters;
  position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
  backgroundColor?: string;
}

export type DisplaySettingsModalType = (
  options: DisplaySettingsModalOptions
) => JSX.Element;

/**
 * DisplaySettingsModal component provides a modal interface for managing display settings with options for display types, audiograph, and video controls.
 * 
 * @component
 * @param {DisplaySettingsModalOptions} props - The properties for DisplaySettingsModal.
 * @param {boolean} props.isDisplaySettingsModalVisible - Controls the modal's visibility.
 * @param {() => void} props.onDisplaySettingsClose - Function to close the modal.
 * @param {Function} [props.onModifyDisplaySettings=modifyDisplaySettings] - Callback for modifying settings.
 * @param {DisplaySettingsModalParameters} props.parameters - Display settings and related options.
 * @param {string} [props.position='topRight'] - Modal positioning on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Modal background color.
 * 
 * @returns {JSX.Element} The rendered modal component.
 * 
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 * 
 * const App = () => {
 *   const [modalVisible, setModalVisible] = useState(true);
 *   const handleModalClose = () => setModalVisible(false);
 *   
 *   const parameters = {
 *     meetingDisplayType: "video",
 *     autoWave: true,
 *     forceFullDisplay: false,
 *     meetingVideoOptimized: true,
 *   };
 * 
 *   return (
 *     <DisplaySettingsModal
 *       isDisplaySettingsModalVisible={modalVisible}
 *       onDisplaySettingsClose={handleModalClose}
 *       parameters={parameters}
 *       position="topRight"
 *       backgroundColor="#83c0e9"
 *     />
 *   );
 * }
 * 
 * export default App;
 * ```
 */


const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions> = ({
  isDisplaySettingsModalVisible,
  onDisplaySettingsClose,
  onModifyDisplaySettings = modifyDisplaySettings,
  parameters,
  position = "topRight",
  backgroundColor = "#83c0e9",
}) => {
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
    display: isDisplaySettingsModalVisible ? "block" : "none",
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

  const {
    meetingDisplayType,
    autoWave,
    forceFullDisplay,
    meetingVideoOptimized,
  } = parameters;

  const [meetingDisplayTypeState, setMeetingDisplayTypeState] =
    useState<string>(meetingDisplayType);
  const [autoWaveState, setAutoWaveState] = useState<boolean>(autoWave);
  const [forceFullDisplayState, setForceFullDisplayState] =
    useState<boolean>(forceFullDisplay);
  const [meetingVideoOptimizedState, setMeetingVideoOptimizedState] =
    useState<boolean>(meetingVideoOptimized);

  const handleSaveSettings = async () => {
    await onModifyDisplaySettings({
      parameters: {
        ...parameters,
        meetingDisplayType: meetingDisplayTypeState,
        autoWave: autoWaveState,
        forceFullDisplay: forceFullDisplayState,
        meetingVideoOptimized: meetingVideoOptimizedState,
      },
    });
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            Display Settings
          </h2>
          <div
            className="btn-close-media-settings"
            onClick={onDisplaySettingsClose}
          >
            <FontAwesomeIcon icon={faTimes} className="icon" size="xl" />
          </div>
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
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                fontSize: "medium",
                color: "black",
                marginBottom: 5,
                fontWeight: "bold",
              }}
            >
              Display Option:
            </label>
            <select
              style={{
                fontSize: "medium",
                padding: "12px 10px",
                border: "1px solid gray",
                borderRadius: 4,
                color: "black",
                paddingRight: 30,
                backgroundColor: "white",
              }}
              value={meetingDisplayTypeState}
              onChange={(e) => setMeetingDisplayTypeState(e.target.value)}
            >
              <option value="video">Video Participants Only</option>
              <option value="media">Media Participants Only</option>
              <option value="all">Show All Participants</option>
            </select>
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#ffffff",
              marginTop: 2,
              marginBottom: 2,
            }}
          />
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label
                style={{
                  fontSize: "medium",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Display Audiographs
              </label>
              <button onClick={() => setAutoWaveState(!autoWaveState)}>
                <span
                  style={{
                    fontSize: "large",
                    color: autoWaveState ? "green" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  &#10003;
                </span>
              </button>
            </div>
            <div
              style={{
                height: 1,
                backgroundColor: "#ffffff",
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label
                style={{
                  fontSize: "medium",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Force Full Display
              </label>
              <button
                onClick={() => setForceFullDisplayState(!forceFullDisplayState)}
              >
                <span
                  style={{
                    fontSize: "large",
                    color: forceFullDisplayState ? "green" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  &#10003;
                </span>
              </button>
            </div>
            <div
              style={{
                height: 1,
                backgroundColor: "#ffffff",
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label
                style={{
                  fontSize: "medium",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Force Video Participants
              </label>
              <button
                onClick={() =>
                  setMeetingVideoOptimizedState(!meetingVideoOptimizedState)
                }
              >
                <span
                  style={{
                    fontSize: "large",
                    color: meetingVideoOptimizedState ? "green" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  &#10003;
                </span>
              </button>
            </div>
            <div
              style={{
                height: 1,
                backgroundColor: "#ffffff",
                marginTop: 2,
                marginBottom: 2,
              }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
            onClick={handleSaveSettings}
          >
            <span style={{ color: "white", fontSize: "medium" }}>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettingsModal;
