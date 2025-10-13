// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { MediasfuGeneric } from 'mediasfu-reactjs';
// import {
//   CustomVideoCardOptions,
//   CustomAudioCardOptions,
//   CustomMiniCardOptions,
//   CustomPreJoinPageOptions,
// } from 'mediasfu-reactjs';

// // Custom Control Buttons Example (showcasing flexible props)
// import {
//   ControlButtonsComponent,
//   Button,
// } from 'mediasfu-reactjs';
// import {
//   faMicrophone,
//   faVideo,
//   faShareFromSquare,
// } from '@fortawesome/free-solid-svg-icons';
//
// const MyControlButtons = ({ parameters }: { parameters: any }) => {
//   const buttons: Button[] = [
//     {
//       name: 'Mic',
//       icon: faMicrophone,
//       active: !parameters.local?.muted,
//       onPress: parameters.toggleLocalAudio,
//       buttonProps: { 'aria-label': 'Toggle microphone' },
//       textProps: { style: { minWidth: 40, textAlign: 'center' } },
//     },
//     {
//       name: 'Camera',
//       icon: faVideo,
//       active: parameters.local?.videoOn,
//       onPress: parameters.toggleLocalVideo,
//       backgroundColor: { default: '#0ea5e9', pressed: '#0369a1' },
//       renderContent: ({ defaultContent }) => (
//         <div className="button-shell">{defaultContent}</div>
//       ),
//     },
//     {
//       name: 'Share',
//       icon: faShareFromSquare,
//       onPress: parameters.startScreenShare,
//       show: parameters.canShare,
//       style: { minWidth: 96 },
//     },
//   ];
//
//   return (
//     <ControlButtonsComponent
//       buttons={buttons}
//       containerProps={{
//         role: 'toolbar',
//         'aria-label': 'media controls',
//         style: { gap: '0.75rem' },
//       }}
//       buttonProps={{ type: 'button', className: 'media-control' }}
//       iconWrapperProps={{ className: 'media-control__icon' }}
//       renderButtonContent={({ defaultContent, button }) => (
//         <span className="media-control__inner">
//           {defaultContent}
//           {button.active && <span className="media-control__indicator" />}
//         </span>
//       )}
//     />
//   );
// };

// // Alternate Control Buttons Example (side aligned layout)
// import {
//   ControlButtonsAltComponent,
//   AltButton,
// } from 'mediasfu-reactjs';
// import { faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
//
// const MyAltControlButtons = ({ parameters }: { parameters: any }) => {
//   const buttons: AltButton[] = [
//     {
//       name: 'Chat',
//       icon: faMessage,
//       onPress: parameters.openChat,
//       buttonProps: { 'aria-label': 'Open chat panel' },
//       iconWrapperProps: { className: 'alt-control__icon' },
//     },
//     {
//       name: 'Settings',
//       icon: faGear,
//       renderContent: ({ defaultContent }) => (
//         <div className="alt-control__inner">{defaultContent}</div>
//       ),
//     },
//   ];
//
//   return (
//     <ControlButtonsAltComponent
//       showAspect
//       position="middle"
//       location="center"
//       direction="vertical"
//       containerProps={{
//         'aria-label': 'side controls',
//         className: 'alt-controls',
//       }}
//       buttonProps={{ type: 'button' }}
//       buttons={buttons}
//     />
//   );
// };

// // Touch-friendly Control Buttons Example
// import {
//   ControlButtonsComponentTouch,
//   ButtonTouch,
// } from 'mediasfu-reactjs';
// import { faMicrophoneLines, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
//
// const MyTouchControls = ({ parameters }: { parameters: any }) => {
//   const buttons: ButtonTouch[] = [
//     {
//       name: 'Mute',
//       icon: faMicrophoneLines,
//       active: !parameters.local?.muted,
//       onPress: parameters.toggleLocalAudio,
//       buttonProps: { 'aria-pressed': !parameters.local?.muted },
//     },
//     {
//       name: 'Video',
//       icon: faVideoSlash,
//       onPress: parameters.toggleLocalVideo,
//       renderContent: ({ defaultContent }) => (
//         <div className="touch-control__inner">{defaultContent}</div>
//       ),
//     },
//   ];
//
//   return (
//     <ControlButtonsComponentTouch
//       showAspect
//       position="middle"
//       location="bottom"
//       direction="horizontal"
//       containerProps={{
//         role: 'toolbar',
//         className: 'touch-controls',
//       }}
//       buttonProps={{ type: 'button', className: 'touch-control' }}
//       gap={16}
//       buttons={buttons}
//     />
//   );
// };

// // Custom Loading Modal Example
// import { LoadingModal } from 'mediasfu-reactjs';
//
// const MyLoadingModal = ({ isBusy }: { isBusy: boolean }) => (
//   <LoadingModal
//     isVisible={isBusy}
//     backgroundColor="rgba(15, 23, 42, 0.75)"
//     displayColor="#f8fafc"
//     loadingText={<strong>Setting things up…</strong>}
//     containerProps={{ className: 'app-loading-overlay' }}
//     spinnerProps={{ pulse: true }}
//   />
// );

// // Custom Confirm Exit Modal Example
// import { ConfirmExitModal } from 'mediasfu-reactjs';
// import { io } from 'socket.io-client';
//
// const socket = io('http://localhost:3000');
//
// const MyConfirmExitModal = ({ open, close }: { open: boolean; close: () => void }) => (
//   <ConfirmExitModal
//     isConfirmExitModalVisible={open}
//     onConfirmExitClose={close}
//     member="Jane Doe"
//     roomName="Studio A"
//     socket={socket}
//     islevel="2"
//     title={<span>Leave the studio?</span>}
//     confirmLabel="Yes, end session"
//     cancelLabel="Stay"
//     overlayProps={{ className: 'confirm-exit-modal__overlay' }}
//     contentProps={{ className: 'confirm-exit-modal__content' }}
//     footerProps={{ style: { justifyContent: 'space-between' } }}
//     headerDividerProps={{ className: 'confirm-exit-modal__divider' }}
//     bodyDividerProps={{ className: 'confirm-exit-modal__divider' }}
//     renderMessage={({ defaultMessage }) => (
//       <div className="confirm-exit-modal__message">
//         {defaultMessage}
//         <small>Please make sure recordings are saved first.</small>
//       </div>
//     )}
//     renderHeaderDivider={({ defaultDivider }) => (
//       <div className="confirm-exit-modal__divider-wrapper">{defaultDivider}</div>
//     )}
//     renderContent={({ defaultContent }) => (
//       <section className="confirm-exit-modal__shell">{defaultContent}</section>
//     )}
//   />
// );

// // Custom VideoCard Example
// const MyCustomVideoCard = ({
//   participant,
//   stream,
//   width,
//   height,
//   showControls,
//   showInfo,
//   name,
//   backgroundColor,
//   parameters,
// }: CustomVideoCardOptions) => {
//   return (
//     <div
//       style={{
//         width: width,
//         height: height,
//         backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.8)',
//         borderRadius: '16px',
//         position: 'relative',
//         overflow: 'hidden',
//         border: '3px solid #6366f1',
//       }}
//     >
//       {/* Custom video display */}
//       {stream && (
//         <video
//           autoPlay
//           muted
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//           }}
//           ref={(videoElement) => {
//             if (videoElement && stream) {
//               videoElement.srcObject = stream;
//             }
//           }}
//         />
//       )}
      
//       {/* Custom participant info overlay */}
//       {showInfo && (
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '8px',
//             left: '8px',
//             background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
//             color: 'white',
//             padding: '4px 12px',
//             borderRadius: '20px',
//             fontSize: '14px',
//             fontWeight: 'bold',
//           }}
//         >
//           🎥 {name || participant.name}
//         </div>
//       )}
      
//       {/* Custom controls overlay */}
//       {showControls && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '8px',
//             right: '8px',
//             display: 'flex',
//             gap: '8px',
//           }}
//         >
//           <button
//             style={{
//               background: 'rgba(0, 0, 0, 0.6)',
//               border: 'none',
//               borderRadius: '50%',
//               width: '32px',
//               height: '32px',
//               color: 'white',
//               cursor: 'pointer',
//             }}
//           >
//             🔇
//           </button>
//           <button
//             style={{
//               background: 'rgba(0, 0, 0, 0.6)',
//               border: 'none',
//               borderRadius: '50%',
//               width: '32px',
//               height: '32px',
//               color: 'white',
//               cursor: 'pointer',
//             }}
//           >
//             📹
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Custom AudioCard Example
// const MyCustomAudioCard = ({
//   name,
//   barColor,
//   textColor,
//   parameters,
// }: CustomAudioCardOptions) => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '20px',
//         background: barColor 
//           ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
//           : 'linear-gradient(135deg, #6b7280, #4b5563)',
//         borderRadius: '16px',
//         color: textColor,
//         minHeight: '120px',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Audio wave animation */}
//       {barColor && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 2px, transparent 4px)',
//             animation: 'audioWave 1s infinite',
//           }}
//         />
//       )}
      
//       {/* Avatar */}
//       <div
//         style={{
//           width: '60px',
//           height: '60px',
//           borderRadius: '50%',
//           background: 'rgba(255, 255, 255, 0.2)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '24px',
//           fontWeight: 'bold',
//           marginBottom: '12px',
//           zIndex: 1,
//         }}
//       >
//         {name ? name.charAt(0).toUpperCase() : '?'}
//       </div>
      
//       {/* Name */}
//       <div
//         style={{
//           fontSize: '16px',
//           fontWeight: 'bold',
//           textAlign: 'center',
//           zIndex: 1,
//         }}
//       >
//         {name}
//       </div>
      
//       {/* Speaking indicator */}
//       {barColor && (
//         <div
//           style={{
//             marginTop: '8px',
//             fontSize: '12px',
//             opacity: 0.8,
//             zIndex: 1,
//           }}
//         >
//           🎤 Speaking...
//         </div>
//       )}
//     </div>
//   );
// };

// // Custom MiniCard Example
// const MyCustomMiniCard = ({
//   initials,
//   name,
//   showVideoIcon,
//   showAudioIcon,
//   parameters,
// }: CustomMiniCardOptions) => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '12px',
//         background: 'linear-gradient(145deg, #1f2937, #374151)',
//         borderRadius: '12px',
//         color: 'white',
//         minHeight: '80px',
//         minWidth: '80px',
//         border: '2px solid #6366f1',
//       }}
//     >
//       {/* Avatar/Initials */}
//       <div
//         style={{
//           width: '40px',
//           height: '40px',
//           borderRadius: '50%',
//           background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '16px',
//           fontWeight: 'bold',
//           marginBottom: '6px',
//         }}
//       >
//         {initials || name?.charAt(0)?.toUpperCase() || '?'}
//       </div>
      
//       {/* Name */}
//       <div
//         style={{
//           fontSize: '10px',
//           textAlign: 'center',
//           marginBottom: '6px',
//           maxWidth: '100%',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap',
//         }}
//       >
//         {name}
//       </div>
      
//       {/* Media status icons */}
//       <div style={{ display: 'flex', gap: '4px' }}>
//         {showVideoIcon && (
//           <span style={{ fontSize: '12px', opacity: 0.7 }}>📹</span>
//         )}
//         {showAudioIcon && (
//           <span style={{ fontSize: '12px', opacity: 0.7 }}>🎤</span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Custom PreJoinPage Example
// const MyCustomPreJoinPage = ({
//   localLink,
//   connectMediaSFU,
//   parameters,
//   credentials,
//   returnUI,
//   noUIPreJoinOptions,
//   createMediaSFURoom,
//   joinMediaSFURoom,
// }: CustomPreJoinPageOptions) => {
//   const [name, setName] = React.useState('');
//   const [roomId, setRoomId] = React.useState('');
//   const [isJoining, setIsJoining] = React.useState(false);

//   const handleJoin = async () => {
//     if (!name.trim() || !roomId.trim()) {
//       alert('Please enter both name and room ID');
//       return;
//     }

//     setIsJoining(true);
    
//     // Here you would implement the actual join logic
//     // This is just a demo implementation
    
//     setTimeout(() => {
//       parameters.updateMember(name);
//       parameters.updateRoomName(roomId);
//       parameters.updateValidated(true);
//       setIsJoining(false);
//     }, 2000);
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         padding: '20px',
//       }}
//     >
//       {/* Custom Logo */}
//       <div
//         style={{
//           marginBottom: '40px',
//           textAlign: 'center',
//         }}
//       >
//         <h1
//           style={{
//             color: 'white',
//             fontSize: '48px',
//             fontWeight: 'bold',
//             marginBottom: '16px',
//             textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
//           }}
//         >
//           🚀 MediaSFU
//         </h1>
//         <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
//           Join your custom meeting experience
//         </p>
//       </div>

//       {/* Custom Form */}
//       <div
//         style={{
//           background: 'rgba(255, 255, 255, 0.95)',
//           borderRadius: '20px',
//           padding: '40px',
//           boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//           backdropFilter: 'blur(10px)',
//           minWidth: '400px',
//         }}
//       >
//         <div style={{ marginBottom: '20px' }}>
//           <label
//             style={{
//               display: 'block',
//               marginBottom: '8px',
//               fontWeight: 'bold',
//               color: '#374151',
//             }}
//           >
//             Display Name
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//             style={{
//               width: '100%',
//               padding: '12px 16px',
//               border: '2px solid #e5e7eb',
//               borderRadius: '8px',
//               fontSize: '16px',
//               outline: 'none',
//               transition: 'border-color 0.2s',
//             }}
//             onFocus={(e) => {
//               e.target.style.borderColor = '#6366f1';
//             }}
//             onBlur={(e) => {
//               e.target.style.borderColor = '#e5e7eb';
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: '30px' }}>
//           <label
//             style={{
//               display: 'block',
//               marginBottom: '8px',
//               fontWeight: 'bold',
//               color: '#374151',
//             }}
//           >
//             Room ID
//           </label>
//           <input
//             type="text"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             placeholder="Enter room ID"
//             style={{
//               width: '100%',
//               padding: '12px 16px',
//               border: '2px solid #e5e7eb',
//               borderRadius: '8px',
//               fontSize: '16px',
//               outline: 'none',
//               transition: 'border-color 0.2s',
//             }}
//             onFocus={(e) => {
//               e.target.style.borderColor = '#6366f1';
//             }}
//             onBlur={(e) => {
//               e.target.style.borderColor = '#e5e7eb';
//             }}
//           />
//         </div>

//         <button
//           onClick={handleJoin}
//           disabled={isJoining}
//           style={{
//             width: '100%',
//             padding: '16px',
//             background: isJoining 
//               ? 'linear-gradient(45deg, #9ca3af, #6b7280)' 
//               : 'linear-gradient(45deg, #6366f1, #8b5cf6)',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             fontSize: '18px',
//             fontWeight: 'bold',
//             cursor: isJoining ? 'not-allowed' : 'pointer',
//             transition: 'all 0.2s',
//             transform: isJoining ? 'scale(0.98)' : 'scale(1)',
//           }}
//         >
//           {isJoining ? '🔄 Joining...' : '🚀 Join Meeting'}
//         </button>
//       </div>

//       {/* Features showcase */}
//       <div
//         style={{
//           marginTop: '40px',
//           display: 'flex',
//           gap: '20px',
//           color: 'white',
//           textAlign: 'center',
//         }}
//       >
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎥</div>
//           <div style={{ fontSize: '14px', opacity: 0.8 }}>HD Video</div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</div>
//           <div style={{ fontSize: '14px', opacity: 0.8 }}>Crystal Audio</div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
//           <div style={{ fontSize: '14px', opacity: 0.8 }}>Screen Share</div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
//           <div style={{ fontSize: '14px', opacity: 0.8 }}>Live Chat</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Custom Waiting Room Modal Example
// import { WaitingRoomModal } from 'mediasfu-reactjs';
// import { io as clientIO } from 'socket.io-client';
//
// const waitingSocket = clientIO('http://localhost:3000');
//
// const MyWaitingRoomModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: {
//     close: () => void;
//     setFilter: (value: string) => void;
//     list: any[];
//     filtered: any[];
//     update: (value: any[]) => void;
//     roomName: string;
//     parameters: any;
//   };
// }) => (
//   <WaitingRoomModal
//     isWaitingModalVisible={open}
//     onWaitingRoomClose={state.close}
//     waitingRoomCounter={state.filtered.length}
//     onWaitingRoomFilterChange={state.setFilter}
//     waitingRoomList={state.list}
//     updateWaitingList={state.update}
//     roomName={state.roomName}
//     socket={waitingSocket}
//     parameters={state.parameters}
//     title={<span>Guests waiting</span>}
//     overlayProps={{ className: 'waiting-modal__overlay' }}
//     contentProps={{ style: { maxHeight: '70%' } }}
//     waitingListProps={{ style: { gap: '0.75rem' } }}
//     badgeProps={{ 'aria-live': 'polite' }}
//     renderParticipant={({ defaultParticipant, participant }) => (
//       <div className="waiting-row">
//         {defaultParticipant}
//         <small>{participant.email}</small>
//       </div>
//     )}
//     emptyState={<em>No visitors yet.</em>}
//   />
// );

// // Custom Background Modal Example
// import { BackgroundModal } from 'mediasfu-reactjs';
//
// const MyBackgroundModal = ({
//   open,
//   context,
// }: {
//   open: boolean;
//   context: any;
// }) => (
//   <BackgroundModal
//     isVisible={open}
//     onClose={context.close}
//     parameters={context.parameters}
//     overlayProps={{ className: 'background-modal__overlay' }}
//     contentProps={{ className: 'background-modal__content' }}
//     applyButtonLabel="Preview backdrop"
//     applyButtonAppliedLabel="Apply backdrop"
//     renderHeader={({ defaultHeader }) => (
//       <div className="background-modal__header">
//         {defaultHeader}
//         <small>Pick a backdrop or upload your own image.</small>
//       </div>
//     )}
//     renderButtons={({ defaultButtons }) => (
//       <div className="background-modal__buttons-inline">{defaultButtons}</div>
//     )}
//   />
// );

// // Custom Breakout Rooms Modal Example
// import { BreakoutRoomsModal } from 'mediasfu-reactjs';
//
// const MyBreakoutRoomsModal = ({
//   open,
//   context,
// }: {
//   open: boolean;
//   context: any;
// }) => (
//   <BreakoutRoomsModal
//     isVisible={open}
//     onBreakoutRoomsClose={context.close}
//     parameters={context.parameters}
//     overlayProps={{ className: 'breakout-modal__overlay' }}
//     contentProps={{ className: 'breakout-modal__content' }}
//     numRoomsLabel={<span>Rooms needed</span>}
//     randomAssignButtonLabel={<span>Shuffle guests</span>}
//     renderControls={({ defaultControls }) => (
//       <section className="breakout-modal__controls">{defaultControls}</section>
//     )}
//     renderStartButton={({ defaultStartButton }) => (
//       <div className="breakout-modal__start">{defaultStartButton}</div>
//     )}
//   />
// );

// // Custom Co-Host Modal Example
// import { CoHostModal } from 'mediasfu-reactjs';
// import { io as cohostIO } from 'socket.io-client';
//
// const cohostSocket = cohostIO('http://localhost:3000');
//
// const MyCoHostModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: any;
// }) => (
//   <CoHostModal
//     isCoHostModalVisible={open}
//     onCoHostClose={state.close}
//     participants={state.participants}
//     coHostResponsibility={state.responsibilities}
//     currentCohost={state.currentCohost}
//     roomName={state.roomName}
//     showAlert={state.showAlert}
//     updateCoHostResponsibility={state.updateResponsibilities}
//     updateCoHost={state.updateCoHost}
//     updateIsCoHostModalVisible={state.updateVisibility}
//     socket={cohostSocket}
//     title="Assign a co-host"
//     overlayProps={{ className: 'cohost-modal__overlay' }}
//     contentProps={{ className: 'cohost-modal__content' }}
//     responsibilityHeaderLabel="Role"
//     responsibilitySelectLabel="Allow"
//     responsibilityDedicatedLabel="Make primary"
//     renderResponsibilities={({ defaultResponsibilities }) => (
//       <div className="cohost-modal__responsibilities">{defaultResponsibilities}</div>
//     )}
//   />
// );

// // Custom Confirm Here Modal Example
// import { ConfirmHereModal } from 'mediasfu-reactjs';
// import { io as confirmIO } from 'socket.io-client';
//
// const confirmSocket = confirmIO('http://localhost:3000');
//
// const MyConfirmHereModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: any;
// }) => (
//   <ConfirmHereModal
//     isConfirmHereModalVisible={open}
//     onConfirmHereClose={state.close}
//     socket={confirmSocket}
//     localSocket={state.localSocket}
//     roomName={state.roomName}
//     member={state.member}
//     countdownDuration={90}
//     backgroundColor="rgba(15, 23, 42, 0.92)"
//     title={<span>Still watching?</span>}
//     message={({ counter }) => (
//       <span>
//         We pause the event when you're away. Let us know you're here within{' '}
//         <strong>{counter}</strong> seconds.
//       </span>
//     )}
//     confirmButtonLabel="I'm here"
//     overlayProps={{ className: 'confirm-here-modal__overlay' }}
//     contentProps={{ className: 'confirm-here-modal__content' }}
//     renderCountdown={({ defaultCountdown, counter }) => (
//       <div className="confirm-here-modal__countdown" data-seconds={counter}>
//         {defaultCountdown}
//       </div>
//     )}
//     renderConfirmButton={({ defaultButton }) => (
//       <div className="confirm-here-modal__actions">{defaultButton}</div>
//     )}
//   />
// );

// // Custom Event Settings Modal Example
// import { EventSettingsModal } from 'mediasfu-reactjs';
//
// const MyEventSettingsModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: any;
// }) => (
//   <EventSettingsModal
//     isEventSettingsModalVisible={open}
//     onEventSettingsClose={state.close}
//     audioSetting={state.audio}
//     videoSetting={state.video}
//     screenshareSetting={state.screenshare}
//     chatSetting={state.chat}
//     updateAudioSetting={state.updateAudio}
//     updateVideoSetting={state.updateVideo}
//     updateScreenshareSetting={state.updateScreenshare}
//     updateChatSetting={state.updateChat}
//     updateIsSettingsModalVisible={state.updateVisibility}
//     roomName={state.roomName}
//     socket={state.socket}
//     showAlert={state.showAlert}
//     overlayProps={{ className: 'event-settings-modal__overlay' }}
//     contentProps={{ className: 'event-settings-modal__content' }}
//     audioLabel={<span>Audience audio</span>}
//     saveButtonLabel={<strong>Store settings</strong>}
//     renderHeader={({ defaultHeader }) => (
//       <header className="event-settings-modal__header">{defaultHeader}</header>
//     )}
//     renderSettingSection={({ defaultSection, section }) => (
//       <section
//         className="event-settings-modal__section"
//         data-setting={section.key}
//       >
//         {defaultSection}
//       </section>
//     )}
//   />
// );

// // Custom Requests Modal Example
// import { RequestsModal } from 'mediasfu-reactjs';
// import { io as clientSocket } from 'socket.io-client';
//
// const requestsSocket = clientSocket('http://localhost:3000');
//
// const MyRequestsModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: {
//     close: () => void;
//     setFilter: (value: string) => void;
//     list: any[];
//     filtered: any[];
//     update: (value: any[]) => void;
//     roomName: string;
//     parameters: any;
//   };
// }) => (
//   <RequestsModal
//     isRequestsModalVisible={open}
//     onRequestClose={state.close}
//     requestCounter={state.filtered.length}
//     onRequestFilterChange={state.setFilter}
//     requestList={state.list}
//     updateRequestList={state.update}
//     roomName={state.roomName}
//     socket={requestsSocket}
//     parameters={state.parameters}
//     overlayProps={{ className: 'requests-modal__overlay' }}
//     contentProps={{ className: 'requests-modal__content' }}
//     renderRequest={({ defaultRequest, request }) => (
//       <div className="request-row">
//         {defaultRequest}
//         <small>{request.description}</small>
//       </div>
//     )}
//     emptyState={<em>All caught up!</em>}
//   />
// );

// // Custom Participants Modal Example
// import { ParticipantsModal } from 'mediasfu-reactjs';
// import { io as clientIo } from 'socket.io-client';
//
// const participantsSocket = clientIo('http://localhost:3000');
//
// const MyParticipantsModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: {
//     close: () => void;
//     setFilter: (value: string) => void;
//     count: number;
//     parameters: any;
//   };
// }) => (
//   <ParticipantsModal
//     isParticipantsModalVisible={open}
//     onParticipantsClose={state.close}
//     onParticipantsFilterChange={state.setFilter}
//     participantsCounter={state.count}
//     parameters={{
//       ...state.parameters,
//       socket: participantsSocket,
//     }}
//     overlayProps={{ className: 'participants-modal__overlay' }}
//     contentProps={{ className: 'participants-modal__content' }}
//     renderLists={({ defaultLists, hasModeratorControls }) => (
//       <div className="participants-lists-wrapper">
//         {hasModeratorControls ? <strong>Manage attendees</strong> : null}
//         {defaultLists}
//       </div>
//     )}
//     emptyState={<em>Nobody here yet.</em>}
//   />
// );

// // Custom Messages Modal Example
// import { MessagesModal } from 'mediasfu-reactjs';
// import { io as socketIO } from 'socket.io-client';
//
// const chatSocket = socketIO('http://localhost:3000');
//
// const MyMessagesModal = ({
//   open,
//   context,
// }: {
//   open: boolean;
//   context: any;
// }) => (
//   <MessagesModal
//     isMessagesModalVisible={open}
//     onMessagesClose={context.close}
//     messages={context.messages}
//     eventType={context.eventType}
//     member={context.member}
//     islevel={context.islevel}
//     coHostResponsibility={context.coHostResponsibility}
//     coHost={context.coHost}
//     startDirectMessage={context.startDirectMessage}
//     directMessageDetails={context.directMessageDetails}
//     updateStartDirectMessage={context.updateStartDirectMessage}
//     updateDirectMessageDetails={context.updateDirectMessageDetails}
//     showAlert={context.showAlert}
//     roomName={context.roomName}
//     socket={chatSocket}
//     chatSetting={context.chatSetting}
//     overlayProps={{ className: 'messages-modal__overlay' }}
//     contentProps={{ className: 'messages-modal__content' }}
//     renderTabs={({ defaultTabs, activeTab }) => (
//       <div data-active-tab={activeTab}>{defaultTabs}</div>
//     )}
//     emptyState={({ type }) => (
//       <em>{type === 'direct' ? 'No whispers yet.' : 'Group chat is quiet.'}</em>
//     )}
//   />
// );

// // Custom Recording Modal Example
// import { RecordingModal } from 'mediasfu-reactjs';
// import {
//   ConfirmRecordingType,
//   StartRecordingType,
//   RecordingModalParameters,
// } from 'mediasfu-reactjs';

// const MyRecordingModal = ({
//   open,
//   context,
// }: {
//   open: boolean;
//   context: {
//     close: () => void;
//     confirmRecording: ConfirmRecordingType;
//     startRecording: StartRecordingType;
//     parameters: RecordingModalParameters;
//   };
// }) => (
//   <RecordingModal
//     isRecordingModalVisible={open}
//     onClose={context.close}
//     confirmRecording={context.confirmRecording}
//     startRecording={context.startRecording}
//     parameters={context.parameters}
//     title={<span>Recording controls</span>}
//     overlayProps={{ className: 'recording-modal__overlay' }}
//     contentProps={{ className: 'recording-modal__content' }}
//     confirmButtonLabel={<strong>Save settings</strong>}
//     startButtonLabel={<span>Begin recording ▸</span>}
//     renderHeader={({ defaultHeader }) => (
//       <div className="recording-modal__header">
//         {defaultHeader}
//         <small>Only hosts and co-hosts can start recordings.</small>
//       </div>
//     )}
//     renderActions={({ defaultActions, recordPaused }) => (
//       <div className="recording-modal__actions-wrapper" data-paused={recordPaused}>
//         {defaultActions}
//       </div>
//     )}
//   />
// );

// // Custom Poll Modal Example
// import { PollModal } from 'mediasfu-reactjs';
// import { io as pollIO } from 'socket.io-client';
//
// const pollSocket = pollIO('http://localhost:3000');
//
// const MyPollModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: any;
// }) => (
//   <PollModal
//     isPollModalVisible={open}
//     onClose={state.close}
//     member={state.member}
//     islevel={state.islevel}
//     polls={state.polls}
//     poll={state.activePoll}
//     socket={pollSocket}
//     roomName={state.roomName}
//     showAlert={state.showAlert}
//     updateIsPollModalVisible={state.updateVisibility}
//     handleCreatePoll={state.handleCreatePoll}
//     handleEndPoll={state.handleEndPoll}
//     handleVotePoll={state.handleVotePoll}
//     overlayProps={{ className: 'poll-modal__overlay' }}
//     contentProps={{ className: 'poll-modal__content' }}
//     emptyActivePoll={<em>No live poll right now.</em>}
//   />
// );

// // Custom Share Event Modal Example
// import { ShareEventModal } from 'mediasfu-reactjs';
//
// const MyShareEventModal = ({
//   open,
//   state,
// }: {
//   open: boolean;
//   state: any;
// }) => (
//   <ShareEventModal
//     isShareEventModalVisible={open}
//     onShareEventClose={state.close}
//     roomName={state.roomName}
//     adminPasscode={state.adminPasscode}
//     islevel={state.islevel}
//     eventType={state.eventType}
//     localLink={state.localLink}
//     shareButtons={state.showShareButtons}
//     backgroundColor="rgba(15, 23, 42, 0.92)"
//     overlayProps={{ className: 'share-event-modal__overlay' }}
//     contentProps={{ className: 'share-event-modal__content' }}
//     closeButtonProps={{ 'aria-label': 'dismiss share modal' }}
//     meetingPasscodeWrapperProps={{ className: 'share-event-modal__passcode' }}
//     meetingIdWrapperProps={{ className: 'share-event-modal__meeting-id' }}
//     shareButtonsWrapperProps={{ className: 'share-event-modal__share-buttons' }}
//     renderHeader={({ defaultHeader }) => (
//       <header className="share-event-modal__header-shell">
//         <strong>Share event access</strong>
//         {defaultHeader}
//       </header>
//     )}
//     renderShareButtons={({ defaultShareButtons, hasShareButtons }) =>
//       hasShareButtons ? (
//         <section className="share-event-modal__share-options">
//           <p>Send this link to invite others:</p>
//           {defaultShareButtons}
//         </section>
//       ) : (
//         <em className="share-event-modal__share-empty">Sharing disabled</em>
//       )
//     }
//     renderBody={({ defaultBody }) => (
//       <div className="share-event-modal__body-shell">{defaultBody}</div>
//     )}
//   />
// );

// // Usage Example
// const App = () => {
//   return (
//     <MediasfuGeneric
//       // Standard MediaSFU options
//       credentials={{
//         apiUserName: "your-api-username",
//         apiKey: "your-api-key"
//       }}
//       localLink=""
//       connectMediaSFU={true}
      
//       // Custom component builders
//       customVideoCard={MyCustomVideoCard}
//       customAudioCard={MyCustomAudioCard}
//       customMiniCard={MyCustomMiniCard}
//       customPreJoinPage={MyCustomPreJoinPage}
//     />
//   );
// };

// export default App;