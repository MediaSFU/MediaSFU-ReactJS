export interface DemoCloudConfig {
  credentials: {
    apiUserName: string;
    apiKey: string;
  };
  localLink: string;
  connectMediaSFU: boolean;
}

// Publish-safe defaults for demos and Storybook.
// Keep real credentials in your own environment or backend when testing cloud flows.
export const DEMO_MEDIASFU_API_USERNAME = 'your-api-username';
export const DEMO_MEDIASFU_API_KEY = 'your-api-key';
export const DEMO_CONNECT_MEDIA_SFU = false;

export const getDemoCloudConfig = (): DemoCloudConfig => {
  const localLink = '';

  return {
    credentials: {
      apiUserName: DEMO_MEDIASFU_API_USERNAME,
      apiKey: DEMO_MEDIASFU_API_KEY,
    },
    localLink,
    connectMediaSFU: DEMO_CONNECT_MEDIA_SFU,
  };
};
