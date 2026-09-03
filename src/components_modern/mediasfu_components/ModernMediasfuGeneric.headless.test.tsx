import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import ModernMediasfuGeneric from './ModernMediasfuGeneric';

const NoPrejoin = () => null;

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { writable: true, value: () => ({
    matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  }) });
});

test.each([false, true])('headless background open/close publishes committed getter state (automatic=%s)', async (automatic) => {
  let latest: any;
  const publish = jest.fn((bag) => { latest = bag; });
  const { unmount } = render(<ModernMediasfuGeneric
    returnUI={false} connectMediaSFU={false} PrejoinPage={NoPrejoin}
    sourceParameters={{}} updateSourceParameters={publish}
  />);
  await waitFor(() => expect(latest?.updateIsBackgroundModalVisible).toBeInstanceOf(Function));
  const retainedReader = latest.getCurrentParams;
  act(() => {
    latest.updateAutoClickBackground(automatic);
    latest.updateIsBackgroundModalVisible(true);
  });
  await waitFor(() => {
    expect(latest.isBackgroundModalVisible).toBe(true);
    expect(latest.getCurrentParams().isBackgroundModalVisible).toBe(true);
    expect(retainedReader().isBackgroundModalVisible).toBe(true);
    expect(latest.getCurrentParams().shouldUseSidebar).toBe(false);
  });
  act(() => latest.updateIsBackgroundModalVisible(false));
  await waitFor(() => expect(latest.getCurrentParams().isBackgroundModalVisible).toBe(false));
  const count = publish.mock.calls.length;
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 25)); });
  expect(publish).toHaveBeenCalledTimes(count);
  unmount();
});
