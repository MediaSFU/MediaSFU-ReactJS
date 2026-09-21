import {
  DEMO_MEDIASFU_API_KEY,
  DEMO_MEDIASFU_API_USERNAME,
  getDemoCloudConfig,
} from './demoCloudConfig';

const ENV_KEYS = [
  'REACT_APP_MEDIASFU_API_USERNAME',
  'REACT_APP_MEDIASFU_API_KEY',
  'REACT_APP_MEDIASFU_LOCAL_LINK',
  'REACT_APP_MEDIASFU_ROOMS_ENDPOINT',
] as const;

const originalEnvironment = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  ENV_KEYS.forEach((key) => {
    const originalValue = originalEnvironment[key];
    if (originalValue === undefined) delete process.env[key];
    else process.env[key] = originalValue;
  });
});

test('keeps publish-safe placeholders when no local cloud configuration exists', () => {
  ENV_KEYS.forEach((key) => delete process.env[key]);

  expect(getDemoCloudConfig()).toEqual({
    credentials: {
      apiUserName: DEMO_MEDIASFU_API_USERNAME,
      apiKey: DEMO_MEDIASFU_API_KEY,
    },
    localLink: '',
    roomsEndpoint: '',
    connectMediaSFU: false,
  });
});

test('uses local environment configuration for live staging validation', () => {
  process.env.REACT_APP_MEDIASFU_API_USERNAME = 'staging-user';
  process.env.REACT_APP_MEDIASFU_API_KEY = 'a'.repeat(64);
  process.env.REACT_APP_MEDIASFU_ROOMS_ENDPOINT = ' https://staging.mediasfu.com/v1/rooms/ ';

  expect(getDemoCloudConfig()).toEqual({
    credentials: {
      apiUserName: 'staging-user',
      apiKey: 'a'.repeat(64),
    },
    localLink: '',
    roomsEndpoint: 'https://staging.mediasfu.com/v1/rooms/',
    connectMediaSFU: true,
  });
});
