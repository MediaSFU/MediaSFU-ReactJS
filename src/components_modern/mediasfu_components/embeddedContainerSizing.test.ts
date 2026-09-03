import { resolveEmbeddedControlFractions } from "./embeddedContainerSizing";

describe("resolveEmbeddedControlFractions", () => {
  it("preserves the full-page sizing contract", () => {
    expect(resolveEmbeddedControlFractions({
      containerHeightFraction: 1,
      controlViewportFraction: 0.05,
    })).toEqual({ mainFraction: 0.95, subViewportFraction: 0.05 });
  });

  it("keeps embedded MainAspect and SubAspect inside one boundary", () => {
    const viewportHeight = 800;
    const containerHeightFraction = 0.74;
    const result = resolveEmbeddedControlFractions({
      containerHeightFraction,
      controlViewportFraction: 40 / viewportHeight,
    });
    const mainPixels = viewportHeight * containerHeightFraction * result.mainFraction;
    const subPixels = viewportHeight * result.subViewportFraction;

    expect(mainPixels).toBeCloseTo(552);
    expect(subPixels).toBeCloseTo(40);
    expect(mainPixels + subPixels).toBeCloseTo(viewportHeight * containerHeightFraction);
  });

  it("caps controls to very small embedded containers", () => {
    expect(resolveEmbeddedControlFractions({
      containerHeightFraction: 0.03,
      controlViewportFraction: 0.05,
    })).toEqual({ mainFraction: 0, subViewportFraction: 0.03 });
  });
});
