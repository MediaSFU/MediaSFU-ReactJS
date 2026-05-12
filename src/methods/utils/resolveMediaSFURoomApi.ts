const DEFAULT_MEDIA_SFU_ROOM_API_URL = 'https://mediasfu.com/v1/rooms/';

type MediaSFURoomApiAction = 'createRoom' | 'joinRoom';

export const resolveMediaSFURoomApi = (
  localLink: string | undefined,
  action: MediaSFURoomApiAction,
): string => {
  const normalizedLink = localLink?.trim();

  if (!normalizedLink || normalizedLink.includes('mediasfu.com')) {
    return DEFAULT_MEDIA_SFU_ROOM_API_URL;
  }

  return `${normalizedLink.replace(/\/$/, '')}/${action}`;
};