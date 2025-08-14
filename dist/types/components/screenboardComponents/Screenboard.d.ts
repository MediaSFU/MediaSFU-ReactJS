import React from "react";
import "./Screenboard.css";
import { ShowAlert, SleepType } from "../../@types/types";
export interface ScreenboardParameters {
    updateCanvasScreenboard: (canvas: HTMLCanvasElement | null) => void;
    annotateScreenStream: boolean;
    updateIsScreenboardModalVisible: (visible: boolean) => void;
    showAlert?: ShowAlert;
    sleep: SleepType;
    updateAnnotateScreenStream: (annotate: boolean) => void;
    [key: string]: any;
}
export interface ScreenboardOptions {
    customWidth: number;
    customHeight: number;
    parameters: ScreenboardParameters;
    showAspect: boolean;
}
export type ScreenboardType = (options: ScreenboardOptions) => React.JSX.Element;
/**
 * Screenboard component provides a canvas for drawing, freehand drawing, erasing, and shape drawing.
 * It includes a toolbar for selecting drawing modes, colors, and line types.
 *
 * @component
 * @param {ScreenboardOptions} props - The properties for the Screenboard component.
 * @param {Object} props.parameters - The parameters for the Screenboard component.
 * @param {Function} props.parameters.updateCanvasScreenboard - Function to update the canvas screenboard.
 * @param {boolean} props.parameters.annotateScreenStream - Boolean indicating if screen annotation is enabled.
 * @param {Function} props.parameters.updateIsScreenboardModalVisible - Function to update the visibility of the screenboard modal.
 * @param {Function} props.parameters.showAlert - Function to show an alert message.
 * @param {Function} props.parameters.sleep - Function to pause execution for a specified duration.
 * @param {Function} props.parameters.updateAnnotateScreenStream - Function to update the screen annotation state.
 * @param {boolean} props.showAspect - Boolean indicating if the aspect ratio should be shown.
 *
 * @returns {React.JSX.Element} The Screenboard component.
 *
 * @example
 * ```tsx
 * import { Screenboard } from 'mediasfu-reactjs';
 *
 * // Define the parameters and functionality for the screenboard
 * const parameters = {
 *   updateCanvasScreenboard: (canvas) => console.log("Canvas updated:", canvas),
 *   annotateScreenStream: true,
 *   updateIsScreenboardModalVisible: (visible) => console.log("Modal visibility:", visible),
 *   showAlert: (alertMessage) => console.log("Alert:", alertMessage),
 *   sleep: ({ ms }) => new Promise((resolve) => setTimeout(resolve, ms)),
 *   updateAnnotateScreenStream: (state) => console.log("Annotation state:", state),
 * };
 *
 * // Render the Screenboard component
 * <Screenboard
 *   customWidth={800}
 *   customHeight={600}
 *   parameters={parameters}
 *   showAspect={true}
 * />
 * ```
 */
declare const Screenboard: React.FC<ScreenboardOptions>;
export default Screenboard;
//# sourceMappingURL=Screenboard.d.ts.map