const DEFAULT_MEDIA_SFU_ROOM_API_URL = 'https://mediasfu.com/v1/rooms/';

type MediaSFURoomApiAction = 'createRoom' | 'joinRoom';

const getDefaultMediaSFURoomApiUrl = (): string =>
  DEFAULT_MEDIA_SFU_ROOM_API_URL;

const normalizeManagedRoomApi = (normalizedLink: string): string => {
  if (normalizedLink.includes('/v1/rooms')) {
    return `${normalizedLink.replace(/\/$/, '')}/`;
  }

  return `${normalizedLink.replace(/\/$/, '')}/v1/rooms/`;
};

export const resolveMediaSFURoomApi = (
  localLink: string | undefined,
  action: MediaSFURoomApiAction,
  roomsEndpoint?: string,
): string => {
  const explicitRoomsEndpoint = roomsEndpoint?.trim();
  if (explicitRoomsEndpoint) {
    return explicitRoomsEndpoint;
  }

  const normalizedLink = localLink?.trim();

  if (!normalizedLink) {
    return getDefaultMediaSFURoomApiUrl();
  }

  if (normalizedLink.includes('mediasfu.com')) {
    return normalizeManagedRoomApi(normalizedLink);
  }

  return `${normalizedLink.replace(/\/$/, '')}/${action}`;
};
