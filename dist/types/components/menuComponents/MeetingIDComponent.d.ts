import React from "react";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
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
declare const MeetingIdComponent: React.FC<MeetingIdComponentOptions>;
export default MeetingIdComponent;
//# sourceMappingURL=MeetingIDComponent.d.ts.map