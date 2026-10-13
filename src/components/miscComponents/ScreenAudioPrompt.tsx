import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { ScreenAudioChoice } from "../../consumers/screenAudio";

export interface ScreenAudioPromptOptions {
  /** Called once with the user's answer: `audio`, `video` (screen only) or `null` (cancelled). */
  onChoose: (choice: ScreenAudioChoice) => void;
  /** Dark styling (default: follows the system colour scheme). */
  isDarkMode?: boolean;
  title?: string;
  message?: string;
  shareWithAudioLabel?: string;
  shareWithAudioHint?: string;
  shareScreenOnlyLabel?: string;
  shareScreenOnlyHint?: string;
  cancelLabel?: string;
  /** Small note under the choices (e.g. where the browser's own audio switch is). */
  footnote?: string;
  /** Badge on the audio choice; empty string hides it. */
  recommendedLabel?: string;
}

export type ScreenAudioPromptType = (options: ScreenAudioPromptOptions) => React.JSX.Element;

const prefersDark = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const STYLE_ID = "mediasfu-screen-audio-prompt-style";
const KEYFRAMES = `
@keyframes mediasfuSapFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mediasfuSapRise { from { opacity: 0; transform: translateY(12px) scale(.97) } to { opacity: 1; transform: none } }
[data-screen-audio-prompt="true"] [data-choice]:focus-visible,
[data-screen-audio-prompt="true"] button:focus-visible { outline: 2px solid var(--sap-accent); outline-offset: 2px }
@media (prefers-reduced-motion: reduce) {
  [data-screen-audio-prompt="true"], [data-screen-audio-prompt="true"] [role="dialog"] { animation: none !important }
}`;

const ensureKeyframes = () => {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
};

const SpeakerIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill={color} />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ScreenIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="12" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M9 20h6M12 16.5V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Asks whether a screen share should include the audio of the shared tab or screen. The browser's own picker opens
 * after the choice, so the user still decides what to share there.
 *
 * @example
 * ```tsx
 * <ScreenAudioPrompt onChoose={(choice) => console.log(choice)} />
 * ```
 */
const ScreenAudioPrompt: React.FC<ScreenAudioPromptOptions> = ({
  onChoose,
  isDarkMode,
  title = "Share audio too?",
  message = "Include the sound from what you share, such as a video or music.",
  shareWithAudioLabel = "Screen + audio",
  shareWithAudioHint = "Everyone hears the tab or screen you share",
  shareScreenOnlyLabel = "Screen only",
  shareScreenOnlyHint = "Share the picture without its sound",
  cancelLabel = "Cancel",
  footnote = "Your browser asks what to share next. For a tab, keep “Share tab audio” on.",
  recommendedLabel = "Recommended",
}) => {
  const primaryRef = useRef<HTMLButtonElement | null>(null);
  const [hovered, setHovered] = useState<"audio" | "video" | null>(null);
  const dark = isDarkMode ?? prefersDark();

  useEffect(() => {
    ensureKeyframes();
    primaryRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChoose(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onChoose]);

  // Slate surfaces and a teal accent (the Modern UI's neutral palette, no indigo).
  const c = dark
    ? {
        scrim: "rgba(2, 6, 23, 0.62)", panel: "rgba(15, 23, 42, 0.94)", border: "rgba(148, 163, 184, 0.18)",
        text: "#f1f5f9", muted: "#94a3b8", tile: "rgba(30, 41, 59, 0.75)", tileBorder: "rgba(148, 163, 184, 0.16)",
        accent: "#2dd4bf", accentSoft: "rgba(45, 212, 191, 0.14)", accentLine: "rgba(45, 212, 191, 0.55)",
        icon: "#cbd5e1", shadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
      }
    : {
        scrim: "rgba(15, 23, 42, 0.38)", panel: "rgba(255, 255, 255, 0.97)", border: "rgba(15, 23, 42, 0.08)",
        text: "#0f172a", muted: "#64748b", tile: "#f8fafc", tileBorder: "rgba(15, 23, 42, 0.08)",
        accent: "#0d9488", accentSoft: "rgba(13, 148, 136, 0.09)", accentLine: "rgba(13, 148, 136, 0.5)",
        icon: "#475569", shadow: "0 24px 64px rgba(15, 23, 42, 0.22)",
      };

  const tile = (choice: "audio" | "video"): React.CSSProperties => {
    const featured = choice === "audio";
    const active = hovered === choice;
    return {
      display: "flex",
      alignItems: "center",
      gap: 14,
      width: "100%",
      textAlign: "left",
      padding: "14px 16px",
      borderRadius: 14,
      cursor: "pointer",
      font: "inherit",
      color: c.text,
      background: featured || active ? c.accentSoft : c.tile,
      border: `1px solid ${featured || active ? c.accentLine : c.tileBorder}`,
      boxShadow: active ? `0 0 0 3px ${c.accentSoft}` : "none",
      transform: active ? "translateY(-1px)" : "none",
      transition: "background .15s ease, border-color .15s ease, box-shadow .15s ease, transform .15s ease",
    };
  };

  const iconWell = (choice: "audio" | "video"): React.CSSProperties => ({
    flex: "0 0 auto",
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: choice === "audio" ? c.accent : c.tile,
    border: choice === "audio" ? "none" : `1px solid ${c.tileBorder}`,
  });

  return (
    <div
      data-screen-audio-prompt="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onChoose(null);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: c.scrim,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "mediasfuSapFade .18s ease-out",
        ["--sap-accent" as any]: c.accent,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mediasfu-screen-audio-title"
        aria-describedby="mediasfu-screen-audio-message"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 400,
          borderRadius: 20,
          padding: "22px 20px 18px",
          background: c.panel,
          color: c.text,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadow,
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          fontFamily: "inherit",
          animation: "mediasfuSapRise .22s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <button
          type="button"
          aria-label={cancelLabel}
          data-close="true"
          onClick={() => onChoose(null)}
          style={{
            position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 10, border: "none",
            background: "transparent", display: "grid", placeItems: "center", cursor: "pointer",
          }}
        >
          <CloseIcon color={c.muted} />
        </button>

        <h2 id="mediasfu-screen-audio-title" style={{ margin: "0 36px 6px 2px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        <p id="mediasfu-screen-audio-message" style={{ margin: "0 0 16px 2px", fontSize: 14, lineHeight: 1.5, color: c.muted }}>
          {message}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            ref={primaryRef}
            data-choice="audio"
            style={tile("audio")}
            onMouseEnter={() => setHovered("audio")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChoose("audio")}
          >
            <span style={iconWell("audio")}><SpeakerIcon color={dark ? "#042f2e" : "#ffffff"} /></span>
            <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 650 }}>
                {shareWithAudioLabel}
                {recommendedLabel ? (
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                    color: c.accent, background: c.accentSoft, border: `1px solid ${c.accentLine}`,
                  }}>{recommendedLabel}</span>
                ) : null}
              </span>
              <span style={{ fontSize: 13, color: c.muted }}>{shareWithAudioHint}</span>
            </span>
          </button>

          <button
            type="button"
            data-choice="video"
            style={tile("video")}
            onMouseEnter={() => setHovered("video")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChoose("video")}
          >
            <span style={iconWell("video")}><ScreenIcon color={c.icon} /></span>
            <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 650 }}>{shareScreenOnlyLabel}</span>
              <span style={{ fontSize: 13, color: c.muted }}>{shareScreenOnlyHint}</span>
            </span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14 }}>
          <span style={{ fontSize: 12, lineHeight: 1.4, color: c.muted }}>{footnote}</span>
          <button
            type="button"
            data-choice="cancel"
            onClick={() => onChoose(null)}
            style={{
              flex: "0 0 auto", padding: "8px 12px", borderRadius: 10, border: "none", background: "transparent",
              color: c.muted, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface PromptScreenAudioChoiceOptions extends Omit<ScreenAudioPromptOptions, "onChoose"> {
  /** Replace the default dialog (same contract). */
  promptComponent?: React.ComponentType<ScreenAudioPromptOptions>;
}

/**
 * Shows the screen-audio choice and resolves with the answer. Call it from the click that starts the screen share:
 * the dialog's own click then starts `getDisplayMedia`.
 */
export const promptScreenAudioChoice = (options: PromptScreenAudioChoiceOptions = {}): Promise<ScreenAudioChoice> =>
  new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve("video");
      return;
    }
    const host = document.createElement("div");
    host.setAttribute("data-screen-audio-prompt-root", "true");
    document.body.appendChild(host);
    const root = createRoot(host);
    let settled = false;
    const { promptComponent: Prompt = ScreenAudioPrompt, ...rest } = options;
    const finish = (choice: ScreenAudioChoice) => {
      if (settled) return;
      settled = true;
      resolve(choice);
      setTimeout(() => {
        root.unmount();
        host.remove();
      }, 0);
    };
    root.render(<Prompt {...rest} onChoose={finish} />);
  });

export default ScreenAudioPrompt;
