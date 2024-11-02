import React from "react";
export interface MeetingIdComponentOptions {
    meetingID?: string;
}
export type MeetingIdComponentType = (options: MeetingIdComponentOptions) => JSX.Element;
/**
 * A React functional component that displays a meeting passcode in a read-only input field.
 *
 * @component MeetingIdComponent
 * @param {MeetingIdComponentOptions} props - The properties object.
 * @param {string} [props.meetingID=""] - The meeting ID to display.
 * @returns {JSX.Element} The rendered MeetingIdComponent component.
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