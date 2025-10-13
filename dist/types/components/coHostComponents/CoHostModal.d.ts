import React from 'react';
import './CoHostModal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CoHostResponsibility, Participant, ModifyCoHostSettingsOptions, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';
export interface CoHostModalOptions {
    isCoHostModalVisible: boolean;
    currentCohost?: string;
    participants: Participant[];
    coHostResponsibility: CoHostResponsibility[];
    position?: string;
    backgroundColor?: string;
    roomName: string;
    showAlert?: ShowAlert;
    updateCoHostResponsibility: (coHostResponsibility: CoHostResponsibility[]) => void;
    updateCoHost: (coHost: string) => void;
    updateIsCoHostModalVisible: (isCoHostModalVisible: boolean) => void;
    socket: Socket;
    onCoHostClose: () => void;
    onModifyEventSettings?: (settings: ModifyCoHostSettingsOptions) => void;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLDivElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    currentCoHostFieldProps?: React.HTMLAttributes<HTMLDivElement>;
    currentCoHostLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    currentCoHostInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    selectCoHostFieldProps?: React.HTMLAttributes<HTMLDivElement>;
    selectCoHostLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    selectCoHostSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
    responsibilitiesWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilitiesHeaderRowProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilityHeaderLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    responsibilitySelectHeaderProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    responsibilityDedicatedHeaderProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    responsibilityRowProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilityNameProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilitySelectProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilityDedicatedProps?: React.HTMLAttributes<HTMLDivElement>;
    responsibilitySelectCheckboxProps?: React.InputHTMLAttributes<HTMLInputElement>;
    responsibilityDedicatedCheckboxProps?: React.InputHTMLAttributes<HTMLInputElement>;
    footerProps?: React.HTMLAttributes<HTMLDivElement>;
    saveButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    currentCoHostLabel?: React.ReactNode;
    selectCoHostLabel?: React.ReactNode;
    responsibilityHeaderLabel?: React.ReactNode;
    responsibilitySelectLabel?: React.ReactNode;
    responsibilityDedicatedLabel?: React.ReactNode;
    saveButtonLabel?: React.ReactNode;
    responsibilityItems?: {
        name: string;
        label: React.ReactNode;
    }[];
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderResponsibilities?: (options: {
        defaultResponsibilities: React.ReactNode;
        items: {
            name: string;
            label: React.ReactNode;
        }[];
        responsibilities: Record<string, boolean>;
        toggleSelect: (name: string) => void;
        toggleDedicated: (name: string) => void;
    }) => React.ReactNode;
    renderResponsibilityRow?: (options: {
        defaultRow: React.ReactNode;
        item: {
            name: string;
            label: React.ReactNode;
        };
        index: number;
        isSelected: boolean;
        isDedicated: boolean;
        toggleSelect: () => void;
        toggleDedicated: () => void;
    }) => React.ReactNode;
    renderFooter?: (options: {
        defaultFooter: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type CoHostModalType = (options: CoHostModalOptions) => React.JSX.Element;
/**
 * CoHostModal - Manage co-host selection and responsibility assignment
 *
 * A comprehensive modal for hosts to designate co-hosts and configure their permissions.
 * Provides granular control over responsibilities like managing participants, media controls,
 * recording, and other meeting functions. Perfect for distributing meeting management duties
 * and ensuring smooth event facilitation.
 *
 * Features:
 * - Select co-host from participant list
 * - Granular responsibility assignment (manage participants, media, settings, etc.)
 * - "Select" vs "Dedicated" permission levels
 * - Current co-host display
 * - Real-time socket synchronization
 * - Customizable responsibility items
 * - Extensive HTML attributes customization
 * - Custom render hooks for sections
 * - Responsive positioning
 *
 * @component
 * @param {CoHostModalOptions} options - Configuration options
 * @param {boolean} options.isCoHostModalVisible - Modal visibility state
 * @param {string} [options.currentCohost='No coHost'] - Current co-host name
 * @param {Participant[]} options.participants - Available participants list
 * @param {CoHostResponsibility[]} options.coHostResponsibility - Responsibility configurations
 * @param {string} [options.position="topRight"] - Modal screen position
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {string} options.roomName - Meeting/room identifier
 * @param {ShowAlert} [options.showAlert] - Alert display function
 * @param {Function} options.updateCoHostResponsibility - Update responsibilities array
 * @param {Function} options.updateCoHost - Update co-host selection
 * @param {Function} options.updateIsCoHostModalVisible - Update modal visibility
 * @param {Socket} options.socket - Socket.io client instance
 * @param {Function} options.onCoHostClose - Callback when modal is closed
 * @param {Function} [options.onModifyEventSettings] - Settings modification handler
 * @param {React.ReactNode} [options.title] - Custom modal title
 * @param {object} [options.overlayProps] - HTML attributes for overlay
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header
 * @param {object} [options.titleProps] - HTML attributes for title
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.headerDividerProps] - HTML attributes for header divider
 * @param {object} [options.bodyProps] - HTML attributes for body
 * @param {object} [options.currentCoHostFieldProps] - HTML attributes for current co-host field
 * @param {object} [options.currentCoHostLabelProps] - HTML attributes for current co-host label
 * @param {object} [options.currentCoHostInputProps] - HTML attributes for current co-host input
 * @param {object} [options.selectCoHostFieldProps] - HTML attributes for select field
 * @param {object} [options.selectCoHostLabelProps] - HTML attributes for select label
 * @param {object} [options.selectCoHostSelectProps] - HTML attributes for select dropdown
 * @param {object} [options.responsibilitiesWrapperProps] - HTML attributes for responsibilities wrapper
 * @param {object} [options.responsibilitiesHeaderRowProps] - HTML attributes for header row
 * @param {object} [options.responsibilityHeaderLabelProps] - HTML attributes for responsibility header
 * @param {object} [options.responsibilitySelectHeaderProps] - HTML attributes for select header
 * @param {object} [options.responsibilityDedicatedHeaderProps] - HTML attributes for dedicated header
 * @param {object} [options.responsibilityRowProps] - HTML attributes for responsibility rows
 * @param {object} [options.responsibilityNameProps] - HTML attributes for responsibility names
 * @param {object} [options.responsibilitySelectProps] - HTML attributes for select checkboxes
 * @param {object} [options.responsibilityDedicatedProps] - HTML attributes for dedicated checkboxes
 * @param {object} [options.responsibilitySelectCheckboxProps] - HTML attributes for select checkbox inputs
 * @param {object} [options.responsibilityDedicatedCheckboxProps] - HTML attributes for dedicated checkbox inputs
 * @param {object} [options.footerProps] - HTML attributes for footer
 * @param {object} [options.saveButtonProps] - HTML attributes for save button
 * @param {React.ReactNode} [options.currentCoHostLabel] - Custom current co-host label
 * @param {React.ReactNode} [options.selectCoHostLabel] - Custom select co-host label
 * @param {React.ReactNode} [options.responsibilityHeaderLabel] - Custom responsibility header label
 * @param {React.ReactNode} [options.responsibilitySelectLabel] - Custom select column label
 * @param {React.ReactNode} [options.responsibilityDedicatedLabel] - Custom dedicated column label
 * @param {React.ReactNode} [options.saveButtonLabel] - Custom save button label
 * @param {Array} [options.responsibilityItems] - Custom responsibility items array
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderResponsibilities] - Custom responsibilities renderer
 * @param {Function} [options.renderResponsibilityRow] - Custom responsibility row renderer
 * @param {Function} [options.renderFooter] - Custom footer renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered co-host management modal
 *
 * @example
 * // Basic co-host management
 * ```tsx
 * import React, { useState } from 'react';
 * import { CoHostModal } from 'mediasfu-reactjs';
 *
 * function CoHostManagement({ socket, roomName, participants, showAlert }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [currentCohost, setCurrentCohost] = useState('No coHost');
 *   const [coHostResponsibility, setCoHostResponsibility] = useState([
 *     { name: 'manageParticipants', value: false, dedicated: false },
 *     { name: 'manageMedia', value: false, dedicated: false },
 *   ]);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Manage Co-Host
 *       </button>
 *       <CoHostModal
 *         isCoHostModalVisible={isVisible}
 *         onCoHostClose={() => setIsVisible(false)}
 *         currentCohost={currentCohost}
 *         participants={participants}
 *         coHostResponsibility={coHostResponsibility}
 *         updateCoHostResponsibility={setCoHostResponsibility}
 *         updateCoHost={setCurrentCohost}
 *         updateIsCoHostModalVisible={setIsVisible}
 *         roomName={roomName}
 *         socket={socket}
 *         showAlert={showAlert}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom styled with responsibility counts
 * ```tsx
 * import { CoHostModal } from 'mediasfu-reactjs';
 *
 * function BrandedCoHost(props) {
 *   const activeResponsibilities = props.coHostResponsibility.filter(r => r.value).length;
 *
 *   return (
 *     <CoHostModal
 *       {...props}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *         },
 *       }}
 *       saveButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       title={
 *         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 *           <span>Co-Host Settings</span>
 *           <span style={{ fontSize: 14, fontWeight: 400 }}>
 *             ({activeResponsibilities} active)
 *           </span>
 *         </div>
 *       }
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Analytics tracking for co-host changes
 * ```tsx
 * import { CoHostModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsCoHost(props) {
 *   const handleModifySettings = async (options) => {
 *     const activeResponsibilities = options.parameters.coHostResponsibility
 *       .filter(r => r.value)
 *       .map(r => r.name);
 *
 *     analytics.track('cohost_settings_updated', {
 *       newCoHost: options.parameters.coHost,
 *       previousCoHost: props.currentCohost,
 *       responsibilities: activeResponsibilities,
 *       responsibilityCount: activeResponsibilities.length,
 *     });
 *
 *     return props.onModifyEventSettings?.(options);
 *   };
 *
 *   return (
 *     <CoHostModal
 *       {...props}
 *       onModifyEventSettings={handleModifySettings}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, CoHostModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   coHostModal: {
 *     component: (props) => (
 *       <CoHostModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         saveButtonProps={{
 *           style: {
 *             background: '#22c55e',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *             fontWeight: 600,
 *           },
 *         }}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const CoHostModal: React.FC<CoHostModalOptions>;
export default CoHostModal;
//# sourceMappingURL=CoHostModal.d.ts.map