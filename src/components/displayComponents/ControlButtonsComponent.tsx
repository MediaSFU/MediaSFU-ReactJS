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
  alternateIconComponent?: React.JSX.Element;
  iconComponent?: React.JSX.Element;
  customComponent?: React.JSX.Element;
  color?: string;
  activeColor?: string;
  inActiveColor?: string;
  disabled?: boolean;
  show?: boolean;
  style?: React.CSSProperties;
  className?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  iconWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  textProps?: React.HTMLAttributes<HTMLSpanElement>;
  contentWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  renderContent?: (options: {
    index: number;
    isActive: boolean;
    defaultIcon: React.ReactNode;
    defaultLabel: React.ReactNode;
    defaultContent: React.ReactNode;
    vertical: boolean;
  }) => React.ReactNode;
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
  alternateIconComponent?: React.JSX.Element;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  iconWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  textProps?: React.HTMLAttributes<HTMLSpanElement>;
  contentWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  renderButton?: (options: {
    index: number;
    button: Button;
    defaultButton: React.ReactNode;
    defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    vertical: boolean;
  }) => React.ReactNode;
  renderButtonContent?: (options: {
    index: number;
    button: Button;
    defaultIcon: React.ReactNode;
    defaultLabel: React.ReactNode;
    defaultContent: React.ReactNode;
    vertical: boolean;
  }) => React.ReactNode;
  gap?: number | string;
}

export type ControlButtonsComponentType = (
  options: ControlButtonsComponentOptions
) => React.JSX.Element;

/**
 * ControlButtonsComponent - Flexible control button toolbar with rich customization
 * 
 * A highly configurable component for rendering action button toolbars (mute, video, screen share, etc.)
 * with support for horizontal/vertical layouts, custom alignment, and per-button rendering hooks.
 * 
 * Features:
 * - Horizontal or vertical button arrangement
 * - Flexible alignment (flex-start, center, flex-end, space-between, space-around, space-evenly)
 * - Per-button active states with custom colors
 * - Icon and label customization with FontAwesome support
 * - Custom render hooks for full button or content replacement
 * - Accessibility props support (aria-label, role, etc.)
 * - Show/hide individual buttons dynamically
 * 
 * @component
 * @param {ControlButtonsComponentOptions} props - Configuration options
 * @param {Button[]} props.buttons - Array of button configurations to render
 * @param {string} [props.buttonColor] - Default icon color for all buttons
 * @param {object} [props.buttonBackgroundColor] - Background color states for buttons
 * @param {string} [props.buttonBackgroundColor.default] - Default background color
 * @param {string} [props.buttonBackgroundColor.pressed] - Background when pressed/active
 * @param {string} [props.alignment='flex-start'] - Button container alignment
 * @param {boolean} [props.vertical=false] - Arrange buttons vertically (default horizontal)
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional container styles
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - Container HTML attributes
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.buttonProps] - Shared button attributes
 * @param {React.CSSProperties} [props.buttonStyle] - Additional button styles
 * @param {string} [props.buttonClassName] - Additional button class name
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.iconWrapperProps] - Icon wrapper attributes
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.textProps] - Text label attributes
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.contentWrapperProps] - Content wrapper attributes
 * @param {Function} [props.renderButton] - Custom button renderer
 * @param {Function} [props.renderButtonContent] - Custom content renderer (preserves button element)
 * @param {number|string} [props.gap] - Spacing between buttons
 * 
 * @returns {React.JSX.Element} Rendered control button toolbar
 * 
 * @example
 * // Basic media controls with active states
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsComponent } from 'mediasfu-reactjs';
 * import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
 * 
 * function MediaControls() {
 *   const [audioActive, setAudioActive] = useState(true);
 *   const [videoActive, setVideoActive] = useState(true);
 * 
 *   const buttons = [
 *     {
 *       name: audioActive ? 'Mute' : 'Unmute',
 *       icon: audioActive ? faMicrophone : faMicrophoneSlash,
 *       onPress: () => setAudioActive(!audioActive),
 *       active: audioActive,
 *       backgroundColor: { default: '#22c55e', pressed: '#14532d' },
 *       activeColor: '#ffffff',
 *       inActiveColor: '#dc2626',
 *     },
 *     {
 *       name: videoActive ? 'Stop Video' : 'Start Video',
 *       icon: videoActive ? faVideo : faVideoSlash,
 *       onPress: () => setVideoActive(!videoActive),
 *       active: videoActive,
 *       backgroundColor: { default: '#3b82f6', pressed: '#1e3a8a' },
 *     },
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       alignment="center"
 *       buttonsContainerStyle={{ padding: 16, backgroundColor: '#0f172a', borderRadius: 12 }}
 *       gap={12}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Vertical control panel with custom rendering
 * ```tsx
 * import { ControlButtonsComponent } from 'mediasfu-reactjs';
 * import { faShareScreen, faComments, faUserFriends } from '@fortawesome/free-solid-svg-icons';
 * 
 * function SideControls({ onShareScreen, onOpenChat, onShowParticipants }) {
 *   const buttons = [
 *     {
 *       name: 'Share Screen',
 *       icon: faShareScreen,
 *       onPress: onShareScreen,
 *       renderContent: ({ defaultIcon, defaultLabel }) => (
 *         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 *           {defaultIcon}
 *           <span style={{ fontSize: 14, fontWeight: 600 }}>{defaultLabel}</span>
 *         </div>
 *       ),
 *     },
 *     {
 *       name: 'Chat',
 *       icon: faComments,
 *       onPress: onOpenChat,
 *     },
 *     {
 *       name: 'Participants',
 *       icon: faUserFriends,
 *       onPress: onShowParticipants,
 *     },
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       vertical={true}
 *       alignment="flex-start"
 *       buttonBackgroundColor={{ default: 'rgba(255,255,255,0.1)', pressed: 'rgba(255,255,255,0.2)' }}
 *       buttonsContainerStyle={{ padding: 12, borderRadius: 8 }}
 *       gap={8}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Accessibility-enhanced controls with custom button renderer
 * ```tsx
 * import { ControlButtonsComponent } from 'mediasfu-reactjs';
 * import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
 * 
 * function MediaPlayer({ isPlaying, onTogglePlay, onStop }) {
 *   const buttons = [
 *     {
 *       name: isPlaying ? 'Pause' : 'Play',
 *       icon: isPlaying ? faPause : faPlay,
 *       onPress: onTogglePlay,
 *       active: isPlaying,
 *       buttonProps: { 'aria-label': isPlaying ? 'Pause playback' : 'Start playback' },
 *     },
 *     {
 *       name: 'Stop',
 *       icon: faStop,
 *       onPress: onStop,
 *       buttonProps: { 'aria-label': 'Stop playback' },
 *     },
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       alignment="center"
 *       containerProps={{ role: 'toolbar', 'aria-label': 'Media playback controls' }}
 *       renderButton={({ defaultButton, button, index }) => (
 *         <div key={index} style={{ position: 'relative' }}>
 *           {defaultButton}
 *           {button.active && (
 *             <div style={{
 *               position: 'absolute',
 *               top: -4,
 *               right: -4,
 *               width: 8,
 *               height: 8,
 *               borderRadius: '50%',
 *               backgroundColor: '#22c55e',
 *             }} />
 *           )}
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, ControlButtonsComponent } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   controlButtons: {
 *     render: (props) => (
 *       <ControlButtonsComponent
 *         {...props}
 *         alignment="space-between"
 *         buttonsContainerStyle={{
 *           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *           padding: 20,
 *           borderRadius: 16,
 *           boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
 *         }}
 *         buttonBackgroundColor={{ default: 'rgba(255,255,255,0.2)', pressed: 'rgba(255,255,255,0.3)' }}
 *         gap={16}
 *       />
 *     ),
 *   },
 * };
 * 
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */


const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions> = ({
  buttons,
  buttonColor,
  buttonBackgroundColor,
  alignment = "flex-start",
  vertical = false,
  buttonsContainerStyle,
  alternateIconComponent,
  containerProps,
  buttonProps,
  buttonStyle,
  buttonClassName,
  iconWrapperProps,
  textProps,
  contentWrapperProps,
  renderButton,
  renderButtonContent,
  gap,
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

  const {
    className: sharedButtonClassName,
    style: sharedButtonStyle,
    onClick: sharedButtonOnClick,
    type: sharedButtonType,
    ...sharedButtonRest
  } = buttonProps ?? {};

  const {
    className: containerClassName,
    style: containerStyleProps,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = [
    "mediasfu-container",
    containerClassName,
  ].filter(Boolean).join(" ");

  const containerStyle: React.CSSProperties = {
    ...getAlignmentStyle(),
    ...(vertical ? { flexDirection: "column" } : {}),
    ...(gap !== undefined ? { gap } : {}),
    ...buttonsContainerStyle,
    ...containerStyleProps,
  };

  const buildContent = (
    button: Button,
    index: number,
    vertical: boolean,
    defaultIcon: React.ReactNode,
    defaultLabel: React.ReactNode,
    defaultContentNode: React.ReactNode
  ): React.ReactNode => {
    const baseRender = () => {
      if (button.renderContent) {
        return button.renderContent({
          index,
          isActive: !!button.active,
          defaultIcon,
          defaultLabel,
          defaultContent: defaultContentNode,
          vertical,
        });
      }

      if (renderButtonContent) {
        return renderButtonContent({
          index,
          button,
          defaultIcon,
          defaultLabel,
          defaultContent: defaultContentNode,
          vertical,
        });
      }

      return defaultContentNode;
    };

    return baseRender();
  };

  const {
    style: defaultContentWrapperStyle,
    className: defaultContentWrapperClassName,
    ...restDefaultContentWrapper
  } = contentWrapperProps ?? {};

  const {
    style: defaultIconWrapperStyle,
    className: defaultIconWrapperClassName,
    ...restDefaultIconWrapper
  } = iconWrapperProps ?? {};

  const {
    style: defaultTextStyle,
    className: defaultTextClassName,
    ...restDefaultTextProps
  } = textProps ?? {};

  return (
    <div
      {...restContainerProps}
      className={containerClassNames}
      style={containerStyle}
    >
      {buttons.map((button, index) => {
        const {
          buttonProps: perButtonProps,
          style: perButtonStyle,
          className: perButtonClassName,
          iconWrapperProps: perButtonIconWrapperProps,
          textProps: perButtonTextProps,
          contentWrapperProps: perButtonContentWrapperProps,
        } = button;

        const {
          onClick: perButtonOnClick,
          style: perButtonButtonStyle,
          className: perButtonButtonClassName,
          type: perButtonType,
          ...restPerButtonProps
        } = perButtonProps ?? {};

        const {
          style: buttonContentWrapperStyle,
          className: buttonContentWrapperClassName,
          ...restButtonContentWrapper
        } = perButtonContentWrapperProps ?? {};

        const contentWrapperClassName = [
          "mediasfu-button-content",
          defaultContentWrapperClassName,
          buttonContentWrapperClassName,
        ].filter(Boolean).join(" ") || undefined;

        const contentWrapperStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          gap: vertical ? 6 : 8,
          ...defaultContentWrapperStyle,
          ...buttonContentWrapperStyle,
        };

        const resolvedContentWrapperProps: React.HTMLAttributes<HTMLDivElement> = {
          ...restDefaultContentWrapper,
          ...restButtonContentWrapper,
          className: contentWrapperClassName,
          style: contentWrapperStyle,
        };

        const {
          style: perButtonIconWrapperStyle,
          className: perButtonIconWrapperClassName,
          ...restPerButtonIconWrapper
        } = perButtonIconWrapperProps ?? {};

        const iconWrapperClassName = [
          "mediasfu-button-icon",
          defaultIconWrapperClassName,
          perButtonIconWrapperClassName,
        ].filter(Boolean).join(" ") || undefined;

        const iconWrapperStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          ...defaultIconWrapperStyle,
          ...perButtonIconWrapperStyle,
        };

        const resolvedIconWrapperProps: React.HTMLAttributes<HTMLSpanElement> = {
          ...restDefaultIconWrapper,
          ...restPerButtonIconWrapper,
          className: iconWrapperClassName,
          style: iconWrapperStyle,
        };

        const {
          style: perButtonTextStyle,
          className: perButtonTextClassName,
          ...restPerButtonTextProps
        } = perButtonTextProps ?? {};

        const textClassName = [
          "buttonText",
          defaultTextClassName,
          perButtonTextClassName,
        ].filter(Boolean).join(" ") || undefined;

        const textStyle: React.CSSProperties = {
          color: button.color || buttonColor || "#ffffff",
          ...defaultTextStyle,
          ...perButtonTextStyle,
        };

        const resolvedTextProps: React.HTMLAttributes<HTMLSpanElement> = {
          ...restDefaultTextProps,
          ...restPerButtonTextProps,
          className: textClassName,
          style: textStyle,
        };

        const activeIconColor =
          button.activeColor || buttonColor || "#ffffff";
        const inactiveIconColor =
          button.inActiveColor || buttonColor || "#ffffff";

        const resolvedIcon = (() => {
          if (button.customComponent) {
            return button.customComponent;
          }

          if (button.icon) {
            if (button.active) {
              if (button.alternateIconComponent) {
                return button.alternateIconComponent;
              }

              if (button.alternateIcon) {
                return (
                  <FontAwesomeIcon
                    icon={button.alternateIcon}
                    size="lg"
                    color={activeIconColor}
                  />
                );
              }

              if (alternateIconComponent) {
                return alternateIconComponent;
              }
            }

            if (button.iconComponent) {
              return button.iconComponent;
            }

            return (
              <FontAwesomeIcon
                icon={button.icon}
                size="lg"
                color={inactiveIconColor}
              />
            );
          }

          return alternateIconComponent || null;
        })();

        const iconElement = resolvedIcon ? (
          <span {...resolvedIconWrapperProps}>{resolvedIcon}</span>
        ) : null;

        const labelElement = button.name ? (
          <span {...resolvedTextProps}>{button.name}</span>
        ) : null;

        const defaultContent = (
          <div {...resolvedContentWrapperProps}>
            {iconElement}
            {labelElement}
          </div>
        );

        const mergedButtonRest: React.ButtonHTMLAttributes<HTMLButtonElement> = {
          ...sharedButtonRest,
          ...restPerButtonProps,
          disabled:
            button.disabled ?? restPerButtonProps?.disabled ?? sharedButtonRest?.disabled,
        };

        const isVisible = button.show !== false;

        const backgroundDefault = () => {
          const pressedColor =
            button.backgroundColor?.pressed || buttonBackgroundColor?.pressed;
          const defaultColor =
            button.backgroundColor?.default || buttonBackgroundColor?.default;

          if (!isVisible) {
            return "transparent";
          }

          if (button.active && pressedColor) {
            return pressedColor;
          }

          if (defaultColor) {
            return defaultColor;
          }

          return sharedButtonStyle?.backgroundColor || buttonStyle?.backgroundColor || perButtonStyle?.backgroundColor || "transparent";
        };

        const combinedStyle: React.CSSProperties = {
          backgroundColor: backgroundDefault(),
          ...(vertical ? { flexDirection: "column" } : {}),
          display: isVisible ? "flex" : "none",
          ...sharedButtonStyle,
          ...buttonStyle,
          ...perButtonButtonStyle,
          ...perButtonStyle,
        };

        if (isVisible && !combinedStyle.display) {
          combinedStyle.display = "flex";
        }

        const combinedClassName = [
          "buttonContainer",
          sharedButtonClassName,
          buttonClassName,
          perButtonButtonClassName,
          perButtonClassName,
        ].filter(Boolean).join(" ") || undefined;

        const resolvedType = perButtonType || sharedButtonType || "button";

        const handleClick: React.MouseEventHandler<HTMLButtonElement> = (
          event
        ) => {
          perButtonOnClick?.(event);
          sharedButtonOnClick?.(event);

          if (!event.defaultPrevented) {
            button.onPress?.();
          }
        };

        const computedButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
          ...mergedButtonRest,
          className: combinedClassName,
          style: combinedStyle,
          type: resolvedType,
          onClick: handleClick,
        };

        const renderedContent = buildContent(
          button,
          index,
          vertical,
          iconElement,
          labelElement,
          defaultContent
        );

        if (renderButton) {
          return (
            <React.Fragment key={index}>
              {renderButton({
                index,
                button,
                defaultButton: (
                  <button {...computedButtonProps}>{renderedContent}</button>
                ),
                defaultProps: computedButtonProps,
                vertical,
              })}
            </React.Fragment>
          );
        }

        return (
          <button key={index} {...computedButtonProps}>
            {renderedContent}
          </button>
        );
      })}
    </div>
  );
};

export default ControlButtonsComponent;
