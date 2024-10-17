
import React, { useEffect, useState } from 'react';

export interface AlertComponentOptions {
  visible: boolean;
  message: string;
  type: 'success' | 'danger'; // Optional prop with 'success' or 'danger' as default values
  duration?: number; // Optional with default value
  onHide?: () => void; // Optional callback function
  textColor?: string; // Optional text color
}

export type AlertComponentType = (options: AlertComponentOptions) => JSX.Element;

/**
 * AlertComponent is a React functional component that displays an alert message.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.visible - Determines if the alert is visible.
 * @param {string} props.message - The message to display in the alert.
 * @param {'success' | 'danger'} [props.type='success'] - The type of alert, which determines the background color.
 * @param {number} [props.duration=4000] - The duration in milliseconds for which the alert is visible.
 * @param {function} [props.onHide] - Callback function to be called when the alert is hidden.
 * @param {string} [props.textColor='black'] - The color of the alert text.
 * 
 * @example
 * <AlertComponent
 *   visible={true}
 *   message="This is a success alert!"
 *   type="success"
 *   duration={3000}
 *   onHide={() => console.log('Alert hidden')}
 *   textColor="white"
 * />
 */
const AlertComponent: React.FC<AlertComponentOptions> = ({
  visible,
  message,
  type = 'success',
  duration = 4000,
  onHide,
  textColor = 'black',
}) => {
  const [alertType, setAlertType] = useState<'success' | 'danger'>(type);

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        onHide!();
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [visible, duration, onHide]);

  const handlePress = () => {
    onHide!();
  };

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <div className="centeredView" onClick={handlePress} style={styles.centeredView}>
        <div
          className="modalView"
          style={{
            ...styles.modalView,
            backgroundColor: alertType === 'success' ? 'green' : 'red',
          }}
        >
          <p className="modalText" style={{ ...styles.modalText, color: textColor }}>{message}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  centeredView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed' as const, // TypeScript requires explicit typing for CSS position
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    color: 'black',
    fontSize: '16px',
  },
};

export default AlertComponent;
