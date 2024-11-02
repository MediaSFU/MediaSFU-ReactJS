import { ModalPositionStyle } from "../../@types/types";
export interface GetModalPositionOptions {
    position: string;
}
export type GetModalPositionType = (options: GetModalPositionOptions) => ModalPositionStyle;
/**
 * Gets the style for positioning a modal based on the specified position.
 *
 * @param {GetModalPositionOptions} options - Configuration options specifying the modal position.
 * @returns {ModalPositionStyle} - The style object for positioning the modal.
 *
 * @example
 * ```typescript
 * const centerStyle = getModalPosition({ position: "center" });
 * console.log(centerStyle);
 * // Output: { justifyContent: "center", alignItems: "center" }
 *
 * const topLeftStyle = getModalPosition({ position: "topLeft" });
 * console.log(topLeftStyle);
 * // Output: { justifyContent: "flex-start", alignItems: "flex-start" }
 * ```
 */
export declare const getModalPosition: ({ position }: GetModalPositionOptions) => ModalPositionStyle;
//# sourceMappingURL=getModalPosition.d.ts.map