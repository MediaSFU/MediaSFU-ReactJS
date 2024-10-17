import React from "react";
export interface MeetingPasscodeComponentOptions {
    meetingPasscode?: string;
}
export type MeetingPasscodeComponentType = (options: MeetingPasscodeComponentOptions) => JSX.Element;
/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component
 * @param {MeetingPasscodeComponentOptions} props - The properties object.
 * @param {string} [props.meetingPasscode=""] - The passcode for the meeting, defaulting to an empty string if not provided.
 * @returns {JSX.Element} A JSX element containing a labeled input field with the meeting passcode.
 */
declare const MeetingPasscodeComponent: React.FC<MeetingPasscodeComponentOptions>;
export default MeetingPasscodeComponent;
//# sourceMappingURL=MeetingPasscodeComponent.d.ts.map