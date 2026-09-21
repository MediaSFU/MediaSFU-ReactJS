export interface DemoCloudConfig {
  credentials: {
    apiUserName: string;
    apiKey: string;
  };
  localLink: string;
  roomsEndpoint: string;
  connectMediaSFU: boolean;
}

// Publish-safe defaults for demos and Storybook.
// Keep real credentials in your own environment or backend when testing cloud flows.
export const DEMO_MEDIASFU_API_USERNAME = 'your-api-username';
export const DEMO_MEDIASFU_API_KEY = 'your-api-key';
export const DEMO_CONNECT_MEDIA_SFU = false;

export const getDemoCloudConfig = (): DemoCloudConfig => {
  const apiUserName = process.env.REACT_APP_MEDIASFU_API_USERNAME?.trim()
    || DEMO_MEDIASFU_API_USERNAME;
  const apiKey = process.env.REACT_APP_MEDIASFU_API_KEY?.trim()
    || DEMO_MEDIASFU_API_KEY;
  const localLink = process.env.REACT_APP_MEDIASFU_LOCAL_LINK?.trim() || '';
  const roomsEndpoint = process.env.REACT_APP_MEDIASFU_ROOMS_ENDPOINT?.trim() || '';
  const hasConfiguredCredentials =
    apiUserName !== DEMO_MEDIASFU_API_USERNAME
    && apiKey !== DEMO_MEDIASFU_API_KEY;

  return {
    credentials: {
      apiUserName,
      apiKey,
    },
    localLink,
    roomsEndpoint,
    connectMediaSFU: hasConfiguredCredentials || DEMO_CONNECT_MEDIA_SFU,
  };
};
