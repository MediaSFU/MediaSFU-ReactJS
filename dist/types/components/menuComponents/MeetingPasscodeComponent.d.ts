import React from "react";
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
export type MeetingPasscodeComponentType = (options: MeetingPasscodeComponentOptions) => React.JSX.Element;
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
declare const MeetingPasscodeComponent: React.FC<MeetingPasscodeComponentOptions>;
export default MeetingPasscodeComponent;
//# sourceMappingURL=MeetingPasscodeComponent.d.ts.map