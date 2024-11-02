import React from "react";

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
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>Event ID:</label>
      <input style={styles.disabledInput} value={meetingID} readOnly={true} />
    </div>
  );
};

const styles = {
  formGroup: {
    marginTop: "10px",
    maxWidth: "300px",
  },
  label: {
    fontWeight: "bold",
  },
  disabledInput: {
    borderWidth: "1px",
    borderColor: "gray",
    padding: "10px",
    marginTop: "5px",
    backgroundColor: "#f0f0f0",
    color: "black",
    width: "100%",
    borderRadius: "5px",
  },
};

export default MeetingIdComponent;
