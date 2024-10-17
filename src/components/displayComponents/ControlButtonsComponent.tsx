
/**
 * Custom component for rendering a set of control buttons with icons and text.
 * @param {Object} props - Component properties.
 * @param {Array} props.buttons - An array of button objects, each containing properties like name, icon, onPress, etc.
 * @param {string} [props.buttonColor] - The color for button icons and text.
 * @param {Object} [props.buttonBackgroundColor] - The background color for buttons in default and pressed states.
 * @param {string} [props.alignment='flex-start'] - The alignment of the button container (flex-start, center, flex-end).
 * @param {boolean} [props.vertical=false] - If true, buttons will be arranged vertically.
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {JSX.Element} [props.alternateIconComponent] - An alternate icon component to render when a button is active.
 * @param {JSX.Element} [props.iconComponent] - An icon component to render when a button is not active.
 * @returns {JSX.Element} - The rendered component.
 */

import React from 'react';
import { useState } from 'react'; // Import useState
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './ControlButtonsComponent.css'; // Import CSS file for additional styling

const ControlButtonsComponent = ({
  buttons,
  buttonColor,
  buttonBackgroundColor,
  alignment = 'flex-start', // Set default alignment to flex-start
  vertical = false, // Set default vertical to false
  buttonsContainerStyle,
  alternateIconComponent,
}) => {
  /**
   * Get the alignment style for the button container.
   * @returns {Object} - The alignment style object.
   */
  const getAlignmentStyle = () => {
    if (alignment === 'center') {
      return { justifyContent: 'center' };
    } else if (alignment === 'flex-end') {
      return { justifyContent: 'flex-end' };
    } else if (alignment === 'space-between') {
      return { justifyContent: 'space-between' };
    } else if (alignment === 'space-around') {
      return { justifyContent: 'space-around' };
    } else if (alignment === 'space-evenly') {
      return { justifyContent: 'space-evenly' };
    } else {
      return { justifyContent: 'flex-start' }; // Default to flex-start
    }
  };

  return (
    <div className="container" style={{ ...getAlignmentStyle(), ...buttonsContainerStyle }}>
      {buttons.map((button, index) => (
        <button
          key={index}
          className="buttonContainer"
          style={{
            backgroundColor: buttonBackgroundColor?.default || 'transparent',
            ...vertical && { flexDirection: 'column' }, // Conditionally apply vertical style
          }}
          disabled={button.disabled}
          onClick={button.onPress}
        >
          <>
            {button.icon ? (
              button.active ? (
                button.alternateIconComponent ? (
                  button.alternateIconComponent
                ) : (
                  <FontAwesomeIcon icon={button.alternateIcon} size="lg" color={button.activeColor || 'transparent'} />
                )
              ) : (
                button.iconComponent ? (
                  button.iconComponent
                ) : (
                  <FontAwesomeIcon icon={button.icon} size="lg" color={button.inActiveColor || '#ffffff'} />
                )
              )
            ) : (
              button.customComponent
            )}
            {button.name && (
              <span className="buttonText" style={{ color: button.color || '#ffffff' }}>
                {button.name}
              </span>
            )}
          </>
        </button>
      ))}
    </div>
  );
};

export default ControlButtonsComponent;

