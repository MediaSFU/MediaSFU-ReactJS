/**
 * AdvancedPanelComponent - A React JS component for rendering an advanced panel with various configuration options.
 * @param {Object} props - The props passed to the AdvancedPanelComponent.
 * @param {Object} props.parameters - The parameters for configuring the panel.
 * @param {string} props.parameters.recordingVideoType - The selected recording video type.
 * @param {string} props.parameters.recordingDisplayType - The selected recording display type.
 * @param {string} props.parameters.recordingBackgroundColor - The selected recording background color.
 * @param {string} props.parameters.recordingNameTagsColor - The selected recording name tags color.
 * @param {string} props.parameters.recordingOrientationVideo - The selected recording video orientation.
 * @param {boolean} props.parameters.recordingNameTags - The selected recording name tags option.
 * @param {Function} props.parameters.updateRecordingVideoType - Callback to update the recording video type.
 * @param {Function} props.parameters.updateRecordingDisplayType - Callback to update the recording display type.
 * @param {Function} props.parameters.updateRecordingBackgroundColor - Callback to update the recording background color.
 * @param {Function} props.parameters.updateRecordingNameTagsColor - Callback to update the recording name tags color.
 * @param {Function} props.parameters.updateRecordingOrientationVideo - Callback to update the recording video orientation.
 * @param {Function} props.parameters.updateRecordingNameTags - Callback to update the recording name tags option.
 * @returns {React.Component} - The AdvancedPanelComponent.
 */
import React, { useEffect, useState } from 'react';

const AdvancedPanelComponent = ({ parameters }) => {
  const {
    recordingVideoType,
    recordingDisplayType,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingNameTags,
    updateRecordingVideoType,
    updateRecordingDisplayType,
    updateRecordingBackgroundColor,
    updateRecordingNameTagsColor,
    updateRecordingOrientationVideo,
    updateRecordingNameTags,
    eventType
  } = parameters;

  // State for selected orientation video
  const [selectedOrientationVideo, setSelectedOrientationVideo] = useState(recordingOrientationVideo);
  const [selectedRecordingNameTags, setSelectedRecordingNameTags] = useState(recordingNameTags);
  const [selectedRecordingVideoType, setSelectedRecordingVideoType] = useState(recordingVideoType);
  const [selectedRecordingDisplayType, setSelectedRecordingDisplayType] = useState(recordingDisplayType);


  // State for color picker modal visibility
  const [showBackgroundColorModal, setShowBackgroundColorModal] = useState(false);
  const [showNameTagsColorModal, setShowNameTagsColorModal] = useState(false);

  // State for selected color type (background color or name tags color)
  const [selectedColorType, setSelectedColorType] = useState('');

  useEffect(() => {
    setSelectedOrientationVideo(recordingOrientationVideo);
  }, [recordingOrientationVideo]);

// Handle color selection in the color picker
const onSelectColor = ({ hex }) => {

  try {
    if (showBackgroundColorModal) {
      setSelectedColorType('backgroundColor');
    } else if (showNameTagsColorModal) {
      setSelectedColorType('nameTagsColor');
    }
    handleColorChange(hex);
  } catch (error) {
    
  }
 
};

// Update the corresponding state based on the selected color type
const handleColorChange = (selectedColor,color) => {

  try {
    if (selectedColor === 'backgroundColor') {
      updateRecordingBackgroundColor(color);
    } else if (selectedColor === 'nameTagsColor') {
      updateRecordingNameTagsColor(color);
    }
  } catch (error) {
    
  }

};

  return (
    <div>
      {/* Video Type */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}}>Video Type:</label>
        <select value={selectedRecordingVideoType} onChange={(e) => {updateRecordingVideoType(e.target.value); setSelectedRecordingVideoType(e.target.value);}}>
          <option value="fullDisplay">Full Display (no background)</option>
          <option value="bestDisplay">Full Video</option>
          <option value="all">All</option>
        </select>
      </div>
      <hr />
      
      {/* Display Type */}
      {eventType !== 'broadcast' && (
        <div>
          <label style={{marginRight:'10px', fontWeight: 'bold'}}>Display Type:</label>
          <select value={selectedRecordingDisplayType} onChange={(e) => {updateRecordingDisplayType(e.target.value); setSelectedRecordingDisplayType(e.target.value);}}>
            <option value="video">Only Video Participants</option>
            <option value="videoOpt">Only Video Participants (optimized)</option>
            <option value="media">Participants with media</option>
            <option value="all">All Participants</option>
          </select>
        </div>
      )}
      <hr />

      {/* Background Color */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Background Color:</label>
        <div style={{ backgroundColor: recordingBackgroundColor, padding: '5px', marginBottom: '10px' }}>
          {recordingBackgroundColor}
        </div>
        <input type="color" value={recordingBackgroundColor} onChange={(e) => handleColorChange('backgroundColor',e.target.value)} /> <span style={{marginLeft:'10px', fontWeight: 'bold'}}>Click to select color</span> 
      </div>
      <hr />

      {/* Add name tags or not */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Add Name Tags:</label>
        <select value={selectedRecordingNameTags} onChange={(e) => {updateRecordingNameTags(e.target.value === 'true'); setSelectedRecordingNameTags(e.target.value);}}>
          <option value={true}>True</option>
          <option value={false}>False</option>
        </select>
      </div>
      <hr />

      {/* Name Tags Color */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Name Tags Color:</label>
        <div style={{ backgroundColor: recordingNameTagsColor, padding: '5px', marginBottom: '10px' }}>
          {recordingNameTagsColor}
        </div>
        <input type="color" value={recordingNameTagsColor} onChange={(e) => handleColorChange('nameTagsColor',e.target.value)} /> <span style={{marginLeft:'10px', fontWeight: 'bold'}}>Click to select color</span> 
      </div>
      <hr />

      {/* Orientation (Video) */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Orientation (Video):</label>
        <select value={selectedOrientationVideo} onChange={(e) => {
          updateRecordingOrientationVideo(e.target.value);
          setSelectedOrientationVideo(e.target.value);
        }}>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="all">All</option>
        </select>
      </div>
      <hr />
    </div>
  );
};

export default AdvancedPanelComponent;