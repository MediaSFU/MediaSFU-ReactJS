

/**
 * Custom component for rendering a set of control buttons with icons and text.
 * @param {Object} props - Component properties.
 * @param {Array} props.buttons - An array of button objects, each containing properties like name, icon, onPress, etc.
 * @param {string} [props.position='left'] - The horizontal alignment of the button container (left, right, middle).
 * @param {string} [props.location='top'] - The vertical alignment of the button container (top, bottom, center).
 * @param {string} [props.direction='horizontal'] - The direction in which buttons are arranged (horizontal, vertical).
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {boolean} [props.showAspect=false] - Whether to display the component or not.
 * @returns {JSX.Element} - The rendered component.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ControlButtonsComponentTouch = ({
  buttons,
  position = 'left',
  location = 'top',
  direction = 'horizontal',
  buttonsContainerStyle,
  showAspect = false,
}) => {
  const getAlignmentStyle = () => {
    let alignmentStyle = {};

    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent = position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    }

    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems = location === 'top' ? 'flex-start' : location === 'bottom' ? 'flex-end' : 'center';
    }

    if (direction === 'vertical') {
      alignmentStyle.flexDirection = 'column';
    } else {
      alignmentStyle.flexDirection = 'row';
    }

    return alignmentStyle;
  };

  return (
    <div style={{ ...styles.container, ...getAlignmentStyle(), ...buttonsContainerStyle, display: showAspect ? 'flex' : 'none' }}>
      {buttons.map((button, index) => (
        <button
          key={index}
          style={{
            ...styles.buttonContainer,
            backgroundColor: button.show ? button.backgroundColor?.default || 'rgba(255, 255, 255, 0.25)' : 'transparent',
            ...(direction === 'vertical' && styles.verticalButton),
            display: button.show ? 'flex' : button.inActiveColor == 'transparent' && button.activeColor == 'transparent' ? 'flex' : 'none',
            
          }}
          onClick={button.onPress}
        >
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
                <FontAwesomeIcon icon={button.icon} size="lg" color={button.inActiveColor || 'transparent'} />
              )
            )
          ) : (
            button.customComponent
          )}
          {button.name && (
            <span style={{ ...styles.buttonText, color: button.color || 'transparent' }}>{button.name}</span>
          )}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 5,
    marginBottom: 5,
    elevation: 9,
    zIndex: 9,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginTop: 5,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  },
};

export default ControlButtonsComponentTouch;




