import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, IconDefinition } from "@fortawesome/free-solid-svg-icons"; // Example icon import
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import "./CustomButtons.css"; // Import CSS file for styling

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

// Define the type for each button object in the array
export interface CustomButton {
  action?: () => void | Promise<void>;
  show: boolean;
  backgroundColor?: string;
  disabled?: boolean;
  icon?: IconDefinition; // FontAwesome icons are typed as IconDefinition
  iconStyle?: React.CSSProperties;
  text?: string;
  textStyle?: React.CSSProperties;
  /** More descriptive tooltip text shown on hover (defaults to text if not provided) */
  tooltip?: string;
  customComponent?: React.ReactNode;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  iconProps?: Partial<FontAwesomeIconProps>;
  /**
   * When set to false, the wrapper renders as a non-button element so interactive custom components
   * (for example, components that render their own buttons) are not nested inside a native button.
   */
  renderAsButton?: boolean;
}

// Define the prop type using an interface
export interface CustomButtonsOptions {
  buttons: CustomButton[];
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  fallbackSpinner?: React.ReactNode;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    buttons: CustomButton[];
  }) => React.ReactNode;
  renderButtons?: (options: {
    defaultButtons: React.ReactNode[];
    buttons: CustomButton[];
  }) => React.ReactNode;
  renderButton?: (options: {
    defaultButton: React.ReactNode;
    button: CustomButton;
    index: number;
    isVisible: boolean;
  }) => React.ReactNode;
}

export type CustomButtonsType = (options: CustomButtonsOptions) => React.JSX.Element;

/**
 * CustomButtons component renders a list of customizable buttons.
 *
 * @component
 * @param {CustomButtonsOptions} props - The properties for the CustomButtons component.
 * @param {Array} props.buttons - An array of button configurations.
 * @param {Function} props.buttons[].action - The function to be called when the button is clicked.
 * @param {boolean} props.buttons[].show - Determines if the button should be displayed.
 * @param {string} props.buttons[].backgroundColor - The background color of the button.
 * @param {boolean} props.buttons[].disabled - Determines if the button should be disabled.
 * @param {IconDefinition} [props.buttons[].icon] - The icon to be displayed on the button.
 * @param {Object} [props.buttons[].iconStyle] - The style to be applied to the icon.
 * @param {string} [props.buttons[].text] - The text to be displayed on the button.
 * @param {Object} [props.buttons[].textStyle] - The style to be applied to the text.
 * @param {React.ReactNode} [props.buttons[].customComponent] - A custom component to be rendered inside the button.
 *
 * @returns {React.JSX.Element} The rendered CustomButtons component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { CustomButtons } from 'mediasfu-reactjs';
 * import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
 * 
 * const buttons = [
 *   {
 *     action: () => console.log("Save clicked"),
 *     show: true,
 *     backgroundColor: "green",
 *     disabled: false,
 *     icon: faCheck,
 *     iconStyle: { color: "white" },
 *     text: "Save",
 *     textStyle: { color: "white", fontSize: "16px" },
 *   },
 *   {
 *     action: () => console.log("Loading..."),
 *     show: true,
 *     backgroundColor: "gray",
 *     disabled: true,
 *     icon: faSpinner,
 *     iconStyle: { color: "lightgray" },
 *     text: "Loading",
 *     textStyle: { color: "lightgray", fontSize: "16px" },
 *     customComponent: <CustomSpinner />, // Example custom component
 *   },
 * ];
 * 
 * const App = () => (
 *   <CustomButtons buttons={buttons} />
 * );
 * 
 * export default App;
 * ```
 */


const CustomButtons: React.FC<CustomButtonsOptions> = ({
  buttons,
  containerProps,
  fallbackSpinner,
  renderContainer,
  renderButtons,
  renderButton,
}) => {
  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const defaultSpinner =
    fallbackSpinner ?? <FontAwesomeIcon icon={faSpinner} spin />;

  const buttonNodes = buttons.map((button, index) => {
    const {
      buttonProps,
      contentProps,
      iconProps,
      icon,
      customComponent,
      renderAsButton = true,
    } = button;

    const {
      className: buttonClassName,
      style: buttonStyleOverrides,
      onClick: buttonOnClick,
      onKeyDown: buttonOnKeyDown,
      type: buttonType,
      disabled: buttonPropsDisabled,
      tabIndex: buttonTabIndex,
      role: buttonRole,
      ...restButtonProps
    } = buttonProps ?? {};

    const isVisible = button.show ?? true;
    const isDisabled =
      button.disabled ?? buttonPropsDisabled ?? false;

    const {
      className: contentClassName,
      style: contentStyleOverrides,
      ...restContentProps
    } = contentProps ?? {};

    const {
      className: iconClassName,
      style: iconStyleOverrides,
      icon: iconOverride,
      ...restIconProps
    } = iconProps ?? {};

    const resolvedIcon =
      (iconOverride as IconDefinition | undefined) ?? icon;

    const buttonContent = (
      <div
        className={joinClassNames("buttonContent", contentClassName)}
        style={{ ...contentStyleOverrides }}
        {...restContentProps}
      >
        {resolvedIcon ? (
          <>
            <FontAwesomeIcon
              icon={resolvedIcon}
              className={joinClassNames(undefined, iconClassName)}
              style={{
                ...styles.customButtonIcon,
                ...button.iconStyle,
                ...iconStyleOverrides,
              }}
              {...restIconProps}
            />
            {button.text && (
              <span className="customButtonText" style={button.textStyle}>
                {button.text}
              </span>
            )}
          </>
        ) : customComponent ? (
          customComponent
        ) : (
          defaultSpinner
        )}
      </div>
    );

    const baseClassName = joinClassNames("customButton", buttonClassName);
    const baseStyle: React.CSSProperties = {
      backgroundColor: isVisible
        ? button.backgroundColor ?? "transparent"
        : "transparent",
      display: isVisible ? "flex" : "none",
      ...buttonStyleOverrides,
    };

    const handleButtonClick = async (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      await Promise.resolve(buttonOnClick?.(event));
      if (!event.defaultPrevented) {
        await Promise.resolve(button.action?.());
      }
    };

    const handleContainerClick = async (
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      if (buttonOnClick) {
        await Promise.resolve(
          (
            buttonOnClick as unknown as React.MouseEventHandler<HTMLDivElement>
          )(event)
        );
      }

      if (event.defaultPrevented || isDisabled) {
        return;
      }

      if (event.currentTarget !== event.target) {
        return;
      }

      if (button.action) {
        await Promise.resolve(button.action());
      }
    };

    const handleContainerKeyDown = async (
      event: React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (buttonOnKeyDown) {
        (
          buttonOnKeyDown as unknown as React.KeyboardEventHandler<HTMLDivElement>
        )(event);
      }

      if (event.defaultPrevented || isDisabled) {
        return;
      }

      if ((event.key === "Enter" || event.key === " ") && button.action) {
        event.preventDefault();
        await Promise.resolve(button.action());
      }
    };

    const defaultButton = renderAsButton ? (
      <button
        type={buttonType ?? "button"}
        onClick={handleButtonClick}
        onKeyDown={buttonOnKeyDown}
        tabIndex={buttonTabIndex}
        role={buttonRole}
        className={baseClassName}
        style={baseStyle}
        disabled={isDisabled}
        {...restButtonProps}
      >
        {buttonContent}
      </button>
    ) : (
      <div
        className={baseClassName}
        style={baseStyle}
        aria-disabled={isDisabled || undefined}
        role={buttonRole ?? (button.action ? "button" : undefined)}
        tabIndex={
          buttonTabIndex ?? (button.action ? 0 : undefined)
        }
        onClick={
          button.action || buttonOnClick
            ? handleContainerClick
            : undefined
        }
        onKeyDown={
          button.action || buttonOnKeyDown ? handleContainerKeyDown : undefined
        }
        {...(restButtonProps as unknown as React.HTMLAttributes<HTMLDivElement>)}
      >
        {buttonContent}
      </div>
    );

    const renderedButton = renderButton
      ? renderButton({
          defaultButton,
          button,
          index,
          isVisible,
        })
      : defaultButton;

    return <React.Fragment key={index}>{renderedButton}</React.Fragment>;
  });

  const buttonsContent = renderButtons
    ? renderButtons({ defaultButtons: buttonNodes, buttons })
    : buttonNodes;

  const containerNode = (
    <div
      className={joinClassNames(
        "mediasfu-customButtonsContainer",
        containerClassName
      )}
      style={{ ...containerStyleOverrides }}
      {...restContainerProps}
    >
      {buttonsContent}
    </div>
  );

  return renderContainer
    ? renderContainer({ defaultContainer: containerNode, buttons })
    : containerNode;
};

const styles = {
  customButtonIcon: {
    fontSize: 20,
    marginRight: 5,
  },
};

export default CustomButtons;
