import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import ModernMediasfuGeneric from "./ModernMediasfuGeneric";
import ModernMediasfuGenericHead from "./ModernMediasfuGenericHead";

const NoPrejoin = () => null;

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});

test("renders the engine-owned standard tree without creating another engine", async () => {
  let latest: any;
  const publish = jest.fn((parameters) => {
    latest = parameters;
  });

  render(
    <ModernMediasfuGeneric
      connectMediaSFU={false}
      PrejoinPage={NoPrejoin}
      renderUIExternally
      returnUI={false}
      sourceParameters={{}}
      updateSourceParameters={publish}
    />,
  );

  await waitFor(() =>
    expect(latest?.renderModernMediasfuUI).toBeInstanceOf(Function),
  );
  expect(document.querySelectorAll(".MediaSFU")).toHaveLength(1);

  render(<ModernMediasfuGenericHead parameters={latest} />);

  expect(document.querySelectorAll(".MediaSFU")).toHaveLength(2);
  expect(publish).toHaveBeenCalled();
});

test("uses only the retained pure reader during render", () => {
  const rendered = <div data-testid="pure-render">ready</div>;
  const renderModernMediasfuUI = jest.fn(() => rendered);
  const getCurrentParams = jest.fn(() => ({ renderModernMediasfuUI }));
  const getUpdatedAllParams = jest.fn(() => {
    throw new Error("publishing getter must not run during render");
  });

  render(
    <ModernMediasfuGenericHead
      parameters={{ getCurrentParams, getUpdatedAllParams }}
    />,
  );

  expect(screen.getByTestId("pure-render")).toBeInTheDocument();
  expect(getCurrentParams).toHaveBeenCalledTimes(1);
  expect(renderModernMediasfuUI).toHaveBeenCalledTimes(1);
  expect(getUpdatedAllParams).not.toHaveBeenCalled();
});

test("engine modal routing remains reactive for the external standard UI", async () => {
  let latest: any;
  const publish = jest.fn((parameters) => {
    latest = parameters;
  });

  render(
    <ModernMediasfuGeneric
      connectMediaSFU={false}
      renderUIExternally
      returnUI={false}
      sourceParameters={{}}
      updateSourceParameters={publish}
    />,
  );

  await waitFor(() =>
    expect(latest?.updateIsBackgroundModalVisible).toBeInstanceOf(Function),
  );
  act(() => latest.updateIsBackgroundModalVisible(true));
  await waitFor(() =>
    expect(latest.getCurrentParams().isBackgroundModalVisible).toBe(true),
  );
  act(() => latest.updateIsBackgroundModalVisible(false));
  await waitFor(() =>
    expect(latest.getCurrentParams().isBackgroundModalVisible).toBe(false),
  );
});

test("external standard UI retains desktop sidebar routing", async () => {
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1400 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });

  let latest: any;
  const publish = jest.fn((parameters) => {
    latest = parameters;
  });

  const view = render(
    <ModernMediasfuGeneric
      connectMediaSFU={false}
      renderUIExternally
      returnUI={false}
      sourceParameters={{}}
      updateSourceParameters={publish}
    />,
  );

  await waitFor(() => expect(latest?.shouldUseSidebar).toBe(true));
  act(() => latest.updateIsBackgroundModalVisible(true));
  await waitFor(() => {
    const current = latest.getCurrentParams();
    expect(current.activeSidebarContent).toBe("background");
    expect(current.isBackgroundModalVisible).toBe(false);
  });

  view.unmount();
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: originalWidth,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: originalHeight,
  });
});
