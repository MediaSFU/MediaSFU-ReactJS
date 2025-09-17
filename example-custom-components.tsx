// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { MediasfuGeneric } from 'mediasfu-reactjs';
// import {
//   CustomVideoCardOptions,
//   CustomAudioCardOptions,
//   CustomMiniCardOptions,
//   CustomPreJoinPageOptions,
// } from 'mediasfu-reactjs';

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