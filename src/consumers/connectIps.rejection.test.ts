import { connectIps } from './connectIps';
import { connectSocket } from '../sockets/SocketManager';
import { MediaSocketConnectError } from '../sockets/mediaSocketErrors';

jest.mock('../sockets/SocketManager', () => ({
  connectSocket: jest.fn(),
}));

const mockedConnectSocket = connectSocket as jest.MockedFunction<typeof connectSocket>;

function createOptions(consumeSockets: any[]) {
  const parameters: any = {
    roomRecvIPs: [],
    consume_sockets: consumeSockets,
    updateRoomRecvIPs: jest.fn(),
    updateConsume_sockets: jest.fn(),
  };
  parameters.getUpdatedAllParams = () => parameters;
  return {
    consume_sockets: consumeSockets,
    remIP: ['sc00001'],
    apiUserName: 'account',
    apiToken: 'a'.repeat(64),
    joinConsumeRoomMethod: jest.fn(async () => ({ rtpCapabilities: {} })),
    parameters,
  } as any;
}

describe('connectIps after a connection-rejected', () => {
  beforeEach(() => {
    mockedConnectSocket.mockReset();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it('does not retry an endpoint that refused the credentials', async () => {
    const options = createOptions([]);
    mockedConnectSocket.mockRejectedValue(
      new MediaSocketConnectError({ phase: 'rejected', reason: 'invalid-credentials', elapsedMs: 4 })
    );

    await connectIps(options);
    await connectIps(options);

    expect(mockedConnectSocket).toHaveBeenCalledTimes(1);
  });

  it('keeps retrying after a transient failure', async () => {
    const options = createOptions([]);
    mockedConnectSocket.mockRejectedValue(
      new MediaSocketConnectError({ phase: 'before-open', elapsedMs: 4, transportError: 'websocket error' })
    );

    await connectIps(options);
    await connectIps(options);

    expect(mockedConnectSocket).toHaveBeenCalledTimes(2);
  });

  it('starts clean for another room (different socket collection)', async () => {
    mockedConnectSocket.mockRejectedValue(
      new MediaSocketConnectError({ phase: 'rejected', reason: 'invalid-credentials', elapsedMs: 4 })
    );

    await connectIps(createOptions([]));
    await connectIps(createOptions([]));

    expect(mockedConnectSocket).toHaveBeenCalledTimes(2);
  });
});
