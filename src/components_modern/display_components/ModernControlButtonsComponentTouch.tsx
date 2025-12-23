import React from "react";
import ControlButtonsComponentTouch, {
  ControlButtonsComponentTouchOptions,
} from "../../components/displayComponents/ControlButtonsComponentTouch";
import { ModernTooltip } from "../core/widgets/ModernTooltip";

const ModernControlButtonsComponentTouch: React.FC<
  ControlButtonsComponentTouchOptions
> = (props) => {
  const { 
    position = "right",  // Default to right instead of left
    location = "bottom", // Default to bottom
    direction = "vertical", // Default to vertical
    buttonsContainerStyle 
  } = props;

  // Compute position-based styles to prevent full-width spanning
  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      // Reset the full-width spanning from base component
      left: '50%',
      right: 'auto',
      width: 'fit-content',
      transform: 'translateX(-50%)',
    };

    // Set position based on the position prop
    if (position === "right") {
      styles.right = 0;
      styles.left = 'auto';
      styles.transform = undefined;
    } else if (position === "left") {
      styles.left = 0;
      styles.transform = undefined;
    }

    return styles;
  };

  // Merge container style with semi-transparent background and force column alignment
  const mergedContainerStyle: React.CSSProperties = {
    ...getPositionStyles(),
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 12,
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    alignItems: 'center',  // Center buttons horizontally in column
    justifyContent: 'center',
    gap: 4,
    ...buttonsContainerStyle,
  };

  // Override text style for larger font
  const textStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    display: 'none', // Hide text label to ensure icon is centered
    ...(props.textStyle || {}),
  };

  // Determine tooltip position based on layout
  const getTooltipPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    if (direction === 'vertical') {
      return position === 'left' ? 'right' : 'left';
    }
    return location === 'top' ? 'bottom' : 'top';
  };

  const tooltipPosition = getTooltipPosition();

  // Increase button size for large screens, make button background transparent, and enforce uniform sizing
  // The semi-transparent background is on the container, not individual buttons
  const isLargeScreen = typeof window !== "undefined" && window.innerWidth > 768;
  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent', // Override the default rgba(255,255,255,0.25) per-button background
    width: 48,
    height: 48,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    ...(isLargeScreen ? { transform: "scale(1.1)" } : {}),
    ...(props.buttonStyle || {}),
  };

  // Center the content wrapper inside buttons
  const contentWrapperProps: React.HTMLAttributes<HTMLDivElement> = {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    ...props.contentWrapperProps,
  };

  // Center the icon wrapper
  const iconWrapperProps: React.HTMLAttributes<HTMLSpanElement> = {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ...props.iconWrapperProps,
  };

  return (
    <ControlButtonsComponentTouch
      {...props}
      position={position}
      location={location}
      direction={direction}
      buttons={props.buttons}
      buttonsContainerStyle={mergedContainerStyle}
      textStyle={textStyle}
      buttonStyle={buttonStyle}
      contentWrapperProps={contentWrapperProps}
      iconWrapperProps={iconWrapperProps}
      renderButton={({ button, defaultButton }) => (
        <ModernTooltip message={button.name || ''} position={tooltipPosition}>
          {defaultButton}
        </ModernTooltip>
      )}
    />
  );
};

export default ModernControlButtonsComponentTouch;
