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
  const handlers = new Map<string, (...args: any[]) => void>();
  return {
    id,
    connected: true,
    on: jest.fn((event: string, handler: (...args: any[]) => void) => {
      handlers.set(event, handler);
    }),
    emit: jest.fn(),
    removeAllListeners: jest.fn(),
    disconnect: jest.fn(),
    trigger: (event: string, ...args: any[]) => handlers.get(event)?.(...args),
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

  it('closes a socket that connected but could not join the consuming room', async () => {
    const consumeSockets: any[] = [];
    const options = createOptions(consumeSockets);
    const socket = fakeSocket('failed-consume');
    options.joinConsumeRoomMethod.mockResolvedValue({});
    mockedConnectSocket.mockResolvedValue(socket);

    await connectIps(options);

    expect(socket.removeAllListeners).toHaveBeenCalled();
    expect(socket.disconnect).toHaveBeenCalled();
    expect(consumeSockets).toHaveLength(0);
  });

  it('prunes a disconnected endpoint so the next room can reconnect', async () => {
    const stale = fakeSocket('stale-consume');
    stale.connected = false;
    const consumeSockets: any[] = [{ sc00001: stale }];
    const replacement = fakeSocket('replacement-consume');
    mockedConnectSocket.mockResolvedValue(replacement);

    await connectIps(createOptions(consumeSockets));

    expect(stale.removeAllListeners).toHaveBeenCalled();
    expect(stale.disconnect).toHaveBeenCalled();
    expect(mockedConnectSocket).toHaveBeenCalledTimes(1);
    expect(consumeSockets).toEqual([{ sc00001: replacement }]);
  });

  it('removes a registered endpoint when its socket disconnects', async () => {
    const consumeSockets: any[] = [];
    const options = createOptions(consumeSockets);
    const socket = fakeSocket('consume-1');
    mockedConnectSocket.mockResolvedValue(socket);

    await connectIps(options);
    socket.trigger('disconnect', 'transport close');

    expect(consumeSockets).toHaveLength(0);
    expect(options.parameters.updateConsume_sockets).toHaveBeenLastCalledWith([]);
    expect(options.parameters.updateRoomRecvIPs).toHaveBeenLastCalledWith([]);
  });
});
