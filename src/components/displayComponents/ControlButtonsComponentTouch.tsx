import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ButtonTouch {
  name?: string;
  icon?: IconDefinition
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
  activeColor?: string;
  inActiveColor?: string;
  show?: boolean;
  disabled?: boolean;
}

export interface ControlButtonsComponentTouchOptions {
  buttons: ButtonTouch[];
  position?: "left" | "right" | "middle";
  location?: "top" | "bottom" | "center";
  direction?: "horizontal" | "vertical";
  buttonsContainerStyle?: React.CSSProperties;
  showAspect?: boolean;
}

export type ControlButtonsComponentTouchType = (
  options: ControlButtonsComponentTouchOptions
) => JSX.Element;

/**
 * ControlButtonsComponentTouch is a React functional component that renders a set of control buttons
 * with customizable styles and alignment options.
 *
 * @param {ControlButtonsComponentTouchOptions} props - The properties for the component.
 * @param {Array<Button>} props.buttons - An array of button objects to be rendered.
 * @param {string} [props.position="left"] - The horizontal position of the button container. 
 *                                           Can be "left", "right", or "middle".
 * @param {string} [props.location="top"] - The vertical location of the button container. 
 *                                          Can be "top", "bottom", or "center".
 * @param {string} [props.direction="horizontal"] - The direction of the button layout. 
 *                                                  Can be "horizontal" or "vertical".
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for the button container.
 * @param {boolean} [props.showAspect=false] - Flag to determine if the button container should be displayed.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ControlButtonsComponentTouch: React.FC<
  ControlButtonsComponentTouchOptions
> = ({
  buttons,
  position = "left",
  location = "top",
  direction = "horizontal",
  buttonsContainerStyle,
  showAspect = false,
}) => {
  /**
   * Get the alignment style for the button container.
   * @returns {React.CSSProperties} - The alignment style object.
   */
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
        <button
          key={index}
          style={{
            ...styles.buttonContainer,
            backgroundColor: button.show
              ? button.backgroundColor?.default || "rgba(255, 255, 255, 0.25)"
              : "transparent",
            ...(direction === "vertical" && styles.verticalButton),
            display: button.show
              ? "flex"
              : button.inActiveColor === "transparent" &&
                button.activeColor === "transparent"
              ? "flex"
              : "none",
          }}
          disabled={button.disabled}
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
                  color={button.activeColor || "transparent"}
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
              style={{
                ...styles.buttonText,
                color: button.color || "transparent",
              }}
            >
              {button.name}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 5,
    marginBottom: 5,
    elevation: 9,
    zIndex: 9,
    backgroundColor: "transparent",
  } as React.CSSProperties,
  buttonContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginTop: 5,
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
  } as React.CSSProperties,
  verticalButton: {
    flexDirection: "column",
  } as React.CSSProperties,
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  } as React.CSSProperties,
};

export default ControlButtonsComponentTouch;
