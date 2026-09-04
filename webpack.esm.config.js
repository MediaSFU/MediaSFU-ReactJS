/* ESM companion build for Vite/Rollup consumers. The existing webpack.config.js
 * remains the UMD/CJS build used by require() and the browser global. */
const base = require('./webpack.config.js');

module.exports = {
  ...base,
  // UMD externals carry commonjs/amd/root mappings that are not valid for an
  // outputModule build. Emit standard ESM imports for the same peer modules.
  externals: Object.keys(base.externals),
  externalsType: 'module',
  output: {
    ...base.output,
    filename: 'main.mjs',
    library: { type: 'module' },
    clean: false,
  },
  experiments: { ...(base.experiments || {}), outputModule: true },
};
