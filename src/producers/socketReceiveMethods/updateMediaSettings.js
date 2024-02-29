/**
 * Update media settings for all participants by the admin.
 *
 * @param {Object} options - The options for updating media settings.
 * @param {Array} options.settings - An array containing the updated settings for audio, video, screenshare, and chat.
 * @param {Object} options.parameters - The parameters object containing update functions for audio, video, screenshare, and chat settings.
 *
 * @example
 * // Example usage of updateMediaSettings function
 * const settings = [allow, disallow, approval, allow]; // [audio, video, screenshare, chat]
 * const parameters = {
 *   updateAudioSetting: (value) => {}, // Function to update audio setting
 *   updateVideoSetting: (value) => {}, // Function to update video setting
 *   updateScreenshareSetting: (value) => {}, // Function to update screenshare setting
 *   updateChatSetting: (value) => {}, // Function to update chat setting
 * };
 * updateMediaSettings({ settings, parameters });
 */
export const updateMediaSettings = async ({ settings, parameters }) => {
    
    let {
        updateAudioSetting,
        updateVideoSetting,
        updateScreenshareSetting,
        updateChatSetting,
    } = parameters;

    const [audioSetting, videoSetting, screenshareSetting, chatSetting] =  settings;



    // Update audio setting
    await updateAudioSetting(audioSetting);
    // Update video setting
    await updateVideoSetting(videoSetting);
    // Update screenshare setting
    await updateScreenshareSetting(screenshareSetting);
    // Update chat setting
    await updateChatSetting(chatSetting);
};
