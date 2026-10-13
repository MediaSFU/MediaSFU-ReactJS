/**
 * Per-tab memory of the room credential this tab last received, so a page reload can rejoin as the same participant.
 *
 * MediaSFU keeps a participant's 3 most recent room credentials valid (servers with participant-rejoin-v1). After a
 * reload the SDK sends the stored credential as `rejoinSecret` when it registers again, which lets the server re-admit
 * the same participant even while the old connection is still registered. If the server still refuses the name, the
 * stored credential itself is reused.
 *
 * Stored in `sessionStorage` (this tab only, cleared when the tab closes) and never longer than 24 hours. Every access
 * is guarded: without storage (SSR, React Native, privacy mode) it does nothing.
 */

export interface StoredRejoinCredential {
  roomName: string;
  userName: string;
  secret: string;
  link?: string;
  publicURL?: string;
  storedAt: number;
}

const PREFIX = "mediasfu:rejoin:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const keyFor = (roomName: string, userName: string): string =>
  `${PREFIX}${String(roomName).trim().toLowerCase()}:${String(userName).trim().toLowerCase()}`;

const storage = (): Storage | null => {
  try {
    return typeof window !== "undefined" && window.sessionStorage ? window.sessionStorage : null;
  } catch {
    return null;
  }
};

export const rememberRejoinCredential = (credential: Omit<StoredRejoinCredential, "storedAt">): void => {
  const store = storage();
  if (!store || !credential?.roomName || !credential?.userName || typeof credential.secret !== "string") return;
  if (!/^[a-f0-9]{64}$/i.test(credential.secret)) return;
  try {
    store.setItem(keyFor(credential.roomName, credential.userName), JSON.stringify({ ...credential, storedAt: Date.now() }));
  } catch {
    // Storage full or blocked: rejoin falls back to a fresh registration.
  }
};

export const readRejoinCredential = (roomName?: string, userName?: string): StoredRejoinCredential | null => {
  const store = storage();
  if (!store || !roomName || !userName) return null;
  try {
    const raw = store.getItem(keyFor(roomName, userName));
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredRejoinCredential;
    if (!value || typeof value.secret !== "string" || Date.now() - Number(value.storedAt || 0) > MAX_AGE_MS) {
      store.removeItem(keyFor(roomName, userName));
      return null;
    }
    return value;
  } catch {
    return null;
  }
};

export const forgetRejoinCredential = (roomName?: string, userName?: string): void => {
  const store = storage();
  if (!store || !roomName || !userName) return;
  try {
    store.removeItem(keyFor(roomName, userName));
  } catch {
    // Nothing to do.
  }
};
