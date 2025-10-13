import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faCopy, faEnvelope, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { EventType } from "../../@types/types";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

// Define interface for custom share buttons
export interface ShareButton {
  icon: IconDefinition;
  action: () => void | Promise<void>;
  show: boolean;
  color?: string;
  iconColor?: string;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  iconProps?: Partial<FontAwesomeIconProps>;
}

// Define props interface
export interface ShareButtonsComponentOptions {
  meetingID: string;
  shareButtons?: ShareButton[];
  eventType: EventType;
  localLink?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    buttons: ShareButton[];
    shareUrl: string;
  }) => React.ReactNode;
  renderButtons?: (options: {
    defaultButtons: React.ReactNode[];
    buttons: ShareButton[];
    shareUrl: string;
  }) => React.ReactNode;
  renderButton?: (options: {
    defaultButton: React.ReactNode;
    button: ShareButton;
    index: number;
    shareUrl: string;
  }) => React.ReactNode;
  renderIcon?: (options: {
    defaultIcon: React.ReactNode;
    button: ShareButton;
    shareUrl: string;
  }) => React.ReactNode;
  getShareUrl?: (options: {
    meetingID: string;
    eventType: EventType;
    localLink?: string;
  }) => string;
}

export type ShareButtonsComponentType = (options: ShareButtonsComponentOptions) => React.JSX.Element;

/**
 * ShareButtonsComponent is a React functional component that renders a set of share buttons.
 * These buttons allow users to share a meeting link via various platforms such as clipboard, email, Facebook, WhatsApp, and Telegram.
 *
 * @param {ShareButtonsComponentOptions} props - The properties for the component.
 * @param {string} props.meetingID - The unique identifier for the meeting.
 * @param {ShareButton[]} [props.shareButtons=[]] - An optional array of share buttons to display. If not provided, default share buttons will be used.
 * @param {EventType} props.eventType - The type of event, which can be "chat", "broadcast", or "meeting". This determines the URL structure for sharing.
 * @param {string} [props.localLink=""] - An optional local link to use for sharing the event.
 *
 * @returns {React.JSX.Element} The rendered component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { ShareButtonsComponent } from 'mediasfu-reactjs';
 * import { faTwitter } from '@fortawesome/free-brands-svg-icons';
 * 
 * const customShareButtons = [
 *   {
 *     icon: faTwitter,
 *     action: () => window.open("https://twitter.com/intent/tweet?text=Join+my+meeting!", "_blank"),
 *     show: true,
 *     color: "#1DA1F2",
 *     iconColor: "#ffffff",
 *   },
 * ];
 * 
 * const App = () => (
 *   <ShareButtonsComponent 
 *     meetingID="1234567890" 
 *     eventType="meeting" 
 *     shareButtons={customShareButtons} 
 *     localLink="https://example.com/meeting"
 *   />
 * );
 * 
 * export default App;
 * ```
 */

const ShareButtonsComponent: React.FC<ShareButtonsComponentOptions> = ({
  meetingID,
  shareButtons = [],
  eventType,
  localLink = "",
  containerProps,
  renderContainer,
  renderButtons,
  renderButton,
  renderIcon,
  getShareUrl,
}) => {
  const shareUrl = useMemo(() => {
    if (getShareUrl) {
      return getShareUrl({ meetingID, eventType, localLink });
    }

    const shareName =
      eventType === "chat"
        ? "chat"
        : eventType === "broadcast"
        ? "broadcast"
        : "meeting";

    if (localLink && !localLink.includes("mediasfu.com")) {
      return `${localLink}/meeting/${meetingID}`;
    }
    return `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`;
  }, [eventType, getShareUrl, localLink, meetingID]);

  const defaultShareButtons: ShareButton[] = [
    {
      icon: faCopy,
      action: async () => {
        // Action for the copy button
        try {
          await navigator.clipboard.writeText(shareUrl);
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
  const emailUrl = `mailto:?subject=Join my meeting&body=Here's the link to the meeting: ${shareUrl}`;
        window.open(emailUrl, "_blank");
      },
      show: true,
    },
    {
      icon: faFacebook,
      action: () => {
        // Action for the Facebook button
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
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
          shareUrl
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
          shareUrl
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

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const buttonNodes = filteredShareButtons.map((button, index) => {
    const {
      wrapperProps,
      iconProps,
      icon,
      color,
      iconColor,
    } = button;

    const {
      className: wrapperClassName,
      style: wrapperStyleOverrides,
      onClick: wrapperOnClick,
      ...restWrapperProps
    } = wrapperProps ?? {};

    const {
      className: iconClassName,
      style: iconStyleOverrides,
      icon: iconOverride,
      ...restIconProps
    } = iconProps ?? {};

    const iconNodeDefault = (
      <FontAwesomeIcon
        icon={(iconOverride as FontAwesomeIconProps["icon"]) ?? icon}
        className={joinClassNames(undefined, iconClassName)}
        style={{
          color: iconColor ?? iconStyleOverrides?.color ?? "#ffffff",
          fontSize: 24,
          ...iconStyleOverrides,
        }}
        {...restIconProps}
      />
    );

    const iconNode = renderIcon
      ? renderIcon({
          defaultIcon: iconNodeDefault,
          button,
          shareUrl,
        })
      : iconNodeDefault;

    const defaultButton = (
      <div
        className={joinClassNames("share-button", wrapperClassName)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          borderRadius: 5,
          margin: "0 5px",
          backgroundColor: color || "black",
          marginRight: index !== filteredShareButtons.length - 1 ? 10 : 0,
          cursor: "pointer",
          ...wrapperStyleOverrides,
        }}
        onClick={async (event) => {
          await Promise.resolve(wrapperOnClick?.(event));
          if (!event.defaultPrevented) {
            await Promise.resolve(button.action());
          }
        }}
        {...restWrapperProps}
      >
        {iconNode}
      </div>
    );

    const renderedButton = renderButton
      ? renderButton({
          defaultButton,
          button,
          index,
          shareUrl,
        })
      : defaultButton;

    return <React.Fragment key={index}>{renderedButton}</React.Fragment>;
  });

  const buttonsContent = renderButtons
    ? renderButtons({
        defaultButtons: buttonNodes,
        buttons: filteredShareButtons,
        shareUrl,
      })
    : buttonNodes;

  const containerNode = (
    <div
      className={joinClassNames(
        "mediasfu-shareButtonsContainer",
        containerClassName
      )}
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "10px 0",
        ...containerStyleOverrides,
      }}
      {...restContainerProps}
    >
      {buttonsContent}
    </div>
  );

  return renderContainer
    ? renderContainer({
        defaultContainer: containerNode,
        buttons: filteredShareButtons,
        shareUrl,
      })
    : containerNode;
};

export default ShareButtonsComponent;
