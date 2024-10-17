import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface AltButton {
  name?: string;
  icon?: IconDefinition;
  alternateIcon?: IconDefinition;
  onPress?: () => void;
  backgroundColor?: {
    default?: string;
  };
  active?: boolean;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  customComponent?: JSX.Element;
  color?: string;
  inActiveColor?: string;
  show?: boolean;
}

export interface ControlButtonsAltComponentOptions {
  buttons: AltButton[];
  position?: 'left' | 'right' | 'middle';
  location?: 'top' | 'bottom' | 'center';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: React.CSSProperties;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;
}

export type ControlButtonsAltComponentType = (options: ControlButtonsAltComponentOptions) => React.ReactNode;

/**
 * ControlButtonsAltComponent is a React functional component that renders a set of control buttons
 * with customizable alignment, direction, and styles.
 *
 * @param {ControlButtonsAltComponentOptions} props - The properties object.
 * @param {Array<ButtonOptions>} props.buttons - An array of button options to be rendered.
 * @param {string} [props.position='left'] - The horizontal alignment of the buttons ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - The vertical alignment of the buttons ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - The direction of the button layout ('horizontal', 'vertical').
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - Whether to display the buttons container.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions> = ({
  buttons,
  position = 'left',
  location = 'top',
  direction = 'horizontal',
  buttonsContainerStyle,
  showAspect = false,
}) => {
  const getAlignmentStyle = (): React.CSSProperties => {
    let alignmentStyle: React.CSSProperties = {};

    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent =
        position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    }

    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems =
        location === 'top' ? 'flex-start' : location === 'bottom' ? 'flex-end' : 'center';
    }

    if (direction === 'vertical') {
      alignmentStyle.flexDirection = 'column';
    } else {
      alignmentStyle.flexDirection = 'row';
    }

    return alignmentStyle;
  };

  return (
    <div
      style={{
        ...styles.container,
        ...getAlignmentStyle(),
        ...buttonsContainerStyle,
        display: showAspect ? 'flex' : 'none',
      }}
    >
      {buttons.map((button, index) => (
        <div
          key={index}
          style={{
            ...styles.buttonContainer,
            backgroundColor: button.backgroundColor?.default || 'transparent',
            ...(direction === 'vertical' && styles.verticalButton),
            display: button.show === false ? 'none' : 'flex',
          }}
          onClick={button.onPress}
        >
          {button.icon ? (
            button.active ? (
              button.alternateIconComponent ? (
                button.alternateIconComponent
              ) : (
                <FontAwesomeIcon icon={button.alternateIcon!} size="lg" color={button.inActiveColor || 'transparent'} />
              )
            ) : button.iconComponent ? (
              button.iconComponent
            ) : (
              <FontAwesomeIcon icon={button.icon} size="lg" color={button.inActiveColor || 'transparent'} />
            )
          ) : (
            button.customComponent
          )}
          {button.name && <span style={{ ...styles.buttonText, color: button.color || '#ffffff' }}>{button.name}</span>}
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
  } as React.CSSProperties,
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    cursor: 'pointer',
  } as React.CSSProperties,
  verticalButton: {
    flexDirection: 'column',
  } as React.CSSProperties,
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  } as React.CSSProperties,
};

export default ControlButtonsAltComponent;
