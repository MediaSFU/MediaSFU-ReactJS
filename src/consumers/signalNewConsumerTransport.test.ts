import { signalNewConsumerTransport } from './signalNewConsumerTransport';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function harness(device: any) {
  const state: any = {
    device,
    consumingTransports: [],
  };
  const updateConsumingTransports = jest.fn((next: string[]) => {
    state.consumingTransports = next;
  });
  const connectRecvTransport = jest.fn(async () => undefined);
  const reorderStreams = jest.fn(async () => undefined);
  const parameters: any = {
    ...state,
    lock_screen: false,
    consumerDeviceWaitMs: 0,
    consumerTransportAckWaitMs: 100,
    updateConsumingTransports,
    connectRecvTransport,
    reorderStreams,
  };
  parameters.getUpdatedAllParams = () => ({
    ...parameters,
    ...state,
    updateConsumingTransports,
  });
  return { state, parameters, updateConsumingTransports, connectRecvTransport, reorderStreams };
}

test('does not poison the producer retry set before the mediasoup device is ready', async () => {
  const testState = harness(null);
  const nsock: any = { emit: jest.fn() };

  await signalNewConsumerTransport({
    remoteProducerId: 'producer-a',
    islevel: '1',
    nsock,
    parameters: testState.parameters,
  });

  expect(nsock.emit).not.toHaveBeenCalled();
  expect(testState.updateConsumingTransports).not.toHaveBeenCalled();
  expect(testState.state.consumingTransports).toEqual([]);
});

test('reserves only a ready producer and connects its receive transport', async () => {
  const consumerTransport = { on: jest.fn(), close: jest.fn() };
  const device = { createRecvTransport: jest.fn(() => consumerTransport) };
  const testState = harness(device);
  const nsock: any = {
    emit: jest.fn((event: string, _payload: unknown, callback: (...args: any[]) => any) => {
      if (event === 'createWebRtcTransport') {
        void callback({ params: { id: 'transport-a' } });
      }
    }),
  };

  await signalNewConsumerTransport({
    remoteProducerId: 'producer-a',
    islevel: '1',
    nsock,
    parameters: testState.parameters,
  });
  await flush();

  expect(testState.state.consumingTransports).toEqual(['producer-a']);
  expect(device.createRecvTransport).toHaveBeenCalledWith({ id: 'transport-a' });
  expect(testState.connectRecvTransport).toHaveBeenCalledWith(expect.objectContaining({
    consumerTransport,
    remoteProducerId: 'producer-a',
    serverConsumerTransportId: 'transport-a',
  }));
});

test('releases a producer reservation when transport creation is never acknowledged', async () => {
  jest.useFakeTimers();
  try {
    const testState = harness({ createRecvTransport: jest.fn() });
    testState.parameters.consumerTransportAckWaitMs = 10;
    const nsock: any = { emit: jest.fn() };

    await signalNewConsumerTransport({
      remoteProducerId: 'producer-without-ack',
      islevel: '1',
      nsock,
      parameters: testState.parameters,
    });
    expect(testState.state.consumingTransports).toEqual(['producer-without-ack']);

    jest.advanceTimersByTime(11);
    await flush();

    expect(testState.state.consumingTransports).toEqual([]);
  } finally {
    jest.useRealTimers();
  }
});

test('consumes an early producer once the mediasoup device becomes ready inside the bounded wait', async () => {
  const consumerTransport = { on: jest.fn(), close: jest.fn() };
  const device = { createRecvTransport: jest.fn(() => consumerTransport) };
  const testState = harness(null);
  testState.parameters.consumerDeviceWaitMs = 250;
  const nsock: any = {
    emit: jest.fn((event: string, _payload: unknown, callback: (...args: any[]) => any) => {
      if (event === 'createWebRtcTransport') void callback({ params: { id: 'transport-delayed' } });
    }),
  };
  setTimeout(() => { testState.state.device = device; }, 10);

  await signalNewConsumerTransport({
    remoteProducerId: 'producer-delayed',
    islevel: '1',
    nsock,
    parameters: testState.parameters,
  });
  await flush();

  expect(testState.state.consumingTransports).toEqual(['producer-delayed']);
  expect(device.createRecvTransport).toHaveBeenCalledWith({ id: 'transport-delayed' });
  expect(testState.connectRecvTransport).toHaveBeenCalledWith(expect.objectContaining({
    remoteProducerId: 'producer-delayed',
  }));
});

test.each(['server-error', 'device-error'])('releases a failed %s reservation so normal retry remains possible', async (failure) => {
  const device = {
    createRecvTransport: failure === 'device-error'
      ? jest.fn(() => { throw new Error('device failed'); })
      : jest.fn(),
  };
  const testState = harness(device);
  const nsock: any = {
    emit: jest.fn((event: string, _payload: unknown, callback: (...args: any[]) => any) => {
      if (event === 'createWebRtcTransport') {
        void callback({ params: failure === 'server-error' ? { error: 'unavailable' } : { id: 'transport-a' } });
      }
    }),
  };

  await signalNewConsumerTransport({
    remoteProducerId: 'producer-a',
    islevel: '1',
    nsock,
    parameters: testState.parameters,
  });
  await flush();

  expect(testState.state.consumingTransports).toEqual([]);
});

test('releases the reservation after bounded receive recovery fails', async () => {
  const handlers: Record<string, (...args: any[]) => any> = {};
  const consumerTransport = {
    on: jest.fn((event: string, handler: (...args: any[]) => any) => { handlers[event] = handler; }),
    close: jest.fn(),
  };
  const testState = harness({ createRecvTransport: jest.fn(() => consumerTransport) });
  const nsock: any = {
    emit: jest.fn((event: string, _payload: unknown, callback: (...args: any[]) => any) => {
      if (event === 'createWebRtcTransport') void callback({ params: { id: 'transport-a' } });
      if (event === 'transport-restart-ice') callback({ error: 'Transport unavailable' });
    }),
  };

  await signalNewConsumerTransport({
    remoteProducerId: 'producer-a',
    islevel: '1',
    nsock,
    parameters: testState.parameters,
  });
  await flush();
  await handlers.connectionstatechange('failed');
  await flush();
  await flush();
  await new Promise(resolve => setTimeout(resolve, 2200));

  expect(consumerTransport.close).toHaveBeenCalled();
  expect(testState.state.consumingTransports).toEqual([]);
  expect(testState.reorderStreams).toHaveBeenCalled();
});
