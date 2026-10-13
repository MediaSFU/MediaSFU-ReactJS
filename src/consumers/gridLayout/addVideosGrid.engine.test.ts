import { resolveSidePanelForceFullDisplay } from './addVideosGrid.engine';

describe('side-panel video fit', () => {
  it('contains a lone media tile during screen sharing even when cover is selected', () => {
    expect(resolveSidePanelForceFullDisplay({
      forceFullDisplay: true, screenShareActive: true, itemCount: 1,
    })).toBe(false);
  });

  it('preserves the fit choice with multiple tiles or without screen sharing', () => {
    expect(resolveSidePanelForceFullDisplay({
      forceFullDisplay: true, screenShareActive: true, itemCount: 2,
    })).toBe(true);
    expect(resolveSidePanelForceFullDisplay({
      forceFullDisplay: true, screenShareActive: false, itemCount: 1,
    })).toBe(true);
    expect(resolveSidePanelForceFullDisplay({
      forceFullDisplay: false, screenShareActive: true, itemCount: 2,
    })).toBe(false);
  });
});
