const DEFAULT_MEDIA_SFU_ROOM_API_URL = 'https://mediasfu.com/v1/rooms/';

type MediaSFURoomApiAction = 'createRoom' | 'joinRoom';

const normalizeManagedRoomApi = (normalizedLink: string): string => {
  if (normalizedLink.includes('/v1/rooms')) {
    return `${normalizedLink.replace(/\/$/, '')}/`;
  }

  return `${normalizedLink.replace(/\/$/, '')}/v1/rooms/`;
};

export const resolveMediaSFURoomApi = (
  localLink: string | undefined,
  action: MediaSFURoomApiAction,
): string => {
  const normalizedLink = localLink?.trim();

  if (!normalizedLink) {
    return DEFAULT_MEDIA_SFU_ROOM_API_URL;
  }

  if (normalizedLink.includes('mediasfu.com')) {
    return normalizeManagedRoomApi(normalizedLink);
  }

  return `${normalizedLink.replace(/\/$/, '')}/${action}`;
};