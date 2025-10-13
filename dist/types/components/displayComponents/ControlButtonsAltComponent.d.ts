import React from "react";
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
        button: AltButton;
        defaultButton: React.ReactNode;
        defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
        direction: "horizontal" | "vertical";
    }) => React.ReactNode;
}
export interface ControlButtonsAltComponentOptions {
    buttons: AltButton[];
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
        button: AltButton;
        defaultButton: React.ReactNode;
        defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
        direction: "horizontal" | "vertical";
    }) => React.ReactNode;
    renderButtonContent?: (options: {
        index: number;
        button: AltButton;
        defaultIcon: React.ReactNode;
        defaultLabel: React.ReactNode;
        defaultContent: React.ReactNode;
        direction: "horizontal" | "vertical";
    }) => React.ReactNode;
    gap?: number | string;
}
export type ControlButtonsAltComponentType = (options: ControlButtonsAltComponentOptions) => React.ReactNode;
/**
 * ControlButtonsAltComponent - An alternative control buttons layout with enhanced customization.
 *
 * This component provides a highly flexible alternative layout for media control buttons, offering
 * extensive styling options, positioning flexibility, and render hooks for complete customization.
 * It's designed for scenarios requiring different visual styles from the standard control buttons.
 *
 * **Key Features:**
 * - **Flexible Layout**: Horizontal or vertical button arrangements with gap control
 * - **Positioning Control**: Nine-point positioning system (left/middle/right × top/center/bottom)
 * - **Per-Button Customization**: Individual button styling, colors, icons, and behavior
 * - **Active State Management**: Visual feedback for active/inactive button states
 * - **Custom Components**: Support for custom button components and icon replacements
 * - **Render Hooks**: Complete override capability for button content and structure
 * - **Visibility Control**: Individual button show/hide with conditional rendering
 * - **Disabled States**: Proper disabled styling and interaction blocking
 * - **Icon Flexibility**: Support for FontAwesome icons, custom icons, and alternate icons
 * - **HTML Attributes**: Granular control over all button elements (button, icon wrapper, text, content)
 * - **Shared and Individual Props**: Shared defaults with per-button override capability
 * - **Accessibility**: Proper button semantics with customizable ARIA attributes
 *
 * @component
 *
 * @param {ControlButtonsAltComponentOptions} props - Configuration options for ControlButtonsAltComponent
 * @param {AltButton[]} props.buttons - Array of button configurations with individual settings
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
 * @param {(options: {index: number; button: AltButton; defaultButton: React.ReactNode; defaultProps: React.ButtonHTMLAttributes<HTMLButtonElement>; direction: "horizontal" | "vertical"}) => React.ReactNode} [props.renderButton] - Custom render function for entire button
 * @param {(options: {index: number; button: AltButton; defaultIcon: React.ReactNode; defaultLabel: React.ReactNode; defaultContent: React.ReactNode; direction: "horizontal" | "vertical"}) => React.ReactNode} [props.renderButtonContent] - Custom render function for button content
 * @param {number | string} [props.gap] - Spacing between buttons (CSS gap value)
 *
 * @returns {React.ReactNode} The rendered alternative control buttons component
 *
 * @example
 * // Basic usage with vertical layout
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactjs';
 * import { faPlay, faPause, faStop, faMicrophone } from '@fortawesome/free-solid-svg-icons';
 *
 * const BasicAltControls = () => {
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
 *       name: 'Stop',
 *       icon: faStop,
 *       onPress: () => setIsPlaying(false),
 *       show: true
 *     },
 *     {
 *       name: 'Mic',
 *       icon: faMicrophone,
 *       active: !isMuted,
 *       onPress: () => setIsMuted(!isMuted),
 *       activeColor: '#2ecc71',
 *       inActiveColor: '#e74c3c',
 *       show: true
 *     }
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
 *       buttons={buttons}
 *       direction="vertical"
 *       position="right"
 *       location="center"
 *       showAspect={true}
 *       gap={12}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled with branded colors
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactjs';
 * import { faVideo, faMicrophone, faDesktop, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
 *
 * const BrandedAltControls = () => {
 *   const [videoActive, setVideoActive] = useState(true);
 *   const [audioActive, setAudioActive] = useState(true);
 *   const [screenShare, setScreenShare] = useState(false);
 *
 *   const buttons = [
 *     {
 *       name: 'Video',
 *       icon: faVideo,
 *       active: videoActive,
 *       onPress: () => setVideoActive(!videoActive),
 *       backgroundColor: { default: '#1a1a2e' },
 *       activeColor: '#00d4ff',
 *       inActiveColor: '#ff6b6b',
 *       show: true,
 *       buttonProps: { 'aria-label': 'Toggle video' }
 *     },
 *     {
 *       name: 'Audio',
 *       icon: faMicrophone,
 *       active: audioActive,
 *       onPress: () => setAudioActive(!audioActive),
 *       backgroundColor: { default: '#1a1a2e' },
 *       activeColor: '#00d4ff',
 *       inActiveColor: '#ff6b6b',
 *       show: true
 *     },
 *     {
 *       name: 'Share',
 *       icon: faDesktop,
 *       active: screenShare,
 *       onPress: () => setScreenShare(!screenShare),
 *       backgroundColor: { default: '#2ecc71' },
 *       activeColor: '#fff',
 *       show: true,
 *       disabled: screenShare
 *     },
 *     {
 *       name: 'More',
 *       icon: faEllipsisV,
 *       onPress: () => console.log('Show more options'),
 *       backgroundColor: { default: '#34495e' },
 *       show: true
 *     }
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
 *       buttons={buttons}
 *       direction="horizontal"
 *       position="middle"
 *       location="bottom"
 *       showAspect={true}
 *       buttonsContainerStyle={{
 *         padding: '16px',
 *         borderRadius: '12px',
 *         backgroundColor: 'rgba(0,0,0,0.8)'
 *       }}
 *       gap={8}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking with render hooks
 * ```tsx
 * import React, { useState } from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactjs';
 * import { faHand, faMessage, faUserPlus } from '@fortawesome/free-solid-svg-icons';
 *
 * const AnalyticsAltControls = () => {
 *   const [handRaised, setHandRaised] = useState(false);
 *
 *   const trackButtonClick = (buttonName: string, isActive: boolean) => {
 *     analytics.track('Alt Control Button Clicked', {
 *       buttonName,
 *       isActive,
 *       timestamp: new Date()
 *     });
 *   };
 *
 *   const buttons = [
 *     {
 *       name: 'Raise Hand',
 *       icon: faHand,
 *       active: handRaised,
 *       onPress: () => {
 *         const newState = !handRaised;
 *         setHandRaised(newState);
 *         trackButtonClick('Raise Hand', newState);
 *       },
 *       show: true
 *     },
 *     {
 *       name: 'Chat',
 *       icon: faMessage,
 *       onPress: () => trackButtonClick('Chat', false),
 *       show: true
 *     },
 *     {
 *       name: 'Invite',
 *       icon: faUserPlus,
 *       onPress: () => trackButtonClick('Invite', false),
 *       show: true
 *     }
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
 *       buttons={buttons}
 *       direction="vertical"
 *       position="left"
 *       location="center"
 *       showAspect={true}
 *       renderButtonContent={({ defaultContent, button, index }) => {
 *         React.useEffect(() => {
 *           if (button.active) {
 *             analytics.track('Button Active State', {
 *               buttonName: button.name,
 *               index
 *             });
 *           }
 *         }, [button.active]);
 *         return defaultContent;
 *       }}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, ControlButtonsAltComponent } from 'mediasfu-reactjs';
 *
 * const CustomAltControlsComponent = (props) => (
 *   <ControlButtonsAltComponent
 *     {...props}
 *     direction="horizontal"
 *     position="middle"
 *     location="bottom"
 *     renderButton={({ defaultButton, button, index, defaultProps }) => (
 *       <div className="custom-button-wrapper" data-index={index}>
 *         <button
 *           {...defaultProps}
 *           className={`custom-alt-button ${button.active ? 'active' : ''}`}
 *           onClick={() => {
 *             console.log(`Alt button ${button.name} clicked`);
 *             button.onPress?.();
 *           }}
 *         >
 *           <div className="button-icon">{defaultProps.children}</div>
 *           {button.name && (
 *             <span className="button-label">{button.name}</span>
 *           )}
 *         </button>
 *         {button.active && <div className="active-indicator" />}
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
 *         ControlButtonsAltComponent: CustomAltControlsComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 *     />
 *   );
 * }
 * ```
 */
declare const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions>;
export default ControlButtonsAltComponent;
//# sourceMappingURL=ControlButtonsAltComponent.d.ts.map