import { OverlayPositionStyle } from "../../@types/types";
export interface GetOverlayPositionOptions {
    position: string;
}
export type GetOverlayPositionType = (options: GetOverlayPositionOptions) => OverlayPositionStyle;
/**
 * Gets the style for positioning an overlay based on the specified position.
 *
 * @param {GetOverlayPositionOptions} options - Configuration specifying the overlay position.
 * @returns {OverlayPositionStyle} - The style object for positioning the overlay.
 *
 * @example
 * ```typescript
 * const topLeftStyle = getOverlayPosition({ position: "topLeft" });
 * console.log(topLeftStyle);
 * // Output: { top: 0, left: 0 }
 *
 * const bottomRightStyle = getOverlayPosition({ position: "bottomRight" });
 * console.log(bottomRightStyle);
 * // Output: { bottom: 0, right: 0 }
 * ```
 */
export declare const getOverlayPosition: ({ position }: GetOverlayPositionOptions) => OverlayPositionStyle;
//# sourceMappingURL=getOverlayPosition.d.ts.map