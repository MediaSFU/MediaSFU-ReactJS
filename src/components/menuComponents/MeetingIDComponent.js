/**
 * React component representing the display of an Event ID with an input field.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.meetingID - The Event ID to be displayed in the input field.
 * @returns {React.ReactNode} - The rendered MeetingIdComponent.
 */
import React from 'react';

const MeetingIdComponent = ({ meetingID = "" }) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>Event ID:</label>
      <input
        style={styles.disabledInput}
        value={meetingID}
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

export default MeetingIdComponent;
