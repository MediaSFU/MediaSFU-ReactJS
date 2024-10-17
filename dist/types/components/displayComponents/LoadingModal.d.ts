import React from "react";
export interface LoadingModalOptions {
    isVisible: boolean;
    backgroundColor?: string;
    displayColor?: string;
}
export type LoadingModalType = (options: LoadingModalOptions) => JSX.Element;
/**
 * LoadingModal component displays a modal with a loading spinner and text.
 *
 * @component
 * @param {LoadingModalOptions} props - The properties for the LoadingModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {string} [props.backgroundColor='rgba(0, 0, 0, 0.5)'] - The background color of the modal.
 * @param {string} [props.displayColor='black'] - The color of the loading text and spinner.
 *
 * @returns {JSX.Element} The rendered LoadingModal component.
 */
declare const LoadingModal: React.FC<LoadingModalOptions>;
export default LoadingModal;
//# sourceMappingURL=LoadingModal.d.ts.map