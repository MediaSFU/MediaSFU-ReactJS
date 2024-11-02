import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  position?: "left" | "right" | "middle";
  location?: "top" | "bottom" | "center";
  direction?: "horizontal" | "vertical";
  buttonsContainerStyle?: React.CSSProperties;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;
}

export type ControlButtonsAltComponentType = (
  options: ControlButtonsAltComponentOptions
) => React.ReactNode;

/**
 * ControlButtonsAltComponent is a React functional component that renders a set of control buttons with customizable alignment, direction, and styling options.
 *
 * This component accepts an array of button configurations, allowing each button to have custom icons, colors, and functionality, displayed in either horizontal or vertical layout.
 *
 * @component
 * @param {ControlButtonsAltComponentOptions} props - The properties object.
 * @param {AltButton[]} props.buttons - Array of button configurations to render within the component.
 * @param {string} [props.position='left'] - Specifies the horizontal alignment of the buttons within the container ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - Specifies the vertical alignment of the buttons within the container ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - Determines the layout direction of the buttons, either 'horizontal' or 'vertical'.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional CSS styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - If true, displays the buttons container; if false, the container is hidden.
 *
 * @returns {JSX.Element} The rendered component containing control buttons.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactjs';
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
 *       backgroundColor: { default: 'blue' },
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
 *       buttons={buttons}
 *       position="left"
 *       location="top"
 *       direction="horizontal"
 *       buttonsContainerStyle={{ padding: 10 }}
 *       showAspect={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const ControlButtonsAltComponent: React.FC<
  ControlButtonsAltComponentOptions
> = ({
  buttons,
  position = "left",
  location = "top",
  direction = "horizontal",
  buttonsContainerStyle,
  showAspect = false,
}) => {
  const getAlignmentStyle = (): React.CSSProperties => {
    let alignmentStyle: React.CSSProperties = {};

    if (position === "left" || position === "right" || position === "middle") {
      alignmentStyle.justifyContent =
        position === "left"
          ? "flex-start"
          : position === "right"
          ? "flex-end"
          : "center";
    }

    if (location === "top" || location === "bottom" || location === "center") {
      alignmentStyle.alignItems =
        location === "top"
          ? "flex-start"
          : location === "bottom"
          ? "flex-end"
          : "center";
    }

    if (direction === "vertical") {
      alignmentStyle.flexDirection = "column";
    } else {
      alignmentStyle.flexDirection = "row";
    }

    return alignmentStyle;
  };

  return (
    <div
      style={{
        ...styles.container,
        ...getAlignmentStyle(),
        ...buttonsContainerStyle,
        display: showAspect ? "flex" : "none",
      }}
    >
      {buttons.map((button, index) => (
        <div
          key={index}
          style={{
            ...styles.buttonContainer,
            backgroundColor: button.backgroundColor?.default || "transparent",
            ...(direction === "vertical" && styles.verticalButton),
            display: button.show === false ? "none" : "flex",
          }}
          onClick={button.onPress}
        >
          {button.icon ? (
            button.active ? (
              button.alternateIconComponent ? (
                button.alternateIconComponent
              ) : (
                <FontAwesomeIcon
                  icon={button.alternateIcon!}
                  size="lg"
                  color={button.inActiveColor || "transparent"}
                />
              )
            ) : button.iconComponent ? (
              button.iconComponent
            ) : (
              <FontAwesomeIcon
                icon={button.icon}
                size="lg"
                color={button.inActiveColor || "transparent"}
              />
            )
          ) : (
            button.customComponent
          )}
          {button.name && (
            <span
              style={{ ...styles.buttonText, color: button.color || "#ffffff" }}
            >
              {button.name}
            </span>
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
  } as React.CSSProperties,
  buttonContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    cursor: "pointer",
  } as React.CSSProperties,
  verticalButton: {
    flexDirection: "column",
  } as React.CSSProperties,
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  } as React.CSSProperties,
};

export default ControlButtonsAltComponent;
