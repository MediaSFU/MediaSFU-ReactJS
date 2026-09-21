import { getCanvasPoint, getContainedContentRect } from "./canvasCoordinates";

const createCanvas = (
  width: number,
  height: number,
  rect: Partial<DOMRect>
): HTMLCanvasElement =>
  ({
    width,
    height,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width,
      height,
      ...rect,
    }),
  } as HTMLCanvasElement);

describe("getCanvasPoint", () => {
  it("maps responsive CSS pixels into native screen-capture pixels", () => {
    const canvas = createCanvas(1920, 1080, {
      left: 150,
      top: 90,
      width: 1280,
      height: 720,
    });

    expect(
      getCanvasPoint(
        { clientX: 790, clientY: 450, offsetX: 640, offsetY: 360 },
        canvas
      )
    ).toEqual({ x: 960, y: 540 });
  });

  it("accounts for a centered canvas whose viewport origin is shifted", () => {
    const canvas = createCanvas(1920, 1080, {
      left: -240,
      top: 0,
      width: 1920,
      height: 1080,
    });

    expect(
      getCanvasPoint(
        { clientX: 500, clientY: 300, offsetX: 500, offsetY: 300 },
        canvas
      )
    ).toEqual({ x: 740, y: 300 });
  });

  it("falls back to event offsets while the canvas has no layout box", () => {
    const canvas = createCanvas(1920, 1080, { width: 0, height: 0 });

    expect(
      getCanvasPoint(
        { clientX: 0, clientY: 0, offsetX: 25, offsetY: 30 },
        canvas
      )
    ).toEqual({ x: 25, y: 30 });
  });
});

describe("getContainedContentRect", () => {
  it("centers horizontal letterboxing symmetrically", () => {
    const rect = getContainedContentRect(1440, 655, 1280, 720);
    expect(rect.left).toBeCloseTo(137.7778, 4);
    expect(rect.top).toBe(0);
    expect(rect.width).toBeCloseTo(1164.4444, 4);
    expect(rect.height).toBe(655);
    expect(rect.left).toBeCloseTo(1440 - rect.left - rect.width, 8);
  });

  it("centers vertical letterboxing symmetrically", () => {
    expect(getContainedContentRect(720, 900, 1920, 1080)).toEqual({
      left: 0,
      top: 247.5,
      width: 720,
      height: 405,
    });
  });

  it("falls back to the full container without source metadata", () => {
    expect(getContainedContentRect(1280, 720, 0, 0)).toEqual({
      left: 0,
      top: 0,
      width: 1280,
      height: 720,
    });
  });
});
