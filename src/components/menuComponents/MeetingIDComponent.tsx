import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

// Define the prop type using an interface
export interface MeetingIdComponentOptions {
  meetingID?: string;
  labelText?: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  iconProps?: Partial<FontAwesomeIconProps>;
  copyIconColors?: {
    default?: string;
    copied?: string;
  };
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderLabel?: (options: {
    defaultLabel: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderInput?: (options: {
    defaultInput: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderCopyButton?: (options: {
    defaultButton: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderIcon?: (options: {
    defaultIcon: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderInputGroup?: (options: {
    defaultGroup: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    isCopied: boolean;
    meetingID: string;
  }) => React.ReactNode;
}

export type MeetingIdComponentType = (options: MeetingIdComponentOptions) => React.JSX.Element;

/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component MeetingIdComponent
 * @param {MeetingIdComponentOptions} props - The properties object.
 * @param {string} [props.meetingID=""] - The meeting ID to display.
 * @returns {React.JSX.Element} The rendered MeetingIdComponent component.
 * 
 * @example
 * ```tsx
 * <MeetingIdComponent meetingID="1234567890" />
 * 
 * @example
 * <MeetingIdComponent />
 * ```
 * 
 */
const MeetingIdComponent: React.FC<MeetingIdComponentOptions> = ({
  meetingID = "",
  labelText,
  containerProps,
  labelProps,
  inputContainerProps,
  inputProps,
  buttonProps,
  iconProps,
  copyIconColors,
  renderContainer,
  renderLabel,
  renderInput,
  renderCopyButton,
  renderIcon,
  renderInputGroup,
  renderContent,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy-to-clipboard functionality and triggers temporary color change.
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(meetingID);
      setIsCopied(true); // Set the copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Revert back after 2 seconds
    } catch {
      // do nothing
    }
  }, [meetingID]);

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const {
    className: labelClassName,
    style: labelStyleOverrides,
    children: labelChildren,
    ...restLabelProps
  } = labelProps ?? {};

  const {
    className: inputContainerClassName,
    style: inputContainerStyleOverrides,
    ...restInputContainerProps
  } = inputContainerProps ?? {};

  const {
    className: inputClassName,
    style: inputStyleOverrides,
    value: inputValueOverride,
    readOnly: inputReadOnlyOverride,
    ...restInputProps
  } = inputProps ?? {};

  const {
    className: buttonClassName,
    style: buttonStyleOverrides,
    onClick: buttonOnClick,
    type: buttonType,
    ...restButtonProps
  } = buttonProps ?? {};

  const {
    className: iconClassName,
    style: iconStyleOverrides,
    icon: iconOverride,
    ...restIconProps
  } = iconProps ?? {};

  const iconNodeDefault = (
    <FontAwesomeIcon
      icon={(iconOverride as FontAwesomeIconProps["icon"]) ?? faCopy}
      className={joinClassNames(undefined, iconClassName)}
      style={{
        ...styles.copyIcon,
        ...iconStyleOverrides,
        color:
          iconStyleOverrides?.color ??
          (isCopied
            ? copyIconColors?.copied ?? "#4CAF50"
            : copyIconColors?.default ?? "#0F0F10FF"),
      }}
      {...restIconProps}
    />
  );

  const iconNode = renderIcon
    ? renderIcon({ defaultIcon: iconNodeDefault, isCopied, meetingID })
    : iconNodeDefault;

  const buttonNodeDefault = (
    <button
      type={buttonType ?? "button"}
      onClick={async (event) => {
        await Promise.resolve(buttonOnClick?.(event));
        if (!event.defaultPrevented) {
          await handleCopy();
        }
      }}
      className={joinClassNames(undefined, buttonClassName)}
      style={{
        ...styles.copyButton,
        ...buttonStyleOverrides,
      }}
      aria-label={restButtonProps["aria-label"] ?? "Copy Event ID"}
      {...restButtonProps}
    >
      {iconNode}
    </button>
  );

  const buttonNode = renderCopyButton
    ? renderCopyButton({
        defaultButton: buttonNodeDefault,
        isCopied,
        meetingID,
      })
    : buttonNodeDefault;

  const inputNodeDefault = (
    <input
      className={joinClassNames(undefined, inputClassName)}
      style={{
        ...styles.disabledInput,
        ...inputStyleOverrides,
      }}
      value={inputValueOverride ?? meetingID}
      readOnly={inputReadOnlyOverride ?? true}
      aria-label="Event ID"
      {...restInputProps}
    />
  );

  const inputNode = renderInput
    ? renderInput({ defaultInput: inputNodeDefault, isCopied, meetingID })
    : inputNodeDefault;

  const inputGroupDefault = (
    <div
      className={joinClassNames(undefined, inputContainerClassName)}
      style={{
        ...styles.inputContainer,
        ...inputContainerStyleOverrides,
      }}
      {...restInputContainerProps}
    >
      {inputNode}
      {buttonNode}
    </div>
  );

  const inputGroupNode = renderInputGroup
    ? renderInputGroup({
        defaultGroup: inputGroupDefault,
        isCopied,
        meetingID,
      })
    : inputGroupDefault;

  const labelNodeDefault = (
    <label
      className={joinClassNames(undefined, labelClassName)}
      style={{
        ...styles.label,
        ...labelStyleOverrides,
      }}
      {...restLabelProps}
    >
      {labelChildren ?? labelText ?? "Event ID:"}
    </label>
  );

  const labelNode = renderLabel
    ? renderLabel({ defaultLabel: labelNodeDefault, isCopied, meetingID })
    : labelNodeDefault;

  const contentDefault = (
    <>
      {labelNode}
      {inputGroupNode}
    </>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent: contentDefault, isCopied, meetingID })
    : contentDefault;

  const containerNode = (
    <div
      className={joinClassNames(undefined, containerClassName)}
      style={{
        ...styles.formGroup,
        ...containerStyleOverrides,
      }}
      {...restContainerProps}
    >
      {contentNode}
    </div>
  );

  return renderContainer
    ? renderContainer({
        defaultContainer: containerNode,
        isCopied,
        meetingID,
      })
    : containerNode;
};

const styles = {
  formGroup: {
    marginTop: "10px",
    maxWidth: "300px",
    width: "100%",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#000000",
    marginBottom: "5px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  disabledInput: {
    flex: 1,
    border: "1px solid gray",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    color: "black",
    borderRadius: "5px",
    fontSize: "16px",
    marginRight: "5px",
  },
  copyButton: {
    padding: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  copyIcon: {
    fontSize: "20px",
    color: "#0F0F10FF", // Default blue color for the copy icon
  },
};

export default MeetingIdComponent;
