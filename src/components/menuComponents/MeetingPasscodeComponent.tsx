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
 * @param {MeetingIdComponentOptions} props - The properties object.
 * @param {string} [props.meetingID=""] - The meeting ID to display.
 * @returns {JSX.Element} The rendered MeetingIdComponent component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { MeetingIdComponent } from 'mediasfu-reactjs';
 * 
 * const App = () => (
 *   <MeetingIdComponent meetingID="1234567890" />
 * );
 * 
 * export default App;
 * 
 * @example
 * import React from 'react';
 * import { MeetingIdComponent } from 'mediasfu-reactjs';
 * 
 * const App = () => (
 *   <MeetingIdComponent />
 * );
 * 
 * export default App;
 * ```
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
