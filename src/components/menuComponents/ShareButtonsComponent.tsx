import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEnvelope, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { EventType } from "../../@types/types";

// Define interface for custom share buttons
export interface ShareButton {
  icon: IconDefinition;
  action: () => void;
  show: boolean;
  color?: string;
  iconColor?: string;
}

// Define props interface
export interface ShareButtonsComponentOptions {
  meetingID: string;
  shareButtons?: ShareButton[];
  eventType: EventType;
}

export type ShareButtonsComponentType = (options: ShareButtonsComponentOptions) => JSX.Element;

/**
 * ShareButtonsComponent is a React functional component that renders a set of share buttons.
 * These buttons allow users to share a meeting link via various platforms such as clipboard, email, Facebook, WhatsApp, and Telegram.
 *
 * @param {ShareButtonsComponentOptions} props - The properties for the component.
 * @param {string} props.meetingID - The unique identifier for the meeting.
 * @param {ShareButton[]} [props.shareButtons=[]] - An optional array of share buttons to display. If not provided, default share buttons will be used.
 * @param {string} props.eventType - The type of event, which can be "chat", "broadcast", or "meeting". This determines the URL structure for sharing.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ShareButtonsComponent: React.FC<ShareButtonsComponentOptions> = ({
  meetingID,
  shareButtons = [],
  eventType,
}) => {
  const shareName =
    eventType === "chat"
      ? "chat"
      : eventType === "broadcast"
      ? "broadcast"
      : "meeting";

  const defaultShareButtons: ShareButton[] = [
    {
      icon: faCopy,
      action: async () => {
        // Action for the copy button
        try {
          await navigator.clipboard.writeText(
            `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`
          );
        } catch (error) {
          console.error("Failed to copy to clipboard", error);
        }
      },
      show: true,
    },
    {
      icon: faEnvelope,
      action: () => {
        // Action for the email button
        const emailUrl = `mailto:?subject=Join my meeting&body=Here's the link to the meeting: https://${shareName}.mediasfu.com/${shareName}/${meetingID}`;
        window.open(emailUrl, "_blank");
      },
      show: true,
    },
    {
      icon: faFacebook,
      action: () => {
        // Action for the Facebook button
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`
        )}`;
        window.open(facebookUrl, "_blank");
      },
      show: true,
    },
    {
      icon: faWhatsapp,
      action: () => {
        // Action for the WhatsApp button
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`
        )}`;
        window.open(whatsappUrl, "_blank");
      },
      show: true,
    },
    {
      icon: faTelegram,
      action: () => {
        // Action for the Telegram button
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`
        )}`;
        window.open(telegramUrl, "_blank");
      },
      show: true,
    },
  ];

  const filteredShareButtons =
    shareButtons.length > 0
      ? shareButtons.filter((button) => button.show)
      : defaultShareButtons.filter((button) => button.show);

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "10px 0" }}>
      {filteredShareButtons.map((button, index) => (
        <div
          key={index}
          onClick={button.action}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 5,
            margin: "0 5px",
            backgroundColor: button.color || "black",
            marginRight: index !== filteredShareButtons.length - 1 ? 10 : 0,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={button.icon}
            style={{ color: button.iconColor || "#ffffff", fontSize: 24 }}
          />
        </div>
      ))}
    </div>
  );
};

export default ShareButtonsComponent;
