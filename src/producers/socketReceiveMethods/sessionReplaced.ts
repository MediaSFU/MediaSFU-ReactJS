import { ShowAlert } from "../../@types/types";

/**
 * Payload of the media server's `session-replaced` event (servers with participant-rejoin-v1): this connection was
 * taken over by a newer one of the same participant (another tab, device or a reload). The server closes this
 * connection right after sending it.
 */
export interface SessionReplacedData {
  roomName?: string;
  member?: string;
  /** "joined-elsewhere" (a newer connection took over) or "newer-session" (this join was older than the current one). */
  reason?: string;
  sessionSeq?: number | null;
}

export interface SessionReplacedOptions {
  data?: SessionReplacedData;
  showAlert?: ShowAlert;
  /** Takes the session over deliberately. Default: reload the page, which rejoins as this participant. */
  useThisOne?: () => void;
}

export type SessionReplacedType = (options: SessionReplacedOptions) => Promise<void>;

export const SESSION_REPLACED_MESSAGE = "You joined from another tab or device.";
export const SESSION_REPLACED_EVENT = "mediasfu:session-replaced";

const BANNER_ID = "mediasfu-session-replaced";
let replacedAt = 0;

/**
 * True shortly after `session-replaced` arrived. The disconnect that follows is then expected: no generic
 * "disconnected" alert, no redirect, and never an automatic rejoin (which would push the other tab out in turn).
 */
export const wasSessionReplaced = (withinMs = 15000): boolean => replacedAt > 0 && Date.now() - replacedAt < withinMs;

const reloadPage = (): void => {
  try {
    window.location.reload();
  } catch {
    // Not in a browser: the app decides through the event or `useThisOne`.
  }
};

/**
 * Handles `session-replaced`: shows "You joined from another tab or device." with a "Use this one" action and does
 * not rejoin on its own.
 *
 * Apps can show their own UI instead: listen for the cancelable `mediasfu:session-replaced` window event and call
 * `preventDefault()`. Its `detail` carries the payload, `message` and `useThisOne()`.
 *
 * @example
 * ```typescript
 * socket.on("session-replaced", (data) => sessionReplaced({ data, showAlert }));
 * ```
 */
export const sessionReplaced = async ({ data, showAlert, useThisOne }: SessionReplacedOptions): Promise<void> => {
  replacedAt = Date.now();
  const takeOver = useThisOne || reloadPage;

  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
    const event = new CustomEvent(SESSION_REPLACED_EVENT, {
      cancelable: true,
      detail: { ...(data || {}), message: SESSION_REPLACED_MESSAGE, useThisOne: takeOver },
    });
    if (!window.dispatchEvent(event)) return;
  }

  if (typeof document === "undefined" || !document.body) {
    showAlert?.({ message: SESSION_REPLACED_MESSAGE, type: "danger", duration: 10000 });
    return;
  }
  if (document.getElementById(BANNER_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = BANNER_ID;
  overlay.setAttribute("role", "alertdialog");
  overlay.setAttribute("aria-live", "assertive");
  overlay.setAttribute("aria-label", SESSION_REPLACED_MESSAGE);
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;" +
    "background:rgba(15,23,42,0.55);padding:16px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;";

  const card = document.createElement("div");
  card.style.cssText =
    "max-width:360px;width:100%;background:#ffffff;color:#0f172a;border-radius:12px;padding:20px;" +
    "box-shadow:0 12px 32px rgba(15,23,42,0.25);text-align:center;";

  const text = document.createElement("p");
  text.textContent = SESSION_REPLACED_MESSAGE;
  text.style.cssText = "margin:0 0 6px;font-size:16px;font-weight:600;line-height:1.4;";

  const hint = document.createElement("p");
  hint.textContent = "This window left the room so the other one could stay.";
  hint.style.cssText = "margin:0 0 16px;font-size:14px;color:#475569;line-height:1.4;";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Use this one";
  button.style.cssText =
    "background:#0d9488;color:#ffffff;border:0;border-radius:8px;padding:10px 18px;font-size:15px;" +
    "font-weight:600;cursor:pointer;";
  button.addEventListener("click", () => {
    overlay.remove();
    replacedAt = 0;
    takeOver();
  });

  card.appendChild(text);
  card.appendChild(hint);
  card.appendChild(button);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  try {
    button.focus();
  } catch {
    // Focus is best effort.
  }
};
