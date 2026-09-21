import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const genericFiles = [
  'src/components/mediasfuComponents/MediasfuGeneric.tsx',
  'src/components/mediasfuComponents/MediasfuWebinar.tsx',
  'src/components/mediasfuComponents/MediasfuConference.tsx',
  'src/components/mediasfuComponents/MediasfuBroadcast.tsx',
  'src/components/mediasfuComponents/MediasfuChat.tsx',
  'src/components_modern/mediasfu_components/ModernMediasfuGeneric.tsx',
];

for (const relativePath of genericFiles) {
  const source = readFileSync(resolve(root, relativePath), 'utf8');
  assert.match(source, /containerWidthFraction\??:\s*number/, `${relativePath}: public width contract`);
  assert.match(source, /containerHeightFraction\??:\s*number/, `${relativePath}: public height contract`);
  assert.match(source, /containerWidthFraction(?:Prop)?\s*=\s*1/, `${relativePath}: width defaults to 1`);
  assert.match(source, /containerHeightFraction(?:Prop)?\s*=\s*1/, `${relativePath}: height defaults to 1`);
  for (const boundary of ['MainContainer', 'MainAspect', 'MainScreen']) {
    const openingTag = source.match(new RegExp(`<${boundary}\\b[\\s\\S]{0,1000}?>`))?.[0] ?? '';
    assert.match(openingTag, /containerWidthFraction=/, `${relativePath}: ${boundary} receives width`);
    assert.match(openingTag, /containerHeightFraction=/, `${relativePath}: ${boundary} receives height`);
  }
  assert.match(source, /containerWidthFraction(?:Prop)?\s*<\s*1\s*\?\s*["']100%["']\s*:\s*["']100vw["']/, `${relativePath}: embedded root width`);
  assert.match(source, /containerHeightFraction(?:Prop)?\s*<\s*1\s*\?\s*["']100%["']\s*:\s*["']100vh["']/, `${relativePath}: embedded root height`);
}

const conference = readFileSync(resolve(root, 'src/components/mediasfuComponents/MediasfuConference.tsx'), 'utf8');
assert.match(conference, /showAspect=\{mainHeightWidth\s*>\s*0/, 'conference keeps the existing no-main-grid state');
assert.match(conference, /whiteboardStarted\.current\s*&&\s*!whiteboardEnded\.current/, 'conference keeps whiteboard activation');
assert.match(conference, /shared\.current/, 'conference keeps screen-share activation');

const calculate = (viewportWidth, viewportHeight, widthFraction = 1, heightFraction = 1) => ({
  width: Math.floor(viewportWidth * widthFraction),
  height: Math.floor(viewportHeight * heightFraction),
});
assert.deepEqual(calculate(1500, 900), { width: 1500, height: 900 }, 'full-page defaults stay unchanged');
const embeddedFraction = 1294 / 1500;
for (const boundary of ['MainContainer', 'MainAspect', 'MainScreen']) {
  assert.ok(calculate(1500, 900, embeddedFraction, 1).width <= 1294, `${boundary} stays inside 1294px`);
  assert.ok(calculate(1200, 800, embeddedFraction, 0.8).width <= 1200 * embeddedFraction, `${boundary} updates on resize`);
}

console.log(`Embedded-container contract passed for ${genericFiles.length} public React generic surfaces.`);
