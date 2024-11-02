import React from "react";
export interface LoadingModalOptions {
    isVisible: boolean;
    backgroundColor?: string;
    displayColor?: string;
}
export type LoadingModalType = (options: LoadingModalOptions) => JSX.Element;
/**
 * LoadingModal component displays a full-screen modal with a loading spinner and customizable text color.
 *
 * This component is used to indicate a loading state, overlaying the entire screen with a semi-transparent background and a centered loading spinner.
 *
 * @component
 * @param {LoadingModalOptions} props - The properties for the LoadingModal component.
 * @param {boolean} props.isVisible - Controls the visibility of the loading modal.
 * @param {string} [props.backgroundColor='rgba(0, 0, 0, 0.5)'] - Background color of the modal overlay.
 * @param {string} [props.displayColor='black'] - Color of the loading text and spinner.
 *
 * @returns {JSX.Element} The rendered LoadingModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { LoadingModal } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <div>
 *       <LoadingModal isVisible={true} backgroundColor="rgba(255, 255, 255, 0.5)" displayColor="blue" />
 *     </div>
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const LoadingModal: React.FC<LoadingModalOptions>;
export default LoadingModal;
//# sourceMappingURL=LoadingModal.d.ts.map