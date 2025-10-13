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
) => React.JSX.Element;

/**
 * DisplaySettingsModal - Comprehensive layout and visual configuration interface
 * 
 * A powerful modal for managing meeting display modes, video optimization, participant visibility,
 * and audio visualization settings. Provides granular control over grid layouts, screen sharing displays,
 * and participant rendering. Perfect for adapting the UI to different meeting types and user preferences.
 * 
 * Features:
 * - Display type selection (video, media, all participants)
 * - Video optimization toggle (bandwidth/quality management)
 * - Force full display mode (maximize participant grid)
 * - Auto-wave visualization (audio level indicators)
 * - Meeting display type configuration
 * - Real-time layout updates
 * - Responsive positioning
 * - Custom styling support
 * - Settings persistence
 * 
 * @component
 * @param {DisplaySettingsModalOptions} options - Configuration options
 * @param {boolean} options.isDisplaySettingsModalVisible - Modal visibility state
 * @param {Function} options.onDisplaySettingsClose - Callback when modal is closed
 * @param {Function} [options.onModifyDisplaySettings=modifyDisplaySettings] - Settings modification handler
 * @param {DisplaySettingsModalParameters} options.parameters - Display configuration parameters
 * @param {string} options.parameters.meetingDisplayType - Current display mode ('video', 'media', 'all')
 * @param {boolean} options.parameters.autoWave - Audio visualization enabled state
 * @param {boolean} options.parameters.forceFullDisplay - Full display mode state
 * @param {boolean} options.parameters.meetingVideoOptimized - Video optimization state
 * @param {string} [options.position='topRight'] - Modal screen position
 * @param {string} [options.backgroundColor='#83c0e9'] - Modal background color
 * 
 * @returns {React.JSX.Element} Rendered display settings modal
 * 
 * @example
 * // Basic display settings modal
 * ```tsx
 * import React, { useState } from 'react';
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 * 
 * function DisplayControls({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Display Settings ({parameters.meetingDisplayType})
 *       </button>
 *       <DisplaySettingsModal
 *         isDisplaySettingsModalVisible={isVisible}
 *         onDisplaySettingsClose={() => setIsVisible(false)}
 *         parameters={parameters}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom display settings with analytics
 * ```tsx
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 * 
 * function AnalyticsDisplay({ isVisible, onClose, parameters }) {
 *   const handleModifySettings = async (options) => {
 *     analytics.track('display_settings_changed', {
 *       displayType: options.displayType,
 *       autoWave: options.autoWave,
 *       forceFullDisplay: options.forceFullDisplay,
 *       videoOptimized: options.meetingVideoOptimized,
 *     });
 *     return parameters.modifyDisplaySettings(options);
 *   };
 * 
 *   return (
 *     <DisplaySettingsModal
 *       isDisplaySettingsModalVisible={isVisible}
 *       onDisplaySettingsClose={onClose}
 *       onModifyDisplaySettings={handleModifySettings}
 *       parameters={parameters}
 *       position="bottomLeft"
 *       backgroundColor="#1e3a8a"
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Branded settings with current state display
 * ```tsx
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 * 
 * function BrandedDisplaySettings({ isVisible, onClose, parameters }) {
 *   const displayModes = {
 *     video: 'Video Focus',
 *     media: 'Screen Share',
 *     all: 'All Participants',
 *   };
 * 
 *   return (
 *     <div>
 *       <div style={{
 *         padding: 12,
 *         background: '#f8fafc',
 *         borderRadius: 8,
 *         marginBottom: 16,
 *       }}>
 *         <div style={{ fontWeight: 600, marginBottom: 8 }}>
 *           Current: {displayModes[parameters.meetingDisplayType]}
 *         </div>
 *         <div style={{ fontSize: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 *           <span>Audio Viz: {parameters.autoWave ? '✓' : '✗'}</span>
 *           <span>Full Display: {parameters.forceFullDisplay ? '✓' : '✗'}</span>
 *           <span>Optimized: {parameters.meetingVideoOptimized ? '✓' : '✗'}</span>
 *         </div>
 *       </div>
 *       <DisplaySettingsModal
 *         isDisplaySettingsModalVisible={isVisible}
 *         onDisplaySettingsClose={onClose}
 *         parameters={parameters}
 *         position="topLeft"
 *         backgroundColor="#7c3aed"
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, DisplaySettingsModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   displaySettingsModal: {
 *     component: (props) => (
 *       <DisplaySettingsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         onModifyDisplaySettings={async (options) => {
 *           console.log('Display settings updated:', {
 *             type: options.displayType,
 *             optimized: options.meetingVideoOptimized,
 *           });
 *           return props.onModifyDisplaySettings?.(options);
 *         }}
 *       />
 *     ),
 *   },
 * };
 * 
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
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
