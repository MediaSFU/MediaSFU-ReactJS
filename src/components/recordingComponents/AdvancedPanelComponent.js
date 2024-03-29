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
 * @param {Function} props.parameters.recordingAddText - The selected recording add text option.
 * @param {string} props.parameters.recordingCustomText - The selected recording custom text.
 * @param {string} props.parameters.recordingCustomTextPosition - The selected recording custom text position.
 * @param {string} props.parameters.recordingCustomTextColor - The selected recording custom text color.
 * @param {Function} props.parameters.updateRecordingVideoType - Callback to update the recording video type.
 * @param {Function} props.parameters.updateRecordingDisplayType - Callback to update the recording display type.
 * @param {Function} props.parameters.updateRecordingBackgroundColor - Callback to update the recording background color.
 * @param {Function} props.parameters.updateRecordingNameTagsColor - Callback to update the recording name tags color.
 * @param {Function} props.parameters.updateRecordingOrientationVideo - Callback to update the recording video orientation.
 * @param {Function} props.parameters.updateRecordingNameTags - Callback to update the recording name tags option.
 * @param {Function} props.parameters.updateRecordingAddText - Callback to update the recording add text option.
 * @param {Function} props.parameters.updateRecordingCustomText - Callback to update the recording custom text.
 * @param {Function} props.parameters.updateRecordingCustomTextPosition - Callback to update the recording custom text position.
 * @param {Function} props.parameters.updateRecordingCustomTextColor - Callback to update the recording custom text color.
 * @returns {React.Component} - The AdvancedPanelComponent.
 */
import React, { useEffect, useState } from 'react';

const AdvancedPanelComponent = ({ parameters }) => {
  let {
    recordingVideoType,
    recordingDisplayType,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingNameTags,
    recordingAddText,
    recordingCustomText,
    recordingCustomTextPosition,
    recordingCustomTextColor,
    updateRecordingVideoType,
    updateRecordingDisplayType,
    updateRecordingBackgroundColor,
    updateRecordingNameTagsColor,
    updateRecordingOrientationVideo,
    updateRecordingNameTags,
    updateRecordingAddText,
    updateRecordingCustomText,
    updateRecordingCustomTextPosition,
    updateRecordingCustomTextColor,
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

  //recording text 
  const [recordingText, setRecordingText] = useState(recordingAddText);
  const [customText, setCustomText] = useState(recordingCustomText);
  const [recordingPosition, setRecordingPosition] = useState(recordingCustomTextPosition);

  function validateTextInput(input) {
    // Regular expression to match alphanumeric characters and spaces, with a maximum length of 40 characters
    const regex = /^[a-zA-Z0-9\s]{1,40}$/;

    // Test the input against the regular expression
    return regex.test(input);
  }

    // Handle text change
  const handleTextChange = (value) => {
    setRecordingText(value == 'true' || value == true);
    updateRecordingAddText(value);
  };

  // Handle text input change
  const onChangeTextHandler = (text) => {
    if (text && text.length > 0) {
      if (!validateTextInput(text)) {
        return;
      }
    }

    updateRecordingCustomText(text);
    setCustomText(text);
  };

  useEffect(() => {
    setSelectedOrientationVideo(recordingOrientationVideo);
  }, [recordingOrientationVideo]);

// Handle color selection in the color picker
const onSelectColor = ({ hex }) => {

  try {
    if (showBackgroundColorModal) {
      setSelectedColorType('backgroundColor');
    } else if ('customTextColor') {
      setSelectedColorType('customTextColor');
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
    } else if (selectedColor === 'customTextColor') {
      updateRecordingCustomTextColor(color);
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

      {/* Add Text */}
      <div>
        <label style={{marginRight:'10px', fontWeight: 'bold'}} >Add Text:</label>
        <select value={recordingText} onChange={(e) => handleTextChange(e.target.value)}>
          <option value={true}>True</option>
          <option value={false}>False</option>
        </select>
      </div>
      <hr />

      {/* Custom Text */}
      {recordingText && (
        <div>
          <label style={{marginRight:'10px', fontWeight: 'bold'}} >Custom Text:</label>
          <input type="text" value={customText} onChange={(e) => onChangeTextHandler(e.target.value)} />
          <hr />  
        </div>
      )}
      

      {/* Custom Text Position */}
      {recordingText && (
        <div>
          <label style={{marginRight:'10px', fontWeight: 'bold'}} >Custom Text Position:</label>
          <select value={recordingPosition} onChange={(e) => {updateRecordingCustomTextPosition(e.target.value); setRecordingPosition(e.target.value);}}>
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
          <hr />
        </div>
      )}
     

      {/* Custom Text Color */}
      {recordingText && (
        <div>
          <label style={{marginRight:'10px', fontWeight: 'bold'}} >Custom Text Color:</label>
          <div style={{ backgroundColor: recordingCustomTextColor, padding: '5px', marginBottom: '10px' }}>
            {recordingCustomTextColor}
          </div>
          <input type="color" value={recordingCustomTextColor} onChange={(e) => handleColorChange('customTextColor',e.target.value)} /> <span style={{marginLeft:'10px', fontWeight: 'bold'}}>Click to select color</span>
          <hr />
        </div>
      )}
    

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