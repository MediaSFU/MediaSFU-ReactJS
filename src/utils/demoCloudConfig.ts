export interface DemoCloudConfig {
  credentials: {
    apiUserName: string;
    apiKey: string;
  };
  localLink: string;
  connectMediaSFU: boolean;
}

export const getDemoCloudConfig = (): DemoCloudConfig => {
  const apiUserName = process.env.REACT_APP_MEDIASFU_API_USERNAME?.trim() ?? '';
  const apiKey = process.env.REACT_APP_MEDIASFU_API_KEY?.trim() ?? '';
  const localLink = process.env.REACT_APP_MEDIASFU_LOCAL_LINK?.trim() ?? '';

  return {
    credentials: {
      apiUserName,
      apiKey,
    },
    localLink,
    connectMediaSFU:
      localLink !== '' || (apiUserName !== '' && apiKey !== ''),
  };
};