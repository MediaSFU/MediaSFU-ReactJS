import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Example icon import
import './CustomButtons.css'; // Import CSS file for styling
 


const CustomButtons = ({ buttons }) => {
  return (
    <div className="customButtonsContainer">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => {
            button.action();
          }}
          className="customButton"
          style={{
            backgroundColor: button.show ? button.backgroundColor : 'transparent',
            display: button.show ? 'flex' : 'none',
          }}
          disabled={button.disabled}
        >
          <div className="buttonContent">
            {button.icon ? (
              <>
                <FontAwesomeIcon icon={button.icon} style={{ ...styles.customButtonIcon, ...button.iconStyle }} />
                {button.text && <span className="customButtonText" style={button.textStyle}>{button.text}</span>}
              </>
            ) : button.customComponent ? (
              button.customComponent
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin /> // Example placeholder for loading icon
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

const styles = {
  customButtonIcon: {
    fontSize: 20,
    marginRight: 5,
  },
};

export default CustomButtons;
