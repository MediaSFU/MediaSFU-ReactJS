/**
 * Consumer backup preference (server feature consumer-backup-v1).
 *
 * When a consuming node gets busy, the server attaches a backup node and tells every listener
 * `alt_domains: { <busy node>: <backup node> }`. Listeners stay on the busy node for what they already receive, but a
 * stream announced after that is taken from the backup: when the busy node announces it and the backup is connected,
 * the client waits briefly for the backup's own announcement (the backup gets each new stream a moment later) and only
 * falls back to the busy node if it does not come. Consumption is de-duplicated by producer id, so whichever node is
 * used first wins and the other announcement is ignored.
 *
 * The request is never sent to the backup for a stream the backup has not announced: a consume the backup cannot serve
 * fails without an error and the de-duplication would then skip the busy node's copy (staging test, Oct 9 2026).
 */
const backupByParent = new Map<string, string>();

/** How long a busy node's announcement waits for the backup's (ms). */
export const CONSUMER_BACKUP_PREFER_DELAY_MS = 1500;

/** Records the server's `{ busy node: backup node }` map (from `updateConsumingDomains` / `getDomains`). */
export const rememberConsumerBackups = (altDomains?: Record<string, string> | null): void => {
  for (const [parent, backup] of Object.entries(altDomains || {})) {
    if (parent && backup && parent !== backup) backupByParent.set(parent, backup);
  }
};

export const forgetConsumerBackups = (): void => backupByParent.clear();

type SocketEntry = Record<string, { connected?: boolean } | undefined>;

/** The connected backup to prefer over `ip`, or null. */
export const preferredConsumerBackup = (ip: string, consumeSockets?: SocketEntry[] | null): string | null => {
  const backup = backupByParent.get(ip);
  if (!backup) return null;
  const connected = (consumeSockets || []).some((entry) => {
    const socket = entry?.[backup];
    return Boolean(socket) && socket!.connected !== false;
  });
  return connected ? backup : null;
};

/** Delay (ms) before consuming a stream announced by `ip`: non-zero only when a connected backup should win. */
export const consumerBackupPreferDelay = (ip: string, consumeSockets?: SocketEntry[] | null): number =>
  preferredConsumerBackup(ip, consumeSockets) ? CONSUMER_BACKUP_PREFER_DELAY_MS : 0;
