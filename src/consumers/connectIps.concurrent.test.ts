import { connectIps } from './connectIps';
import { connectSocket } from '../sockets/SocketManager';

jest.mock('../sockets/SocketManager', () => ({
  connectSocket: jest.fn(),
}));

const mockedConnectSocket = connectSocket as jest.MockedFunction<typeof connectSocket>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function fakeSocket(id: string) {
  return {
    id,
    connected: true,
    on: jest.fn(),
    emit: jest.fn(),
  } as any;
}

function createOptions(consumeSockets: any[]) {
  const roomRecvIPs: string[] = [];
  const parameters: any = {
    roomRecvIPs,
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
    newProducerMethod: jest.fn(async () => undefined),
    closedProducerMethod: jest.fn(async () => undefined),
    joinConsumeRoomMethod: jest.fn(async () => ({ rtpCapabilities: {} })),
    parameters,
  } as any;
}

describe('connectIps concurrent endpoint reservation', () => {
  beforeEach(() => {
    mockedConnectSocket.mockReset();
  });

  it('opens and joins a consume endpoint only once when updates overlap', async () => {
    const consumeSockets: any[] = [];
    const options = createOptions(consumeSockets);
    const connection = deferred<any>();
    mockedConnectSocket.mockReturnValue(connection.promise);

    const first = connectIps(options);
    const second = connectIps(options);

    await Promise.resolve();
    expect(mockedConnectSocket).toHaveBeenCalledTimes(1);
    connection.resolve(fakeSocket('consume-1'));

    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(mockedConnectSocket).toHaveBeenCalledTimes(1);
    expect(options.joinConsumeRoomMethod).toHaveBeenCalledTimes(1);
    expect(consumeSockets).toHaveLength(1);
    expect(firstResult[0]).toBe(consumeSockets);
    expect(secondResult[0]).toBe(consumeSockets);
  });

  it('releases a failed reservation so a waiting update can retry', async () => {
    const consumeSockets: any[] = [];
    const options = createOptions(consumeSockets);
    const firstConnection = deferred<any>();
    mockedConnectSocket
      .mockReturnValueOnce(firstConnection.promise)
      .mockResolvedValueOnce(fakeSocket('consume-2'));

    const first = connectIps(options);
    const second = connectIps(options);
    firstConnection.reject(new Error('temporary failure'));

    await Promise.all([first, second]);

    expect(mockedConnectSocket).toHaveBeenCalledTimes(2);
    expect(consumeSockets).toHaveLength(1);
  });

  it('does not share a consume socket between independent room collections', async () => {
    mockedConnectSocket
      .mockResolvedValueOnce(fakeSocket('room-a'))
      .mockResolvedValueOnce(fakeSocket('room-b'));

    await Promise.all([
      connectIps(createOptions([])),
      connectIps(createOptions([])),
    ]);

    expect(mockedConnectSocket).toHaveBeenCalledTimes(2);
  });
});
