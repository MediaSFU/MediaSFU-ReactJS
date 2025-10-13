import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ButtonTouch {
  name?: string;
  icon?: IconDefinition;
  alternateIcon?: IconDefinition;
  onPress?: () => void;
  backgroundColor?: {
    default?: string;
  };
  active?: boolean;
  alternateIconComponent?: React.JSX.Element;
  iconComponent?: React.JSX.Element;
  customComponent?: React.JSX.Element;
  color?: string;
  activeColor?: string;
  inActiveColor?: string;
  show?: boolean;
  disabled?: boolean;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
  iconWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  textProps?: React.HTMLAttributes<HTMLSpanElement>;
  contentWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  renderContent?: (options: {
    index: number;
    isActive: boolean;
    defaultIcon: React.ReactNode;
    defaultLabel: React.ReactNode;
    defaultContent: React.ReactNode;
    direction: "horizontal" | "vertical";
  }) => React.ReactNode;
  renderButton?: (options: {
    index: number;
    button: ButtonTouch;
    defaultButton: React.ReactNode;
    defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    direction: "horizontal" | "vertical";
  }) => React.ReactNode;
}

export interface ControlButtonsComponentTouchOptions {
  buttons: ButtonTouch[];
  position?: "left" | "right" | "middle";
  location?: "top" | "bottom" | "center";
  direction?: "horizontal" | "vertical";
  buttonsContainerStyle?: React.CSSProperties;
  alternateIconComponent?: React.JSX.Element;
  iconComponent?: React.JSX.Element;
  showAspect?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  iconWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  textProps?: React.HTMLAttributes<HTMLSpanElement>;
  contentWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  renderButton?: (options: {
    index: number;
    button: ButtonTouch;
    defaultButton: React.ReactNode;
    defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    direction: "horizontal" | "vertical";
  }) => React.ReactNode;
  renderButtonContent?: (options: {
    index: number;
    button: ButtonTouch;
    defaultIcon: React.ReactNode;
    defaultLabel: React.ReactNode;
    defaultContent: React.ReactNode;
    direction: "horizontal" | "vertical";
  }) => React.ReactNode;
  gap?: number | string;
}

export type ControlButtonsComponentTouchType = (
  options: ControlButtonsComponentTouchOptions
) => React.JSX.Element;

/**
 * ControlButtonsComponentTouch - Touch-optimized control buttons for mobile and tablet devices.
 * 
 * This component provides a touch-friendly interface for media control buttons, specifically designed
 * for mobile and tablet experiences with larger hit areas, optimized spacing, and touch-specific interactions.
 * It offers the same flexibility as other control button components while prioritizing touch usability.
 * 
 * **Key Features:**
 * - **Touch-Optimized**: Larger hit areas and spacing optimized for finger interactions
 * - **Flexible Layout**: Horizontal or vertical button arrangements with gap control
 * - **Positioning Control**: Nine-point positioning system (left/middle/right × top/center/bottom)
 * - **Per-Button Customization**: Individual button styling, colors, icons, and behavior
 * - **Active State Management**: Clear visual feedback for active/inactive button states
 * - **Custom Components**: Support for custom button components and icon replacements
 * - **Render Hooks**: Complete override capability for button content and structure
 * - **Visibility Control**: Individual button show/hide with conditional rendering
 * - **Disabled States**: Proper disabled styling and interaction blocking
 * - **Icon Flexibility**: Support for FontAwesome icons, custom icons, and alternate icons
 * - **HTML Attributes**: Granular control over all button elements (button, icon wrapper, text, content)
 * - **Shared and Individual Props**: Shared defaults with per-button override capability
 * - **Accessibility**: Touch-friendly ARIA attributes and semantic HTML
 * 
 * @component
 * 
 * @param {ControlButtonsComponentTouchOptions} props - Configuration options for ControlButtonsComponentTouch
 * @param {ButtonTouch[]} props.buttons - Array of touch button configurations with individual settings
 * @param {"left" | "right" | "middle"} [props.position="left"] - Horizontal alignment of button container
 * @param {"top" | "bottom" | "center"} [props.location="top"] - Vertical alignment of button container
 * @param {"horizontal" | "vertical"} [props.direction="horizontal"] - Button layout direction
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for button container
 * @param {React.JSX.Element} [props.alternateIconComponent] - Default alternate icon component for all buttons
 * @param {React.JSX.Element} [props.iconComponent] - Default primary icon component for all buttons
 * @param {boolean} [props.showAspect=false] - Controls overall visibility of button container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for container wrapper
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.buttonProps] - Shared HTML attributes for all buttons
 * @param {React.CSSProperties} [props.buttonStyle] - Shared CSS styles applied to all buttons
 * @param {string} [props.buttonClassName] - Shared class name appended to all buttons
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.iconWrapperProps] - Shared HTML attributes for icon wrappers
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.textProps] - Shared HTML attributes for text labels
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.contentWrapperProps] - Shared HTML attributes for content wrappers
 * @param {(options: {index: number; button: ButtonTouch; defaultButton: React.ReactNode; defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>; direction: "horizontal" | "vertical"}) => React.ReactNode} [props.renderButton] - Custom render function for entire button
 * @param {(options: {index: number; button: ButtonTouch; defaultIcon: React.ReactNode; defaultLabel: React.ReactNode; defaultContent: React.ReactNode; direction: "horizontal" | "vertical"}) => React.ReactNode} [props.renderButtonContent] - Custom render function for button content
 * @param {number | string} [props.gap] - Spacing between buttons (CSS gap value)
 * 
 * @returns {React.JSX.Element} The rendered touch-optimized control buttons component
 * 
 * @example
 * // Basic touch controls for mobile video player
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsComponentTouch } from 'mediasfu-reactjs';
 * import { faPlay, faPause, faVolumeUp, faExpand } from '@fortawesome/free-solid-svg-icons';
 * 
 * const MobileVideoControls = () => {
 *   const [isPlaying, setIsPlaying] = useState(false);
 *   const [isMuted, setIsMuted] = useState(false);
 * 
 *   const buttons = [
 *     {
 *       name: 'Play',
 *       icon: faPlay,
 *       alternateIcon: faPause,
 *       active: isPlaying,
 *       onPress: () => setIsPlaying(!isPlaying),
 *       show: true
 *     },
 *     {
 *       name: 'Volume',
 *       icon: faVolumeUp,
 *       active: !isMuted,
 *       onPress: () => setIsMuted(!isMuted),
 *       show: true
 *     },
 *     {
 *       name: 'Fullscreen',
 *       icon: faExpand,
 *       onPress: () => console.log('Enter fullscreen'),
 *       show: true
 *     }
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponentTouch
 *       buttons={buttons}
 *       direction="horizontal"
 *       position="middle"
 *       location="bottom"
 *       showAspect={true}
 *       gap={16}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled touch controls with haptic feedback
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsComponentTouch } from 'mediasfu-reactjs';
 * import { faVideo, faMicrophone, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
 * 
 * const MeetingTouchControls = () => {
 *   const [videoOn, setVideoOn] = useState(true);
 *   const [audioOn, setAudioOn] = useState(true);
 * 
 *   const triggerHaptic = () => {
 *     if ('vibrate' in navigator) {
 *       navigator.vibrate(10); // Short haptic feedback
 *     }
 *   };
 * 
 *   const buttons = [
 *     {
 *       name: 'Camera',
 *       icon: faVideo,
 *       active: videoOn,
 *       onPress: () => {
 *         triggerHaptic();
 *         setVideoOn(!videoOn);
 *       },
 *       backgroundColor: { default: '#34495e' },
 *       activeColor: '#2ecc71',
 *       inActiveColor: '#e74c3c',
 *       show: true,
 *       style: { minWidth: '60px', minHeight: '60px' }
 *     },
 *     {
 *       name: 'Mic',
 *       icon: faMicrophone,
 *       active: audioOn,
 *       onPress: () => {
 *         triggerHaptic();
 *         setAudioOn(!audioOn);
 *       },
 *       backgroundColor: { default: '#34495e' },
 *       activeColor: '#2ecc71',
 *       inActiveColor: '#e74c3c',
 *       show: true,
 *       style: { minWidth: '60px', minHeight: '60px' }
 *     },
 *     {
 *       name: 'End Call',
 *       icon: faPhoneSlash,
 *       onPress: () => {
 *         triggerHaptic();
 *         console.log('End call');
 *       },
 *       backgroundColor: { default: '#c0392b' },
 *       color: '#fff',
 *       show: true,
 *       style: { minWidth: '60px', minHeight: '60px' }
 *     }
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponentTouch
 *       buttons={buttons}
 *       direction="horizontal"
 *       position="middle"
 *       location="bottom"
 *       showAspect={true}
 *       buttonsContainerStyle={{
 *         padding: '20px',
 *         borderRadius: '16px',
 *         backgroundColor: 'rgba(0,0,0,0.9)'
 *       }}
 *       gap={20}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking for touch interactions
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsComponentTouch } from 'mediasfu-reactjs';
 * import { faThumbsUp, faHand, faComment } from '@fortawesome/free-solid-svg-icons';
 * 
 * const InteractiveTouchControls = () => {
 *   const [reactions, setReactions] = useState({ like: 0, hand: 0, comment: 0 });
 * 
 *   const trackTouchInteraction = (action: string, touchData: any) => {
 *     analytics.track('Touch Control Interaction', {
 *       action,
 *       device: 'mobile',
 *       timestamp: new Date(),
 *       ...touchData
 *     });
 *   };
 * 
 *   const buttons = [
 *     {
 *       name: '👍',
 *       icon: faThumbsUp,
 *       onPress: () => {
 *         const newCount = reactions.like + 1;
 *         setReactions({ ...reactions, like: newCount });
 *         trackTouchInteraction('Like', { count: newCount });
 *       },
 *       show: true
 *     },
 *     {
 *       name: '✋',
 *       icon: faHand,
 *       onPress: () => {
 *         const newCount = reactions.hand + 1;
 *         setReactions({ ...reactions, hand: newCount });
 *         trackTouchInteraction('Raise Hand', { count: newCount });
 *       },
 *       show: true
 *     },
 *     {
 *       name: '💬',
 *       icon: faComment,
 *       onPress: () => {
 *         trackTouchInteraction('Open Chat', {});
 *         console.log('Open chat');
 *       },
 *       show: true
 *     }
 *   ];
 * 
 *   return (
 *     <ControlButtonsComponentTouch
 *       buttons={buttons}
 *       direction="vertical"
 *       position="right"
 *       location="center"
 *       showAspect={true}
 *       renderButtonContent={({ defaultContent, button, index }) => (
 *         <div 
 *           className="touch-button-content"
 *           onTouchStart={(e) => {
 *             trackTouchInteraction('Touch Start', { 
 *               buttonName: button.name,
 *               touchCount: e.touches.length 
 *             });
 *           }}
 *         >
 *           {defaultContent}
 *         </div>
 *       )}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, ControlButtonsComponentTouch } from 'mediasfu-reactjs';
 * 
 * const CustomTouchControlsComponent = (props) => (
 *   <ControlButtonsComponentTouch
 *     {...props}
 *     direction="horizontal"
 *     position="middle"
 *     location="bottom"
 *     gap={24}
 *     renderButton={({ defaultButton, button, index }) => (
 *       <div 
 *         className="custom-touch-button-wrapper"
 *         style={{
 *           position: 'relative',
 *           touchAction: 'manipulation' // Optimize for touch
 *         }}
 *       >
 *         <button
 *           className={`touch-optimized-button ${button.active ? 'active' : ''}`}
 *           onClick={button.onPress}
 *           style={{
 *             minWidth: '56px',
 *             minHeight: '56px',
 *             borderRadius: '50%',
 *             border: 'none',
 *             cursor: 'pointer',
 *             WebkitTapHighlightColor: 'transparent' // Remove tap highlight
 *           }}
 *         >
 *           <span className="button-icon" style={{ fontSize: '24px' }}>
 *             Icon content here
 *           </span>
 *         </button>
 *         {button.active && (
 *           <div className="active-pulse" style={{
 *             position: 'absolute',
 *             inset: '-4px',
 *             borderRadius: '50%',
 *             border: '2px solid #2ecc71',
 *             animation: 'pulse 1.5s infinite'
 *           }} />
 *         )}
 *       </div>
 *     )}
 *   />
 * );
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         ControlButtonsComponentTouch: CustomTouchControlsComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 *       active: true,
 *       backgroundColor: { default: "#047857" },
 *       renderContent: ({ defaultContent }) => (
 *         <span className="touch-button__content">{defaultContent}</span>
 *       ),
 *     },
 *     {
 *       name: "Pause",
 *       icon: faPause,
 *       onPress: () => console.log("Pause button pressed"),
 *       buttonProps: { 'aria-label': 'Pause media' },
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsComponentTouch
 *       showAspect
 *       direction="horizontal"
 *       buttons={buttons}
 *       containerProps={{ 'aria-label': 'mobile controls', role: 'toolbar' }}
 *       buttonProps={{ type: 'button' }}
 *       gap={12}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */



const ControlButtonsComponentTouch: React.FC<
  ControlButtonsComponentTouchOptions
> = ({
  buttons,
  position = "left",
  location = "top",
  direction = "horizontal",
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
  showAspect = false,
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
  const isVertical = direction === "vertical";

  const getAlignmentStyle = (): React.CSSProperties => {
    const alignmentStyle: React.CSSProperties = {};

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

    alignmentStyle.flexDirection = isVertical ? "column" : "row";

    return alignmentStyle;
  };

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = [
    "mediasfu-touch-buttons",
    containerClassName,
  ].filter(Boolean).join(" ") || undefined;

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    ...getAlignmentStyle(),
    ...(gap !== undefined ? { gap } : {}),
    ...buttonsContainerStyle,
    ...containerStyleOverrides,
  };

  if (!showAspect) {
    containerStyle.display = "none";
  } else if (!containerStyle.display) {
    containerStyle.display = "flex";
  }

  const {
    className: sharedButtonClassName,
    style: sharedButtonStyle,
    type: sharedButtonType,
    onClick: sharedButtonOnClick,
    ...sharedButtonRest
  } = buttonProps ?? {};

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

  const {
    style: defaultContentWrapperStyle,
    className: defaultContentWrapperClassName,
    ...restDefaultContentWrapper
  } = contentWrapperProps ?? {};

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
          iconWrapperProps: perIconWrapperProps,
          textProps: perTextProps,
          contentWrapperProps: perContentWrapperProps,
        } = button;

        const {
          onClick: perButtonOnClick,
          style: perButtonButtonStyle,
          className: perButtonButtonClassName,
          type: perButtonType,
          ...restPerButtonProps
        } = perButtonProps ?? {};

        const transparentFallback =
          button.inActiveColor === "transparent" &&
          button.activeColor === "transparent";

        const shouldShow = button.show !== false;
        const isVisible = shouldShow || transparentFallback;

        const mergedButtonRest: React.ButtonHTMLAttributes<HTMLButtonElement> = {
          ...sharedButtonRest,
          ...restPerButtonProps,
          disabled:
            button.disabled ?? restPerButtonProps?.disabled ?? sharedButtonRest?.disabled,
        };

        const fallbackBackground = shouldShow
          ? "rgba(255, 255, 255, 0.25)"
          : "transparent";

        const backgroundColor = isVisible
          ? perButtonButtonStyle?.backgroundColor ??
            perButtonStyle?.backgroundColor ??
            buttonStyle?.backgroundColor ??
            sharedButtonStyle?.backgroundColor ??
            button.backgroundColor?.default ??
            fallbackBackground
          : "transparent";

        const combinedStyle: React.CSSProperties = {
          ...styles.buttonContainer,
          ...(isVertical ? styles.verticalButton : {}),
          ...(isVisible ? {} : { display: "none" }),
          backgroundColor,
          ...sharedButtonStyle,
          ...buttonStyle,
          ...perButtonButtonStyle,
          ...perButtonStyle,
        };

        if (isVisible && !combinedStyle.display) {
          combinedStyle.display = "flex";
        }

        const combinedClassName = [
          "mediasfu-touch-button",
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

        const {
          style: perContentWrapperStyle,
          className: perContentWrapperClassName,
          ...restPerContentWrapper
        } = perContentWrapperProps ?? {};

        const contentWrapperClassName = [
          "mediasfu-touch-button-content",
          defaultContentWrapperClassName,
          perContentWrapperClassName,
        ].filter(Boolean).join(" ") || undefined;

        const contentWrapperStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? 6 : 8,
          ...defaultContentWrapperStyle,
          ...perContentWrapperStyle,
        };

        const resolvedContentWrapperProps: React.HTMLAttributes<HTMLDivElement> = {
          ...restDefaultContentWrapper,
          ...restPerContentWrapper,
          className: contentWrapperClassName,
          style: contentWrapperStyle,
        };

        const {
          style: perIconWrapperStyle,
          className: perIconWrapperClassName,
          ...restPerIconWrapper
        } = perIconWrapperProps ?? {};

        const iconWrapperClassName = [
          "mediasfu-touch-button-icon",
          defaultIconWrapperClassName,
          perIconWrapperClassName,
        ].filter(Boolean).join(" ") || undefined;

        const iconWrapperStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...defaultIconWrapperStyle,
          ...perIconWrapperStyle,
        };

        const resolvedIconWrapperProps: React.HTMLAttributes<HTMLSpanElement> = {
          ...restDefaultIconWrapper,
          ...restPerIconWrapper,
          className: iconWrapperClassName,
          style: iconWrapperStyle,
        };

        const {
          style: perTextStyle,
          className: perTextClassName,
          ...restPerTextProps
        } = perTextProps ?? {};

        const textClassName = [
          "mediasfu-touch-button-text",
          defaultTextClassName,
          perTextClassName,
        ].filter(Boolean).join(" ") || undefined;

        const textStyle: React.CSSProperties = {
          ...styles.buttonText,
          color: button.color || defaultTextStyle?.color || "transparent",
          ...defaultTextStyle,
          ...perTextStyle,
        };

        const resolvedTextProps: React.HTMLAttributes<HTMLSpanElement> = {
          ...restDefaultTextProps,
          ...restPerTextProps,
          className: textClassName,
          style: textStyle,
        };

        const activeIconColor = button.activeColor || button.color || "transparent";
        const inactiveIconColor =
          button.inActiveColor || button.color || "transparent";

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

          if (iconComponent) {
            return iconComponent;
          }

          return null;
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

        const renderedContent = button.renderContent
          ? button.renderContent({
              index,
              isActive: !!button.active,
              defaultIcon: iconElement,
              defaultLabel: labelElement,
              defaultContent,
              direction,
            })
          : renderButtonContent
          ? renderButtonContent({
              index,
              button,
              defaultIcon: iconElement,
              defaultLabel: labelElement,
              defaultContent,
              direction,
            })
          : defaultContent;

        const computedButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
          ...mergedButtonRest,
          className: combinedClassName,
          style: combinedStyle,
          type: resolvedType,
          onClick: handleClick,
        };

        const buttonElement = (
          <button key={index} {...computedButtonProps}>
            {renderedContent}
          </button>
        );

        if (button.renderButton) {
          return (
            <React.Fragment key={index}>
              {button.renderButton({
                index,
                button,
                defaultButton: buttonElement,
                defaultProps: computedButtonProps,
                direction,
              })}
            </React.Fragment>
          );
        }

        if (renderButton) {
          return (
            <React.Fragment key={index}>
              {renderButton({
                index,
                button,
                defaultButton: buttonElement,
                defaultProps: computedButtonProps,
                direction,
              })}
            </React.Fragment>
          );
        }

        return buttonElement;
      })}
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
