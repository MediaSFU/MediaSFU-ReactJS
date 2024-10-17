import React from "react";

// Define the prop type using an interface
export interface MeetingPasscodeComponentOptions {
  meetingPasscode?: string;
}

export type MeetingPasscodeComponentType = (
  options: MeetingPasscodeComponentOptions
) => JSX.Element;

/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component
 * @param {MeetingPasscodeComponentOptions} props - The properties object.
 * @param {string} [props.meetingPasscode=""] - The passcode for the meeting, defaulting to an empty string if not provided.
 * @returns {JSX.Element} A JSX element containing a labeled input field with the meeting passcode.
 */
const MeetingPasscodeComponent: React.FC<MeetingPasscodeComponentOptions> = ({ meetingPasscode = "" }) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>Event Passcode (Host):</label>
      <input
        style={styles.disabledInput}
        value={meetingPasscode}
        readOnly={true}
      />
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

export default MeetingPasscodeComponent;
