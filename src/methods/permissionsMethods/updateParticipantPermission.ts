import { Socket } from "socket.io-client";
import { Participant, ShowAlert } from "../../@types/types";

/**
 * Permission level values:
 * - "2": Host (full permissions, cannot be changed)
 * - "1": Co-host/Elevated (extended permissions)
 * - "0": Participant (basic permissions)
 */
export type PermissionLevel = "0" | "1" | "2";

export interface UpdateParticipantPermissionOptions {
  socket: Socket;
  participant: Participant;
  newLevel: PermissionLevel;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
}

export interface BulkUpdateParticipantPermissionsOptions {
  socket: Socket;
  participants: Participant[];
  newLevel: PermissionLevel;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
  maxBatchSize?: number; // Default 50
}

// Export type definitions
export type UpdateParticipantPermissionType = (
  options: UpdateParticipantPermissionOptions
) => Promise<void>;

export type BulkUpdateParticipantPermissionsType = (
  options: BulkUpdateParticipantPermissionsOptions
) => Promise<void>;

/**
 * Updates a single participant's permission level.
 * Only hosts (islevel === "2") can update permissions.
 * Cannot change a host's permission level.
 *
 * @param {UpdateParticipantPermissionOptions} options - Options for updating permission.
 *
 * @example
 * ```typescript
 * await updateParticipantPermission({
 *   socket,
 *   participant: { id: "123", name: "John", islevel: "0" },
 *   newLevel: "1",
 *   member: "currentUser",
 *   islevel: "2",
 *   roomName: "room123",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const updateParticipantPermission = async ({
  socket,
  participant,
  newLevel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  roomName,
  showAlert,
}: UpdateParticipantPermissionOptions): Promise<void> => {
  // Only hosts can update permissions
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can update participant permissions",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  // Cannot change host's permission
  if (participant.islevel === "2") {
    showAlert?.({
      message: "Cannot change the host's permission level",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  // Don't emit if level is the same
  if (participant.islevel === newLevel) {
    return;
  }

  return new Promise<void>((resolve) => {
    socket.emit(
      "updateParticipantPermission",
      {
        participantId: participant.id,
        participantName: participant.name,
        newLevel,
        roomName,
      },
      (response: { success: boolean; reason?: string }) => {
        if (!response?.success) {
          showAlert?.({
            message: response?.reason || "Failed to update permission",
            type: "danger",
            duration: 3000,
          });
        }
        resolve();
      }
    );
  });
};

/**
 * Updates multiple participants' permission levels in bulk.
 * Only hosts (islevel === "2") can update permissions.
 * Processes in batches (default max 50 at a time).
 *
 * @param {BulkUpdateParticipantPermissionsOptions} options - Options for bulk updating permissions.
 *
 * @example
 * ```typescript
 * await bulkUpdateParticipantPermissions({
 *   socket,
 *   participants: [participant1, participant2],
 *   newLevel: "0",
 *   member: "currentUser",
 *   islevel: "2",
 *   roomName: "room123",
 *   showAlert: (alert) => console.log(alert.message),
 *   maxBatchSize: 50,
 * });
 * ```
 */
export const bulkUpdateParticipantPermissions = async ({
  socket,
  participants,
  newLevel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  roomName,
  showAlert,
  maxBatchSize = 50,
}: BulkUpdateParticipantPermissionsOptions): Promise<void> => {
  // Only hosts can update permissions
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can update participant permissions",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  // Filter out hosts and participants already at the target level
  const eligibleParticipants = participants.filter(
    (p) => p.islevel !== "2" && p.islevel !== newLevel
  );

  if (eligibleParticipants.length === 0) {
    showAlert?.({
      message: "No participants to update",
      type: "info",
      duration: 3000,
    });
    return;
  }

  // Limit to maxBatchSize
  const batch = eligibleParticipants.slice(0, maxBatchSize);

  return new Promise<void>((resolve) => {
    socket.emit(
      "bulkUpdateParticipantPermissions",
      {
        updates: batch.map((p) => ({
          participantId: p.id,
          participantName: p.name,
          newLevel,
        })),
        roomName,
      },
      (response: { success: boolean; reason?: string; successCount?: number; failedIds?: string[] }) => {
        if (!response?.success) {
          showAlert?.({
            message: response?.reason || "Failed to update permissions",
            type: "danger",
            duration: 3000,
          });
        } else if (eligibleParticipants.length > maxBatchSize) {
          showAlert?.({
            message: `Updated ${batch.length} participants. ${eligibleParticipants.length - maxBatchSize} remaining.`,
            type: "info",
            duration: 3000,
          });
        }
        resolve();
      }
    );
  });
};
