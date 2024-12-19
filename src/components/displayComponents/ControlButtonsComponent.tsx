import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ControlButtonsComponent.css"; // Import CSS file for additional styling
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface Button {
  name?: string;
  icon?: IconDefinition;
  alternateIcon?: IconDefinition;
  onPress?: () => void;
  backgroundColor?: {
    default?: string;
    pressed?: string;
  };
  active?: boolean;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  customComponent?: JSX.Element;
  color?: string;
  activeColor?: string;
  inActiveColor?: string;
  disabled?: boolean;
  show?: boolean;
}

export interface ControlButtonsComponentOptions {
  buttons: Button[];
  buttonColor?: string;
  buttonBackgroundColor?: {
    default?: string;
    pressed?: string;
  };
  alignment?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  vertical?: boolean;
  buttonsContainerStyle?: React.CSSProperties;
  alternateIconComponent?: JSX.Element;
}

export type ControlButtonsComponentType = (
  options: ControlButtonsComponentOptions
) => JSX.Element;

/**
 * ControlButtonsComponent is a React functional component that renders a set of customizable control buttons.
 *
 * This component organizes an array of buttons, each with options for icons, background color, and custom behavior. It supports horizontal or vertical layout and flexible alignment within the container.
 *
 * @component
 * @param {ControlButtonsComponentOptions} props - The properties object.
 * @param {Button[]} props.buttons - Array of button configurations for rendering.
 * @param {string} [props.buttonColor] - Default color for button icons.
 * @param {Object} [props.buttonBackgroundColor] - Background color options for the buttons.
 * @param {string} [props.buttonBackgroundColor.default] - Default background color for buttons.
 * @param {string} [props.buttonBackgroundColor.pressed] - Background color when the button is pressed.
 * @param {string} [props.alignment='flex-start'] - Horizontal alignment within the container ('flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly').
 * @param {boolean} [props.vertical=false] - If true, arranges buttons vertically; otherwise, horizontally.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional CSS styles for the button container.
 *
 * @returns {JSX.Element} The rendered control buttons component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsComponent } from 'mediasfu-reactjs';
 * import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
 *
 * function App() {
 *   const buttons = [
 *     {
 *       name: 'Play',
 *       icon: faPlay,
 *       onPress: () => console.log('Play button pressed'),
 *       backgroundColor: { default: 'green' },
 *       active: true,
 *     },
 *     {
 *       name: 'Pause',
 *       icon: faPause,
 *       onPress: () => console.log('Pause button pressed'),
 *       backgroundColor: { default: 'red' },
 *     },
 *     {
 *       name: 'Stop',
 *       icon: faStop,
 *       onPress: () => console.log('Stop button pressed'),
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       buttonBackgroundColor={{ default: 'transparent', pressed: 'gray' }}
 *       alignment="flex-start"
 *       vertical={false}
 *       buttonsContainerStyle={{ padding: 10 }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */


const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions> = ({
  buttons,
  buttonBackgroundColor,
  alignment = "flex-start", // Set default alignment to flex-start
  vertical = false, // Set default vertical to false
  buttonsContainerStyle,
}) => {
  /**
   * Get the alignment style for the button container.
   * @returns {React.CSSProperties} - The alignment style object.
   */
  const getAlignmentStyle = (): React.CSSProperties => {
    if (alignment === "center") {
      return { justifyContent: "center" };
    } else if (alignment === "flex-end") {
      return { justifyContent: "flex-end" };
    } else if (alignment === "space-between") {
      return { justifyContent: "space-between" };
    } else if (alignment === "space-around") {
      return { justifyContent: "space-around" };
    } else if (alignment === "space-evenly") {
      return { justifyContent: "space-evenly" };
    } else {
      return { justifyContent: "flex-start" }; // Default to flex-start
    }
  };

  return (
    <div
      className="mediasfu-container"
      style={{ ...getAlignmentStyle(), ...buttonsContainerStyle }}
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          className="buttonContainer"
          style={{
            backgroundColor: button.show
            ? buttonBackgroundColor?.default || "transparent" 
            : "transparent",
            ...(vertical && { flexDirection: "column" }), // Conditionally apply vertical style
            display: button.show ? "flex" : "none",
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
                  <FontAwesomeIcon
                    icon={button.alternateIcon!}
                    size="lg"
                    color={button.activeColor || "transparent"}
                  />
                )
              ) : button.iconComponent ? (
                button.iconComponent
              ) : (
                <FontAwesomeIcon
                  icon={button.icon}
                  size="lg"
                  color={button.inActiveColor || "#ffffff"}
                />
              )
            ) : (
              button.customComponent
            )}
            {button.name && (
              <span
                className="buttonText"
                style={{ color: button.color || "#ffffff" }}
              >
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
