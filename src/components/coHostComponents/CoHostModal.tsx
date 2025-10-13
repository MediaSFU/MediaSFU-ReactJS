
 
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './CoHostModal.css'; // Import your custom CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';
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
  socket: Socket
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
  responsibilityItems?: { name: string; label: React.ReactNode }[];
  renderHeader?: (options: { defaultHeader: React.ReactNode }) => React.ReactNode;
  renderBody?: (options: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderResponsibilities?: (options: {
    defaultResponsibilities: React.ReactNode;
    items: { name: string; label: React.ReactNode }[];
    responsibilities: Record<string, boolean>;
    toggleSelect: (name: string) => void;
    toggleDedicated: (name: string) => void;
  }) => React.ReactNode;
  renderResponsibilityRow?: (options: {
    defaultRow: React.ReactNode;
    item: { name: string; label: React.ReactNode };
    index: number;
    isSelected: boolean;
    isDedicated: boolean;
    toggleSelect: () => void;
    toggleDedicated: () => void;
  }) => React.ReactNode;
  renderFooter?: (options: { defaultFooter: React.ReactNode }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
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

const CoHostModal: React.FC<CoHostModalOptions> = ({
  isCoHostModalVisible,
  onCoHostClose,
  onModifyEventSettings = modifyCoHostSettings,
  currentCohost = 'No coHost',
  participants,
  coHostResponsibility,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  roomName,
  showAlert,
  updateCoHostResponsibility,
  updateCoHost,
  updateIsCoHostModalVisible,
  socket,
  title = 'Manage Co-Host',
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  currentCoHostFieldProps,
  currentCoHostLabelProps,
  currentCoHostInputProps,
  selectCoHostFieldProps,
  selectCoHostLabelProps,
  selectCoHostSelectProps,
  responsibilitiesWrapperProps,
  responsibilitiesHeaderRowProps,
  responsibilityHeaderLabelProps,
  responsibilitySelectHeaderProps,
  responsibilityDedicatedHeaderProps,
  responsibilityRowProps,
  responsibilityNameProps,
  responsibilitySelectProps,
  responsibilityDedicatedProps,
  responsibilitySelectCheckboxProps,
  responsibilityDedicatedCheckboxProps,
  footerProps,
  saveButtonProps,
  currentCoHostLabel,
  selectCoHostLabel,
  responsibilityHeaderLabel,
  responsibilitySelectLabel,
  responsibilityDedicatedLabel,
  saveButtonLabel,
  responsibilityItems,
  renderHeader,
  renderBody,
  renderResponsibilities,
  renderResponsibilityRow,
  renderFooter,
  renderContent,
}) => {
  const defaultOverlayWidth =
    typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.8, 400) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    'mediasfu-cohost-modal',
    overlayClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isCoHostModalVisible ? 'block' : 'none',
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    'mediasfu-cohost-modal__content',
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const contentStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: defaultOverlayWidth,
    maxHeight: '65%',
    maxWidth: defaultOverlayWidth,
    overflow: 'hidden',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = [
    'modal-header',
    headerClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = [
    'modal-title',
    titleClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'black',
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    'btn-close-settings',
    closeButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    ...closeButtonStyleOverrides,
  };

  const defaultCloseIcon = closeIconComponent ?? (
    <FontAwesomeIcon icon={faTimes} className="icon" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onCoHostClose();
    }
  };

  const {
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: 'black',
    marginTop: 5,
    marginBottom: 5,
    border: 'none',
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    'modal-body',
    bodyClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
    ...bodyStyleOverrides,
  };

  const {
    className: currentCoHostFieldClassName,
    style: currentCoHostFieldStyleOverrides,
    ...restCurrentCoHostFieldProps
  } = currentCoHostFieldProps ?? {};

  const currentCoHostFieldClassNames = [
    'form-group',
    currentCoHostFieldClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const currentCoHostFieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    ...currentCoHostFieldStyleOverrides,
  };

  const {
    className: currentCoHostLabelClassName,
    style: currentCoHostLabelStyleOverrides,
    ...restCurrentCoHostLabelProps
  } = currentCoHostLabelProps ?? {};

  const currentCoHostLabelClassNames = [
    'font-weight-bold',
    currentCoHostLabelClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const currentCoHostLabelStyle: React.CSSProperties = {
    ...currentCoHostLabelStyleOverrides,
  };

  const {
    className: currentCoHostInputClassName,
    style: currentCoHostInputStyleOverrides,
    ...restCurrentCoHostInputProps
  } = currentCoHostInputProps ?? {};

  const currentCoHostInputClassNames = [
    'form-control',
    currentCoHostInputClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const currentCoHostInputStyle: React.CSSProperties = {
    ...currentCoHostInputStyleOverrides,
  };

  const {
    className: selectCoHostFieldClassName,
    style: selectCoHostFieldStyleOverrides,
    ...restSelectCoHostFieldProps
  } = selectCoHostFieldProps ?? {};

  const selectCoHostFieldClassNames = [
    'form-group',
    selectCoHostFieldClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const selectCoHostFieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    ...selectCoHostFieldStyleOverrides,
  };

  const {
    className: selectCoHostLabelClassName,
    style: selectCoHostLabelStyleOverrides,
    ...restSelectCoHostLabelProps
  } = selectCoHostLabelProps ?? {};

  const selectCoHostLabelClassNames = [
    'font-weight-bold',
    selectCoHostLabelClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const selectCoHostLabelStyle: React.CSSProperties = {
    ...selectCoHostLabelStyleOverrides,
  };

  const {
    className: selectCoHostSelectClassName,
    style: selectCoHostSelectStyleOverrides,
    ...restSelectCoHostSelectProps
  } = selectCoHostSelectProps ?? {};

  const selectCoHostSelectClassNames = [
    'form-control',
    selectCoHostSelectClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const selectCoHostSelectStyle: React.CSSProperties = {
    ...selectCoHostSelectStyleOverrides,
  };

  const {
    className: responsibilitiesWrapperClassName,
    style: responsibilitiesWrapperStyleOverrides,
    ...restResponsibilitiesWrapperProps
  } = responsibilitiesWrapperProps ?? {};

  const responsibilitiesWrapperClassNames = [
    'cohost-responsibilities',
    responsibilitiesWrapperClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilitiesWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    ...responsibilitiesWrapperStyleOverrides,
  };

  const {
    className: responsibilitiesHeaderRowClassName,
    style: responsibilitiesHeaderRowStyleOverrides,
    ...restResponsibilitiesHeaderRowProps
  } = responsibilitiesHeaderRowProps ?? {};

  const responsibilitiesHeaderRowClassNames = [
    'row',
    responsibilitiesHeaderRowClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilitiesHeaderRowStyle: React.CSSProperties = {
    fontWeight: 'bold',
    ...responsibilitiesHeaderRowStyleOverrides,
  };

  const {
    className: responsibilityHeaderLabelClassName,
    style: responsibilityHeaderLabelStyleOverrides,
    ...restResponsibilityHeaderLabelProps
  } = responsibilityHeaderLabelProps ?? {};

  const responsibilityHeaderLabelClassNames = [
    'col-5',
    responsibilityHeaderLabelClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityHeaderLabelStyle: React.CSSProperties = {
    ...responsibilityHeaderLabelStyleOverrides,
  };

  const {
    className: responsibilitySelectHeaderClassName,
    style: responsibilitySelectHeaderStyleOverrides,
    ...restResponsibilitySelectHeaderProps
  } = responsibilitySelectHeaderProps ?? {};

  const responsibilitySelectHeaderClassNames = [
    'col-3',
    responsibilitySelectHeaderClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilitySelectHeaderStyle: React.CSSProperties = {
    ...responsibilitySelectHeaderStyleOverrides,
  };

  const {
    className: responsibilityDedicatedHeaderClassName,
    style: responsibilityDedicatedHeaderStyleOverrides,
    ...restResponsibilityDedicatedHeaderProps
  } = responsibilityDedicatedHeaderProps ?? {};

  const responsibilityDedicatedHeaderClassNames = [
    'col-4',
    responsibilityDedicatedHeaderClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityDedicatedHeaderStyle: React.CSSProperties = {
    ...responsibilityDedicatedHeaderStyleOverrides,
  };

  const {
    className: responsibilityRowClassName,
    style: responsibilityRowStyleOverrides,
    ...restResponsibilityRowProps
  } = responsibilityRowProps ?? {};

  const responsibilityRowClassNames = [
    'row',
    responsibilityRowClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityRowStyle: React.CSSProperties = {
    marginBottom: 10,
    ...responsibilityRowStyleOverrides,
  };

  const {
    className: responsibilityNameClassName,
    style: responsibilityNameStyleOverrides,
    ...restResponsibilityNameProps
  } = responsibilityNameProps ?? {};

  const responsibilityNameClassNames = [
    'col-5',
    responsibilityNameClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    ...responsibilityNameStyleOverrides,
  };

  const {
    className: responsibilitySelectClassName,
    style: responsibilitySelectStyleOverrides,
    ...restResponsibilitySelectProps
  } = responsibilitySelectProps ?? {};

  const responsibilitySelectClassNames = [
    'col-3',
    responsibilitySelectClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilitySelectStyle: React.CSSProperties = {
    ...responsibilitySelectStyleOverrides,
  };

  const {
    className: responsibilityDedicatedClassName,
    style: responsibilityDedicatedStyleOverrides,
    ...restResponsibilityDedicatedProps
  } = responsibilityDedicatedProps ?? {};

  const responsibilityDedicatedClassNames = [
    'col-4',
    responsibilityDedicatedClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityDedicatedStyle: React.CSSProperties = {
    ...responsibilityDedicatedStyleOverrides,
  };

  const {
    className: responsibilitySelectCheckboxClassName,
    style: responsibilitySelectCheckboxStyleOverrides,
    ...restResponsibilitySelectCheckboxProps
  } = responsibilitySelectCheckboxProps ?? {};

  const responsibilitySelectCheckboxClassNames = [
    responsibilitySelectCheckboxClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilitySelectCheckboxStyle: React.CSSProperties = {
    ...responsibilitySelectCheckboxStyleOverrides,
  };

  const {
    className: responsibilityDedicatedCheckboxClassName,
    style: responsibilityDedicatedCheckboxStyleOverrides,
    ...restResponsibilityDedicatedCheckboxProps
  } = responsibilityDedicatedCheckboxProps ?? {};

  const responsibilityDedicatedCheckboxClassNames = [
    responsibilityDedicatedCheckboxClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const responsibilityDedicatedCheckboxStyle: React.CSSProperties = {
    ...responsibilityDedicatedCheckboxStyleOverrides,
  };

  const {
    className: footerClassName,
    style: footerStyleOverrides,
    ...restFooterProps
  } = footerProps ?? {};

  const footerClassNames = [
    'modal-footer',
    footerClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    ...footerStyleOverrides,
  };

  const {
    className: saveButtonClassName,
    style: saveButtonStyleOverrides,
    onClick: saveButtonOnClick,
    ...restSaveButtonProps
  } = saveButtonProps ?? {};

  const saveButtonClassNames = [
    'btn-apply-settings',
    saveButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const saveButtonStyle: React.CSSProperties = {
    ...saveButtonStyleOverrides,
  };

  const [selectedCohost, setSelectedCohost] = useState<string>(currentCohost);
  const [CoHostResponsibilityCopy, setCoHostResponsibilityCopy] = useState<CoHostResponsibility[]>([...coHostResponsibility]);
  const [CoHostResponsibilityCopyAlt, setCoHostResponsibilityCopyAlt] = useState<CoHostResponsibility[]>([...coHostResponsibility]);

  const initialResponsibilities = CoHostResponsibilityCopyAlt.reduce<Record<string, boolean>>((acc, item) => {
    const str2 = item.name.charAt(0).toUpperCase() + item.name.slice(1);
    const keyed = `manage${str2}`;
    acc[keyed] = item.value;
    acc[`dedicateTo${keyed}`] = item.dedicated;
    return acc;
  }, {});

  const [responsibilities, setResponsibilities] = useState<Record<string, boolean>>(initialResponsibilities);

  const defaultResponsibilityItems = [
    { name: 'manageParticipants', label: 'Manage Participants' },
    { name: 'manageMedia', label: 'Manage Media' },
    { name: 'manageWaiting', label: 'Manage Waiting Room' },
    { name: 'manageChat', label: 'Manage Chat' },
  ];

  const responsibilityItemsList = responsibilityItems ?? defaultResponsibilityItems;

  const handleToggleSwitch = (responsibility: string) => {
    setResponsibilities((prevResponsibilities) => ({
      ...prevResponsibilities,
      [responsibility]: !prevResponsibilities[responsibility],
    }));

    // Update the coHostResponsibilityCopy
    if (responsibility.startsWith('dedicateTo')) {
      const responsibilityName = responsibility.replace('dedicateTomanage', '').toLowerCase();
      const responsibilityDedicated = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName)?.dedicated;
      if (responsibilityDedicated !== undefined) {
        CoHostResponsibilityCopy.find((item) => item.name === responsibilityName)!.dedicated = !responsibilityDedicated;
      }
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);
    } else if (responsibility.startsWith('manage')) {
      const responsibilityName = responsibility.replace('manage', '').toLowerCase();
      const responsibilityValue = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName)?.value;
      if (responsibilityValue !== undefined) {
        CoHostResponsibilityCopy.find((item) => item.name === responsibilityName)!.value = !responsibilityValue;
      }
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);
    }
  };

  useEffect(() => {
    const populateResponsibilities = () => {
      setCoHostResponsibilityCopyAlt([...coHostResponsibility]);
      setCoHostResponsibilityCopy([...coHostResponsibility]);
      const responsibilities = CoHostResponsibilityCopyAlt.reduce<Record<string, boolean>>((acc, item) => {
        const str2 = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        const keyed = `manage${str2}`;
        acc[keyed] = item.value;
        acc[`dedicateTo${keyed}`] = item.dedicated;
        return acc;
      }, {});
      setResponsibilities(responsibilities);
    };

    if (isCoHostModalVisible) {
      populateResponsibilities();
    }
  }, [isCoHostModalVisible, coHostResponsibility]);

  const currentCoHostLabelNode = currentCoHostLabel ?? 'Current Co-host:';
  const selectCoHostLabelNode = selectCoHostLabel ?? 'Select New Co-host:';
  const responsibilityHeaderLabelNode = responsibilityHeaderLabel ?? 'Responsibility';
  const responsibilitySelectLabelNode = responsibilitySelectLabel ?? 'Select';
  const responsibilityDedicatedLabelNode = responsibilityDedicatedLabel ?? 'Dedicated';
  const saveButtonLabelNode = saveButtonLabel ?? 'Save';

  const handleSaveClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    saveButtonOnClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    onModifyEventSettings({
      roomName,
      showAlert,
      selectedParticipant: selectedCohost,
      coHost: currentCohost,
      coHostResponsibility: CoHostResponsibilityCopy,
      updateCoHostResponsibility,
      updateCoHost,
      updateIsCoHostModalVisible,
      socket,
    });
  };

  const buildHeader = () => {
    const defaultHeader = (
      <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
        <div className={titleClassNames} style={titleStyle} {...restTitleProps}>
          {title}
        </div>
        <button
          type="button"
          className={closeButtonClassNames}
          style={closeButtonStyle}
          onClick={handleCloseClick}
          {...restCloseButtonProps}
        >
          {defaultCloseIcon}
        </button>
      </div>
    );

    return renderHeader ? renderHeader({ defaultHeader }) : defaultHeader;
  };

  const toggleSelect = (name: string) => handleToggleSwitch(name);
  const toggleDedicated = (name: string) => handleToggleSwitch(`dedicateTo${name}`);

  const buildResponsibilities = () => {
    const headerRow = (
      <div
        className={responsibilitiesHeaderRowClassNames}
        style={responsibilitiesHeaderRowStyle}
        {...restResponsibilitiesHeaderRowProps}
      >
        <label
          className={responsibilityHeaderLabelClassNames}
          style={responsibilityHeaderLabelStyle}
          {...restResponsibilityHeaderLabelProps}
        >
          {responsibilityHeaderLabelNode}
        </label>
        <label
          className={responsibilitySelectHeaderClassNames}
          style={responsibilitySelectHeaderStyle}
          {...restResponsibilitySelectHeaderProps}
        >
          {responsibilitySelectLabelNode}
        </label>
        <label
          className={responsibilityDedicatedHeaderClassNames}
          style={responsibilityDedicatedHeaderStyle}
          {...restResponsibilityDedicatedHeaderProps}
        >
          {responsibilityDedicatedLabelNode}
        </label>
      </div>
    );

    const rows = responsibilityItemsList.map((item, index) => {
      const isSelected = Boolean(responsibilities[item.name]);
      const dedicatedKey = `dedicateTo${item.name}`;
      const isDedicated = Boolean(responsibilities[item.name] && responsibilities[dedicatedKey]);

      const defaultRow = (
        <div
          className={responsibilityRowClassNames}
          style={responsibilityRowStyle}
          {...restResponsibilityRowProps}
        >
          <div
            className={responsibilityNameClassNames}
            style={responsibilityNameStyle}
            {...restResponsibilityNameProps}
          >
            {item.label}
          </div>
          <div
            className={responsibilitySelectClassNames}
            style={responsibilitySelectStyle}
            {...restResponsibilitySelectProps}
          >
            <input
              type="checkbox"
              className={responsibilitySelectCheckboxClassNames}
              style={responsibilitySelectCheckboxStyle}
              checked={isSelected}
              onChange={() => toggleSelect(item.name)}
              {...restResponsibilitySelectCheckboxProps}
            />
          </div>
          <div
            className={responsibilityDedicatedClassNames}
            style={responsibilityDedicatedStyle}
            {...restResponsibilityDedicatedProps}
          >
            <input
              type="checkbox"
              className={responsibilityDedicatedCheckboxClassNames}
              style={responsibilityDedicatedCheckboxStyle}
              checked={isDedicated}
              onChange={() => toggleDedicated(item.name)}
              disabled={!isSelected}
              {...restResponsibilityDedicatedCheckboxProps}
            />
          </div>
        </div>
      );

      const rowContent = renderResponsibilityRow
        ? renderResponsibilityRow({
            defaultRow,
            item,
            index,
            isSelected,
            isDedicated,
            toggleSelect: () => toggleSelect(item.name),
            toggleDedicated: () => toggleDedicated(item.name),
          })
        : defaultRow;

      return <React.Fragment key={item.name}>{rowContent}</React.Fragment>;
    });

    const defaultResponsibilities = (
      <div
        className={responsibilitiesWrapperClassNames}
        style={responsibilitiesWrapperStyle}
        {...restResponsibilitiesWrapperProps}
      >
        {headerRow}
        {rows}
      </div>
    );

    return renderResponsibilities
      ? renderResponsibilities({
          defaultResponsibilities,
          items: responsibilityItemsList,
          responsibilities,
          toggleSelect,
          toggleDedicated,
        })
      : defaultResponsibilities;
  };

  const responsibilitiesNode = buildResponsibilities();

  const filteredParticipants = participants?.filter((participant) => participant.name !== currentCohost && participant.islevel !== '2') ?? [];

  const bodyContent = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      <div
        className={currentCoHostFieldClassNames}
        style={currentCoHostFieldStyle}
        {...restCurrentCoHostFieldProps}
      >
        <label
          className={currentCoHostLabelClassNames}
          style={currentCoHostLabelStyle}
          {...restCurrentCoHostLabelProps}
        >
          {currentCoHostLabelNode}
        </label>
        <input
          className={currentCoHostInputClassNames}
          style={currentCoHostInputStyle}
          value={currentCohost}
          readOnly
          {...restCurrentCoHostInputProps}
        />
      </div>
      <div
        className={selectCoHostFieldClassNames}
        style={selectCoHostFieldStyle}
        {...restSelectCoHostFieldProps}
      >
        <label
          className={selectCoHostLabelClassNames}
          style={selectCoHostLabelStyle}
          {...restSelectCoHostLabelProps}
        >
          {selectCoHostLabelNode}
        </label>
        <select
          className={selectCoHostSelectClassNames}
          style={selectCoHostSelectStyle}
          value={selectedCohost}
          onChange={(e) => setSelectedCohost(e.target.value)}
          {...restSelectCoHostSelectProps}
        >
          <option value="">Select a participant</option>
          {filteredParticipants.map((participant) => (
            <option key={participant.name} value={participant.name}>
              {participant.name}
            </option>
          ))}
        </select>
      </div>
      {responsibilitiesNode}
    </div>
  );

  const bodyNode = renderBody ? renderBody({ defaultBody: bodyContent }) : bodyContent;

  const defaultFooter = (
    <div className={footerClassNames} style={footerStyle} {...restFooterProps}>
      <button
        type="button"
        className={saveButtonClassNames}
        style={saveButtonStyle}
        onClick={handleSaveClick}
        {...restSaveButtonProps}
      >
        {saveButtonLabelNode}
      </button>
    </div>
  );

  const footerNode = renderFooter ? renderFooter({ defaultFooter }) : defaultFooter;

  const headerNode = buildHeader();

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr style={headerDividerStyle} {...restHeaderDividerProps} />
      {bodyNode}
      {footerNode}
    </div>
  );

  const contentNode = renderContent ? renderContent({ defaultContent }) : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default CoHostModal;
