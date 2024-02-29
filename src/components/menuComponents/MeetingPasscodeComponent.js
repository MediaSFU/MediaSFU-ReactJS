/**
 * React component representing the display of an Event Passcode with an input field.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.meetingPasscode - The Event Passcode to be displayed in the input field.
 * @returns {React.ReactNode} - The rendered MeetingPasscodeComponent.
 */
import React from 'react';

const MeetingPasscodeComponent = ({ meetingPasscode = "" }) => {
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
    marginTop: '10px',
    maxWidth: '300px',
  },
  label: {
    fontWeight: 'bold',
  },
  disabledInput: {
    borderWidth: '1px',
    borderColor: 'gray',
    padding: '10px',
    marginTop: '5px',
    backgroundColor: '#f0f0f0',
    color: 'black',
    width: '100%',
    borderRadius: '5px',
  },
};

export default MeetingPasscodeComponent;

