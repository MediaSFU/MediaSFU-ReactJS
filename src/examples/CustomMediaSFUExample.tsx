import React, { useState } from 'react';
import MediasfuGeneric from '../components/mediasfuComponents/MediasfuGeneric';

// Simple Custom Interface Component
const SimpleCustomInterface: React.FC<{ parameters: any }> = ({ parameters }) => {
  const [activeTab, setActiveTab] = useState('controls');
  
  const {
    roomName,
    member,
    participants,
    eventType,
    micAction,
    videoAction,
    screenAction,
    clickAudio,
    clickVideo,
    clickScreenShare,
    showAlert,
  } = parameters;

  const handleAudioToggle = () => {
    clickAudio({ parameters });
  };

  const handleVideoToggle = () => {
    clickVideo({ parameters });
  };

  const handleScreenToggle = () => {
    clickScreenShare({ parameters });
  };

  const showCustomAlert = () => {
    showAlert?.({
      message: 'Hello from your custom MediaSFU interface!',
      type: 'success'
    });
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🎥 Custom MediaSFU</h1>
          <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
            Room: {roomName} | User: {member}
          </p>
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          {eventType} | {participants.length} participants
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {['controls', 'participants'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              border: 'none',
              background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '16px',
              borderBottom: activeTab === tab ? '3px solid white' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
        {activeTab === 'controls' ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Media Controls</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Audio Control */}
              <button
                onClick={handleAudioToggle}
                style={{
                  padding: '20px',
                  border: 'none',
                  borderRadius: '12px',
                  background: micAction ? '#4CAF50' : '#f44336',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s',
                  minHeight: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '32px' }}>{micAction ? '🎤' : '🔇'}</div>
                <div>{micAction ? 'Mute Audio' : 'Unmute Audio'}</div>
              </button>

              {/* Video Control */}
              <button
                onClick={handleVideoToggle}
                style={{
                  padding: '20px',
                  border: 'none',
                  borderRadius: '12px',
                  background: videoAction ? '#4CAF50' : '#f44336',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s',
                  minHeight: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '32px' }}>{videoAction ? '📹' : '📷'}</div>
                <div>{videoAction ? 'Stop Video' : 'Start Video'}</div>
              </button>

              {/* Screen Share Control */}
              <button
                onClick={handleScreenToggle}
                style={{
                  padding: '20px',
                  border: 'none',
                  borderRadius: '12px',
                  background: screenAction ? '#FF9800' : '#2196F3',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s',
                  minHeight: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '32px' }}>{screenAction ? '🛑' : '🖥️'}</div>
                <div>{screenAction ? 'Stop Sharing' : 'Share Screen'}</div>
              </button>

              {/* Custom Alert */}
              <button
                onClick={showCustomAlert}
                style={{
                  padding: '20px',
                  border: 'none',
                  borderRadius: '12px',
                  background: '#9C27B0',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s',
                  minHeight: '100px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '32px' }}>🔔</div>
                <div>Show Alert</div>
              </button>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3>Welcome to Your Custom Interface!</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                This is a completely custom UI built on top of MediaSFU&apos;s functionality. 
                You have full access to all MediaSFU parameters and can create any interface you want.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
              Participants ({participants.length})
            </h2>
            
            {participants.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>👥</div>
                <p style={{ fontSize: '18px', opacity: 0.8 }}>
                  No other participants in the room yet
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '15px'
              }}>
                {participants.map((participant: any, index: number) => (
                  <div
                    key={participant.id || index}
                    style={{
                      padding: '20px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: '#FF5722',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {participant.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {participant.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.7 }}>
                          {participant.islevel || 'participant'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: participant.muted ? '#f44336' : '#4CAF50',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {participant.muted ? '🔇 Muted' : '🎤 Audio'}
                      </div>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: participant.videoOn ? '#4CAF50' : '#f44336',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {participant.videoOn ? '📹 Video' : '📷 No Video'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage component
const CustomMediaSFUExample: React.FC = () => {
  return (
    <MediasfuGeneric
      // Use the custom component instead of default MediaSFU UI
      customComponent={SimpleCustomInterface}
      
      // Standard MediaSFU configuration
      credentials={{
        apiUserName: "your-api-username",
        apiKey: "your-api-key"
      }}
      localLink=""
      connectMediaSFU={true}
      returnUI={true}
      
      // You can still use other MediaSFU props as needed
      // customVideoCard={YourCustomVideoCard}
      // customAudioCard={YourCustomAudioCard}
      // etc.
    />
  );
};

export default CustomMediaSFUExample;