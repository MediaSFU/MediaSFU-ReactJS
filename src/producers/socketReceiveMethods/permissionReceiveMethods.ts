/**
 * Handler for permission-related socket events.
 * Listens for:
 * - permissionUpdated: When a user's permission level changes
 * - permissionConfigUpdated: When the room's permission configuration changes
 */

import { ShowAlert } from '../../@types/types';

export interface PermissionUpdatedData {
  newLevel: string;
  message?: string;
}

export interface PermissionCapabilities {
  useMic: 'allow' | 'approval' | 'disallow';
  useCamera: 'allow' | 'approval' | 'disallow';
  useScreen: 'allow' | 'approval' | 'disallow';
  useChat: 'allow' | 'disallow';
}

export interface PermissionConfig {
  level0: PermissionCapabilities;
  level1: PermissionCapabilities;
}

export interface PermissionConfigUpdatedData {
  config: PermissionConfig;
}

export interface PermissionUpdatedOptions {
  data: PermissionUpdatedData;
  showAlert?: ShowAlert;
  updateIslevel?: (level: string) => void;
}

export interface PermissionConfigUpdatedOptions {
  data: PermissionConfigUpdatedData;
  updatePermissionConfig?: (config: PermissionConfig) => void;
}

export type PermissionUpdatedType = (options: PermissionUpdatedOptions) => Promise<void>;
export type PermissionConfigUpdatedType = (options: PermissionConfigUpdatedOptions) => Promise<void>;

/**
 * Handles the permissionUpdated socket event.
 * Called when the host changes a participant's permission level.
 * 
 * @param options - The event options.
 * @param options.data - The permission update data.
 * @param options.showAlert - Optional alert function.
 * @param options.updateIslevel - Function to update local islevel state.
 * 
 * @example
 * ```typescript
 * socket.on("permissionUpdated", async (data: PermissionUpdatedData) => {
 *   await permissionUpdated({
 *     data,
 *     showAlert,
 *     updateIslevel,
 *   });
 * });
 * ```
 */
export const permissionUpdated = async ({
  data,
  showAlert,
  updateIslevel,
}: PermissionUpdatedOptions): Promise<void> => {
  try {
    const { newLevel, message } = data;

    // Update local permission level
    if (updateIslevel) {
      updateIslevel(newLevel);
    }

    // Show notification
    if (showAlert && message) {
      showAlert({
        message,
        type: newLevel === '1' ? 'success' : 'info',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error handling permissionUpdated:', error);
  }
};

/**
 * Handles the permissionConfigUpdated socket event.
 * Called when the host changes the room's permission configuration.
 * 
 * @param options - The event options.
 * @param options.data - The permission config update data.
 * @param options.updatePermissionConfig - Function to update local permission config state.
 * 
 * @example
 * ```typescript
 * socket.on("permissionConfigUpdated", async (data: PermissionConfigUpdatedData) => {
 *   await permissionConfigUpdated({
 *     data,
 *     updatePermissionConfig,
 *   });
 * });
 * ```
 */
export const permissionConfigUpdated = async ({
  data,
  updatePermissionConfig,
}: PermissionConfigUpdatedOptions): Promise<void> => {
  try {
    const { config } = data;

    // Update local permission config
    if (updatePermissionConfig) {
      updatePermissionConfig(config);
    }
  } catch (error) {
    console.error('Error handling permissionConfigUpdated:', error);
  }
};
