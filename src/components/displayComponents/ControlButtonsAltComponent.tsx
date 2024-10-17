
/**
 * Custom component for rendering a set of control buttons with icons and text.
 * @param {Object} props - Component properties.
 * @param {Array} props.buttons - An array of button objects, each containing properties like name, icon, onPress, etc.
 * @param {string} [props.position='left'] - The horizontal alignment of the button container (left, right, middle).
 * @param {string} [props.location='top'] - The vertical alignment of the button container (top, bottom, center).
 * @param {string} [props.direction='horizontal'] - The direction in which buttons are arranged (horizontal, vertical).
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {JSX.Element} [props.alternateIconComponent] - An alternate icon component to render when a button is active.
 * @param {JSX.Element} [props.iconComponent] - An icon component to render when a button is not active.
 * @param {boolean} [props.showAspect=false] - Whether to show the component or not.
 * @returns {JSX.Element} - The rendered component.
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ControlButtonsAltComponent = ({
  buttons,
  position = 'left',
  location = 'top',
  direction = 'horizontal',
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
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
        <div
          key={index}
          style={{
            ...styles.buttonContainer,
            backgroundColor: button.backgroundColor?.default || 'transparent',
            ...(direction === 'vertical' && styles.verticalButton),
          }}
          onClick={button.onPress}
        >
          {button.icon ? (
            button.active ? (
              button.alternateIconComponent ? (
                button.alternateIconComponent
              ) : (
                <FontAwesomeIcon icon={button.alternateIcon} size="lg" color={button.inActiveColor || 'transparent'} />
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
            <span style={{ ...styles.buttonText, color: button.color || '#ffffff' }}>{button.name}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    marginTop: 5,
    marginBottom: 5,
    elevation: 9,
    zIndex: 9,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    cursor: 'pointer',
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  },
};

export default ControlButtonsAltComponent;

