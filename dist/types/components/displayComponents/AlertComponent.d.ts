import React from 'react';
export interface AlertComponentOptions {
    visible: boolean;
    message: string;
    type: 'success' | 'danger';
    duration?: number;
    onHide?: () => void;
    textColor?: string;
}
export type AlertComponentType = (options: AlertComponentOptions) => JSX.Element;
/**
 * AlertComponent is a React functional component that displays an alert message with customizable options.
 *
 * This component displays an alert with a specified message, type (success or danger), and duration. It automatically hides after the specified duration, or when clicked. The alert can also trigger an optional `onHide` callback when it is hidden.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.visible - Controls the visibility of the alert.
 * @param {string} props.message - The message displayed within the alert.
 * @param {'success' | 'danger'} [props.type='success'] - The type of alert, which determines the background color: 'success' for green and 'danger' for red.
 * @param {number} [props.duration=4000] - The duration (in milliseconds) for which the alert is visible before it hides automatically.
 * @param {() => void} [props.onHide] - Optional callback function that triggers when the alert is hidden.
 * @param {string} [props.textColor='black'] - Text color for the alert message.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AlertComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const [isAlertVisible, setIsAlertVisible] = useState(true);
 *
 *   const hideAlert = () => {
 *     console.log('Alert hidden');
 *     setIsAlertVisible(false);
 *   };
 *
 *   return (
 *     <AlertComponent
 *       visible={isAlertVisible}
 *       message="This is a success alert!"
 *       type="success"
 *       duration={3000}
 *       onHide={hideAlert}
 *       textColor="white"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const AlertComponent: React.FC<AlertComponentOptions>;
export default AlertComponent;
//# sourceMappingURL=AlertComponent.d.ts.map