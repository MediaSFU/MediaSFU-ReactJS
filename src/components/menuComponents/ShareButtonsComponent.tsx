import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';

/**
 * ShareButtonsComponent is a component for displaying social media share buttons.
 * 
 * @param {string} meetingID - The ID of the meeting or event to be shared.
 * @param {Array} shareButtons - An array of objects representing custom share buttons. Each object should contain an icon, action, and optionally a color and iconColor.
 * @param {string} eventType - The type of event being shared, such as 'chat', 'broadcast', or 'meeting'.
 * @returns {JSX.Element} Share buttons component.
 */

const ShareButtonsComponent = ({ meetingID, shareButtons = [], eventType }) => {
  const shareName = eventType === 'chat' ? 'chat' : eventType === 'broadcast' ? 'broadcast' : 'meeting';

  const defaultShareButtons = [
    {
      icon: faCopy,
      action: async () => {
        // Action for the copy button
        // await Clipboard.writeText(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`);
        try {
          await navigator.clipboard.writeText(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`);
        } catch (error) {
        }
      },
      show: true,
    },
    {
      icon: faEnvelope,
      action: () => {
        // Action for the email button
        const emailUrl = `mailto:?subject=Join my meeting&body=Here's the link to the meeting: https://${shareName}.mediasfu.com/${shareName}/${meetingID}`;
        window.open(emailUrl, '_blank');
      },
      show: true,
    },
    {
      icon: faFacebook,
      action: () => {
        // Action for the Facebook button
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        window.open(facebookUrl, '_blank');
      },
      show: true,
    },
    {
      icon: faWhatsapp,
      action: () => {
        // Action for the WhatsApp button
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        window.open(whatsappUrl, '_blank');
      },
      show: true,
    },
    {
      icon: faTelegram,
      action: () => {
        // Action for the Telegram button
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        window.open(telegramUrl, '_blank');
      },
      show: true,
    },
  ];

  const filteredShareButtons = shareButtons.length > 0 ? shareButtons.filter(button => button.show) : defaultShareButtons.filter(button => button.show);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
      {filteredShareButtons.map((button, index) => (
        <div key={index} onClick={button.action} style={{ alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 5, marginHorizontal: 5, backgroundColor: button.color || 'black', marginRight: index !== filteredShareButtons.length - 1 ? 10 : 0 }}>
          <FontAwesomeIcon icon={button.icon} style={{ color: button.iconColor || '#ffffff', fontSize: 24 }} />
        </div>
      ))}
    </div>
  );
};

export default ShareButtonsComponent;
