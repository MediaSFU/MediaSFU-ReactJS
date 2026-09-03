import { createSendTransport } from './createSendTransport';

describe('createSendTransport acknowledgement contract', () => {
  it('does not resolve before the remote transport is created and connected', async () => {
    let acknowledge: ((payload: { params: Record<string, unknown> }) => Promise<void>) | undefined;
    const socket = {
      id: 'media-socket',
      emit: jest.fn((event: string, _payload: unknown, callback?: typeof acknowledge) => {
        if (event === 'createWebRtcTransport') acknowledge = callback;
      }),
    };
    const producerTransport = { on: jest.fn(), close: jest.fn() };
    const connectSendTransport = jest.fn().mockResolvedValue(undefined);
    const updateProducerTransport = jest.fn();
    const updateTransportCreated = jest.fn();
    const device = { createSendTransport: jest.fn().mockResolvedValue(producerTransport) };
    const parameters: any = {
      islevel: '1',
      member: 'Participant',
      socket,
      device,
      producerTransport: null,
      transportCreated: false,
      updateProducerTransport,
      updateTransportCreated,
      connectSendTransport,
      getUpdatedAllParams: () => parameters,
    };

    let resolved = false;
    const pending = createSendTransport({ option: 'audio', parameters }).then(() => {
      resolved = true;
    });

    await Promise.resolve();
    expect(resolved).toBe(false);
    expect(acknowledge).toBeDefined();

    await acknowledge!({ params: { id: 'transport-params' } });
    await pending;

    expect(device.createSendTransport).toHaveBeenCalledWith({ id: 'transport-params' });
    expect(updateProducerTransport).toHaveBeenCalledWith(producerTransport);
    expect(connectSendTransport).toHaveBeenCalledWith(expect.objectContaining({
      option: 'audio',
      parameters: expect.objectContaining({ producerTransport }),
      targetOption: 'remote',
    }));
    expect(updateTransportCreated).toHaveBeenCalledWith(true);
    expect(resolved).toBe(true);
  });
});
