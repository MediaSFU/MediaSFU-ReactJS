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
export type ScreenboardType = (options: ScreenboardOptions) => JSX.Element;
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
 * @returns {JSX.Element} The Screenboard component.
 *
 * @example
 * <Screenboard
 *   parameters={{
 *     updateCanvasScreenboard: (canvas) => { ... },
 *     annotateScreenStream: true,
 *     updateIsScreenboardModalVisible: (visible) => { ... },
 *     showAlert: (alert) => { ... },
 *     sleep: ({ ms }) => { ... },
 *     updateAnnotateScreenStream: (state) => { ... },
 *   }}
 *   showAspect={true}
 * />
 */
declare const Screenboard: React.FC<ScreenboardOptions>;
export default Screenboard;
//# sourceMappingURL=Screenboard.d.ts.map