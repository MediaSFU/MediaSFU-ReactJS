import React from "react";
export interface OtherGridComponentOptions {
    backgroundColor: string;
    children: React.ReactNode;
    width: number;
    height: number;
    showAspect?: boolean;
    timeBackgroundColor?: string;
    showTimer: boolean;
    meetingProgressTime: string;
}
export type OtherGridComponentType = React.FC<OtherGridComponentOptions>;
/**
 * A React functional component that displays a grid with optional timer and children components.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.backgroundColor - The background color of the grid.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the grid.
 * @param {string | number} props.width - The width of the grid.
 * @param {string | number} props.height - The height of the grid.
 * @param {boolean} [props.showAspect=true] - Flag to determine if the grid should be displayed.
 * @param {string} props.timeBackgroundColor - The background color of the timer.
 * @param {boolean} props.showTimer - Flag to determine if the timer should be displayed.
 * @param {string} props.meetingProgressTime - The time to display on the timer.
 * @returns {JSX.Element} The rendered grid component.
 */
declare const OtherGridComponent: React.FC<OtherGridComponentOptions>;
export default OtherGridComponent;
//# sourceMappingURL=OtherGridComponent.d.ts.map