import React from "react";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

// Define the prop type using an interface
export interface MeetingPasscodeComponentOptions {
  meetingPasscode?: string;
  labelText?: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    meetingPasscode: string;
  }) => React.ReactNode;
  renderLabel?: (options: {
    defaultLabel: React.ReactNode;
    meetingPasscode: string;
  }) => React.ReactNode;
  renderInput?: (options: {
    defaultInput: React.ReactNode;
    meetingPasscode: string;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    meetingPasscode: string;
  }) => React.ReactNode;
}

export type MeetingPasscodeComponentType = (
  options: MeetingPasscodeComponentOptions
) => React.JSX.Element;

/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component
 * @param {MeetingIdComponentOptions} props - The properties object.
 * @param {string} [props.meetingID=""] - The meeting ID to display.
 * @returns {React.JSX.Element} The rendered MeetingIdComponent component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { MeetingIdComponent } from 'mediasfu-reactjs';
 * 
 * const App = () => (
 *   <MeetingIdComponent meetingID="1234567890" />
 * );
 * 
 * export default App;
 * 
 * @example
 * import React from 'react';
 * import { MeetingIdComponent } from 'mediasfu-reactjs';
 * 
 * const App = () => (
 *   <MeetingIdComponent />
 * );
 * 
 * export default App;
 * ```
 */


const MeetingPasscodeComponent: React.FC<MeetingPasscodeComponentOptions> = ({
  meetingPasscode = "",
  labelText,
  containerProps,
  labelProps,
  inputProps,
  renderContainer,
  renderLabel,
  renderInput,
  renderContent,
}) => {
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
    className: inputClassName,
    style: inputStyleOverrides,
    value: inputValueOverride,
    readOnly: inputReadOnlyOverride,
    ...restInputProps
  } = inputProps ?? {};

  const labelNodeDefault = (
    <label
      className={joinClassNames(undefined, labelClassName)}
      style={{
        ...styles.label,
        ...labelStyleOverrides,
      }}
      {...restLabelProps}
    >
      {labelChildren ?? labelText ?? "Event Passcode (Host):"}
    </label>
  );

  const labelNode = renderLabel
    ? renderLabel({ defaultLabel: labelNodeDefault, meetingPasscode })
    : labelNodeDefault;

  const inputNodeDefault = (
    <input
      className={joinClassNames(undefined, inputClassName)}
      style={{
        ...styles.disabledInput,
        ...inputStyleOverrides,
      }}
      value={inputValueOverride ?? meetingPasscode}
      readOnly={inputReadOnlyOverride ?? true}
      {...restInputProps}
    />
  );

  const inputNode = renderInput
    ? renderInput({ defaultInput: inputNodeDefault, meetingPasscode })
    : inputNodeDefault;

  const contentDefault = (
    <>
      {labelNode}
      {inputNode}
    </>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent: contentDefault, meetingPasscode })
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
    ? renderContainer({ defaultContainer: containerNode, meetingPasscode })
    : containerNode;
};

const styles = {
  formGroup: {
    marginTop: "10px",
    maxWidth: "300px",
  },
  label: {
    fontWeight: "bold",
  },
  disabledInput: {
    borderWidth: "1px",
    borderColor: "gray",
    padding: "10px",
    marginTop: "5px",
    backgroundColor: "#f0f0f0",
    color: "black",
    width: "100%",
    borderRadius: "5px",
  },
};

export default MeetingPasscodeComponent;
