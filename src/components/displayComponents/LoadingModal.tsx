import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export interface LoadingModalOptions {
  isVisible: boolean;
  backgroundColor?: string;
  displayColor?: string;
}

export type LoadingModalType = (options: LoadingModalOptions) => React.JSX.Element;

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
 * @returns {React.JSX.Element} The rendered LoadingModal component.
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


const LoadingModal: React.FC<LoadingModalOptions> = ({
  isVisible,
  backgroundColor = "rgba(0, 0, 0, 0.5)",
  displayColor = "black",
}) => {
  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: backgroundColor,
    display: isVisible ? "flex" : "none",
    alignItems: "center", // Vertically center content
    justifyContent: "center", // Horizontally center content
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: 10,
    padding: 10,
    maxWidth: 200, // Adjust as needed
    textAlign: "center",
  };

  const spinnerContainerStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  const loadingTextStyle: React.CSSProperties = {
    color: displayColor,
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={spinnerContainerStyle}>
          {/* Spinner */}
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ fontSize: "50px", color: displayColor }}
          />
        </div>
        <div style={loadingTextStyle}>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingModal;
