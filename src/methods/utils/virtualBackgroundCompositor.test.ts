import {
  compositeVirtualBackgroundFrame,
  isVirtualBackgroundBlur,
  VIRTUAL_BACKGROUND_BLUR,
} from './virtualBackgroundCompositor';

test('recognizes only the stable blur selection value', () => {
  expect(isVirtualBackgroundBlur(VIRTUAL_BACKGROUND_BLUR)).toBe(true);
  expect(isVirtualBackgroundBlur('office.jpg')).toBe(false);
  expect(isVirtualBackgroundBlur(null)).toBe(false);
});

test('composites a blurred source behind the segmented person without an image', () => {
  const drawImage = jest.fn();
  const ctx: any = {
    filter: 'none',
    globalCompositeOperation: 'source-over',
    fillStyle: '',
    save: jest.fn(),
    restore: jest.fn(),
    clearRect: jest.fn(),
    drawImage,
    createPattern: jest.fn(),
    fillRect: jest.fn(),
  };
  const mask = {} as CanvasImageSource;
  const source = {} as CanvasImageSource;

  compositeVirtualBackgroundFrame({
    ctx,
    segmentationMask: mask,
    sourceImage: source,
    width: 640,
    height: 360,
    blurFallbackPixels: 16,
  });

  expect(ctx.createPattern).not.toHaveBeenCalled();
  expect(drawImage).toHaveBeenNthCalledWith(1, mask, 0, 0, 640, 360);
  expect(drawImage).toHaveBeenNthCalledWith(2, source, 0, 0, 640, 360);
  expect(drawImage).toHaveBeenNthCalledWith(3, source, -32, -32, 704, 424);
  expect(ctx.filter).toBe('none');
  expect(ctx.globalCompositeOperation).toBe('source-over');
});
