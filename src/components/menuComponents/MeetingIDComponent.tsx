import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

// Define the prop type using an interface
export interface MeetingIdComponentOptions {
  meetingID?: string;
}

export type MeetingIdComponentType = (options: MeetingIdComponentOptions) => JSX.Element;

/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component MeetingIdComponent
 * @param {MeetingIdComponentOptions} props - The properties object.
 * @param {string} [props.meetingID=""] - The meeting ID to display.
 * @returns {JSX.Element} The rendered MeetingIdComponent component.
 * 
 * @example
 * ```tsx
 * <MeetingIdComponent meetingID="1234567890" />
 * 
 * @example
 * <MeetingIdComponent />
 * ```
 * 
 */
const MeetingIdComponent: React.FC<MeetingIdComponentOptions> = ({ meetingID = "" }) => {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy-to-clipboard functionality and triggers temporary color change.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingID);
      setIsCopied(true); // Set the copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Revert back after 2 seconds
    } catch {
      // do nothing
    }
  };

  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>Event ID:</label>
      <div style={styles.inputContainer}>
        <input
          style={styles.disabledInput}
          value={meetingID}
          readOnly={true}
          aria-label="Event ID"
        />
        <button
          onClick={handleCopy}
          style={styles.copyButton}
          aria-label="Copy Event ID"
        >
          <FontAwesomeIcon
            icon={faCopy}
            style={{
              ...styles.copyIcon,
              color: isCopied ? "#4CAF50" : "#0F0F10FF", // Change color on copy
            }}
          />
        </button>
      </div>
    </div>
  );
};

const styles = {
  formGroup: {
    marginTop: "10px",
    maxWidth: "300px",
    width: "100%",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#000000",
    marginBottom: "5px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  disabledInput: {
    flex: 1,
    border: "1px solid gray",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    color: "black",
    borderRadius: "5px",
    fontSize: "16px",
    marginRight: "5px",
  },
  copyButton: {
    padding: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  copyIcon: {
    fontSize: "20px",
    color: "#0F0F10FF", // Default blue color for the copy icon
  },
};

export default MeetingIdComponent;
