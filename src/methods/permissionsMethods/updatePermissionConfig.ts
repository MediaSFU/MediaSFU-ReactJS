import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";

/**
 * Configuration for what each permission level can do.
 * Each capability can be: "allow" | "approval" | "disallow"
 */
export interface PermissionCapabilities {
  useMic: "allow" | "approval" | "disallow";
  useCamera: "allow" | "approval" | "disallow";
  useScreen: "allow" | "approval" | "disallow";
  useChat: "allow" | "disallow";
}

/**
 * Permission configuration for all levels.
 * Level "2" (host) always has full permissions - not configurable.
 */
export interface PermissionConfig {
  level0: PermissionCapabilities; // Basic participants
  level1: PermissionCapabilities; // Elevated participants (co-hosts)
}

export interface UpdatePermissionConfigOptions {
  socket: Socket;
  config: PermissionConfig;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
}

export type UpdatePermissionConfigType = (
  options: UpdatePermissionConfigOptions
) => Promise<void>;

/**
 * Default permission configuration.
 */
export const getDefaultPermissionConfig = (): PermissionConfig => ({
  level0: {
    useMic: "approval",
    useCamera: "approval",
    useScreen: "disallow",
    useChat: "allow",
  },
  level1: {
    useMic: "allow",
    useCamera: "allow",
    useScreen: "approval",
    useChat: "allow",
  },
});

/**
 * Creates a PermissionConfig from event settings.
 * This is useful when permissionConfig is not yet set, extracting initial values
 * from the room's event settings. Both level0 and level1 will have the same initial permissions.
 *
 * @param audioSetting - 'allow' | 'approval' | 'disallow'
 * @param videoSetting - 'allow' | 'approval' | 'disallow'
 * @param screenshareSetting - 'allow' | 'approval' | 'disallow'
 * @param chatSetting - 'allow' | 'disallow'
 * @returns PermissionConfig with both levels set to the same permissions
 */
export const getPermissionConfigFromEventSettings = (
  audioSetting: string = "approval",
  videoSetting: string = "approval",
  screenshareSetting: string = "disallow",
  chatSetting: string = "allow"
): PermissionConfig => {
  const capabilities: PermissionCapabilities = {
    useMic: audioSetting as "allow" | "approval" | "disallow",
    useCamera: videoSetting as "allow" | "approval" | "disallow",
    useScreen: screenshareSetting as "allow" | "approval" | "disallow",
    useChat: (chatSetting === "allow" ? "allow" : "disallow") as "allow" | "disallow",
  };
  return {
    level0: { ...capabilities },
    level1: { ...capabilities },
  };
};

/**
 * Updates the permission configuration for the room.
 * Only hosts (islevel === "2") can update the configuration.
 *
 * @param {UpdatePermissionConfigOptions} options - Options for updating permission config.
 *
 * @example
 * ```typescript
 * await updatePermissionConfig({
 *   socket,
 *   config: {
 *     level0: { useMic: "disallow", useCamera: "disallow", useScreen: "disallow", useChat: "allow" },
 *     level1: { useMic: "allow", useCamera: "allow", useScreen: "allow", useChat: "allow" },
 *   },
 *   member: "currentUser",
 *   islevel: "2",
 *   roomName: "room123",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const updatePermissionConfig = async ({
  socket,
  config,
  islevel,
  roomName,
  showAlert,
}: UpdatePermissionConfigOptions): Promise<void> => {
  // Only hosts can update permission config
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can update permission configuration",
      type: "danger",
      duration: 3000,
    });
    return;
  }
  console.log('Emitting updatePermissionConfig with config:', config);

  return new Promise<void>((resolve) => {
    socket.emit(
      "updatePermissionConfig",
      {
        config,
        roomName,
      },
      (response: { success: boolean; reason?: string }) => {
        if (!response?.success) {
          showAlert?.({
            message: response?.reason || "Failed to update permission config",
            type: "danger",
            duration: 3000,
          });
        } else {
          showAlert?.({
            message: "Permission configuration updated",
            type: "success",
            duration: 3000,
          });
        }
        resolve();
      }
    );
  });
};
