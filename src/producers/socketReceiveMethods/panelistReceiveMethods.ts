/**
 * Handler for panelist-related socket events.
 * Listens for:
 * - panelistsUpdated: When the panelist list changes
 * - addedAsPanelist: When current user is added as a panelist
 * - removedFromPanelists: When current user is removed from panelists
 * - panelistFocusChanged: When focus mode is toggled
 * - controlMedia: When media is controlled (mute) due to focus mode
 */

import { ShowAlert, Participant } from '../../@types/types';

export interface PanelistData {
  id: string;
  name: string;
}

export interface PanelistsUpdatedData {
  panelists: PanelistData[];
}

export interface PanelistFocusChangedData {
  focusEnabled: boolean;
  panelists: PanelistData[];
  muteOthersMic: boolean;
  muteOthersCamera: boolean;
}

export interface ControlMediaData {
  type: 'audio' | 'video';
  action: 'mute' | 'unmute';
  reason?: string;
}

export interface AddedAsPanelistData {
  message: string;
}

export interface RemovedFromPanelistsData {
  message: string;
}

export interface PanelistsUpdatedOptions {
  data: PanelistsUpdatedData;
  updatePanelists?: (panelists: Participant[]) => void;
}

export interface PanelistFocusChangedOptions {
  data: PanelistFocusChangedData;
  updatePanelistsFocused?: (focused: boolean) => void;
  updateMuteOthersMic?: (mute: boolean) => void;
  updateMuteOthersCamera?: (mute: boolean) => void;
  updatePanelists?: (panelists: Participant[]) => void;
  // Optional: current values to compare for triggering onScreenChanges
  currentPanelistsFocused?: boolean;
  currentPanelists?: Participant[];
  // Optional: callback to trigger screen rerender when focus/panelists change
  onScreenChanges?: () => Promise<void>;
}

export interface ControlMediaOptions {
  data: ControlMediaData;
  showAlert?: ShowAlert;
  // Methods to control local media
  clickAudio?: () => void;
  clickVideo?: () => void;
  audioAlreadyOn?: boolean;
  videoAlreadyOn?: boolean;
}

export interface AddedAsPanelistOptions {
  data: AddedAsPanelistData;
  showAlert?: ShowAlert;
}

export interface RemovedFromPanelistsOptions {
  data: RemovedFromPanelistsData;
  showAlert?: ShowAlert;
}

export type PanelistsUpdatedType = (options: PanelistsUpdatedOptions) => Promise<void>;
export type PanelistFocusChangedType = (options: PanelistFocusChangedOptions) => Promise<void>;
export type ControlMediaType = (options: ControlMediaOptions) => Promise<void>;
export type AddedAsPanelistType = (options: AddedAsPanelistOptions) => Promise<void>;
export type RemovedFromPanelistsType = (options: RemovedFromPanelistsOptions) => Promise<void>;

/**
 * Handles the panelistsUpdated socket event.
 * Called when the panelist list changes.
 * 
 * @example
 * ```typescript
 * socket.on("panelistsUpdated", async (data: PanelistsUpdatedData) => {
 *   await panelistsUpdated({
 *     data,
 *     updatePanelists,
 *   });
 * });
 * ```
 */
export const panelistsUpdated = async ({
  data,
  updatePanelists,
}: PanelistsUpdatedOptions): Promise<void> => {
  try {
    const { panelists } = data;

    // Convert PanelistData to Participant type
    if (updatePanelists) {
      const participantPanelists = panelists.map((p) => ({
        id: p.id,
        name: p.name,
        audioID: '',
        videoID: '',
      } as Participant));
      updatePanelists(participantPanelists);
    }
  } catch (error) {
    console.error('Error handling panelistsUpdated:', error);
  }
};

/**
 * Handles the panelistFocusChanged socket event.
 * Called when the host toggles focus mode on/off.
 * 
 * @example
 * ```typescript
 * socket.on("panelistFocusChanged", async (data: PanelistFocusChangedData) => {
 *   await panelistFocusChanged({
 *     data,
 *     updatePanelistsFocused,
 *     updateMuteOthersMic,
 *     updateMuteOthersCamera,
 *     updatePanelists,
 *   });
 * });
 * ```
 */
export const panelistFocusChanged = async ({
  data,
  updatePanelistsFocused,
  updateMuteOthersMic,
  updateMuteOthersCamera,
  updatePanelists,
  currentPanelistsFocused,
  currentPanelists,
  onScreenChanges,
}: PanelistFocusChangedOptions): Promise<void> => {
  try {
    const { focusEnabled, panelists, muteOthersMic, muteOthersCamera } = data;

    // Check if focus state or panelists changed (for triggering rerender)
    const focusChanged = currentPanelistsFocused !== undefined && currentPanelistsFocused !== focusEnabled;
    
    // Compare panelist lists by their IDs
    const currentPanelistIds = (currentPanelists || []).map(p => p.id).sort().join(',');
    const newPanelistIds = panelists.map(p => p.id).sort().join(',');
    const panelistsChanged = currentPanelistIds !== newPanelistIds;

    if (updatePanelistsFocused) {
      updatePanelistsFocused(focusEnabled);
    }

    if (updateMuteOthersMic) {
      updateMuteOthersMic(muteOthersMic);
    }

    if (updateMuteOthersCamera) {
      updateMuteOthersCamera(muteOthersCamera);
    }

    if (updatePanelists) {
      const participantPanelists = panelists.map((p) => ({
        id: p.id,
        name: p.name,
        audioID: '',
        videoID: '',
      } as Participant));
      updatePanelists(participantPanelists);
    }

    // Trigger screen rerender if focus or panelists changed
    if ((focusChanged || panelistsChanged) && onScreenChanges) {
      await onScreenChanges();
    }
  } catch (error) {
    console.error('Error handling panelistFocusChanged:', error);
  }
};

/**
 * Handles the controlMedia socket event.
 * Called when media needs to be controlled due to focus mode.
 * 
 * @example
 * ```typescript
 * socket.on("controlMedia", async (data: ControlMediaData) => {
 *   await controlMedia({
 *     data,
 *     showAlert,
 *     clickAudio,
 *     clickVideo,
 *     audioAlreadyOn,
 *     videoAlreadyOn,
 *   });
 * });
 * ```
 */
export const controlMedia = async ({
  data,
  showAlert,
  clickAudio,
  clickVideo,
  audioAlreadyOn,
  videoAlreadyOn,
}: ControlMediaOptions): Promise<void> => {
  try {
    const { type, action, reason } = data;

    if (action === 'mute') {
      if (type === 'audio' && audioAlreadyOn && clickAudio) {
        clickAudio();
      } else if (type === 'video' && videoAlreadyOn && clickVideo) {
        clickVideo();
      }

      if (showAlert && reason) {
        showAlert({
          message: `Your ${type === 'audio' ? 'microphone' : 'camera'} has been muted. ${reason}`,
          type: 'info',
          duration: 3000,
        });
      }
    }
  } catch (error) {
    console.error('Error handling controlMedia:', error);
  }
};

/**
 * Handles the addedAsPanelist socket event.
 * Called when current user is added as a panelist.
 */
export const addedAsPanelist = async ({
  data,
  showAlert,
}: AddedAsPanelistOptions): Promise<void> => {
  try {
    const { message } = data;

    if (showAlert) {
      showAlert({
        message: message || 'You have been added as a panelist',
        type: 'success',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error handling addedAsPanelist:', error);
  }
};

/**
 * Handles the removedFromPanelists socket event.
 * Called when current user is removed from panelists.
 */
export const removedFromPanelists = async ({
  data,
  showAlert,
}: RemovedFromPanelistsOptions): Promise<void> => {
  try {
    const { message } = data;

    if (showAlert) {
      showAlert({
        message: message || 'You have been removed from panelists',
        type: 'info',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error handling removedFromPanelists:', error);
  }
};
