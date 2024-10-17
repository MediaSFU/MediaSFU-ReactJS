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
 * AlertComponent is a React functional component that displays an alert message.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.visible - Determines if the alert is visible.
 * @param {string} props.message - The message to display in the alert.
 * @param {'success' | 'danger'} [props.type='success'] - The type of alert, which determines the background color.
 * @param {number} [props.duration=4000] - The duration in milliseconds for which the alert is visible.
 * @param {function} [props.onHide] - Callback function to be called when the alert is hidden.
 * @param {string} [props.textColor='black'] - The color of the alert text.
 *
 * @example
 * <AlertComponent
 *   visible={true}
 *   message="This is a success alert!"
 *   type="success"
 *   duration={3000}
 *   onHide={() => console.log('Alert hidden')}
 *   textColor="white"
 * />
 */
declare const AlertComponent: React.FC<AlertComponentOptions>;
export default AlertComponent;
//# sourceMappingURL=AlertComponent.d.ts.map