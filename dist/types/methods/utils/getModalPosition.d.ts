/**
 * Defines the style object for positioning the modal.
 */
import { ModalPositionStyle } from "../../@types/types";
export interface GetModalPositionOptions {
    position: string;
}
export type GetModalPositionType = (options: GetModalPositionOptions) => ModalPositionStyle;
/**
 * Gets the style for positioning a modal based on the specified position.
 * @function
 * @param {string} position - The desired position for the modal ('center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @returns {ModalPositionStyle} - The style object for positioning the modal.
 */
export declare const getModalPosition: ({ position }: GetModalPositionOptions) => ModalPositionStyle;
//# sourceMappingURL=getModalPosition.d.ts.map