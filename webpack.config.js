/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: {
      type: 'umd',
      name: 'MediasfuReactJS',
    },
    globalObject: 'this',
    clean: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules/, /\.test\.(ts|tsx|js|jsx)$/],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'main.css' }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
    }),
  ],
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
    // Keep the host's client renderer external too. Bundling React 18's client
    // shim reads createRoot from react-dom, where React 19 no longer exports it.
    'react-dom/client': {
      commonjs: 'react-dom/client',
      commonjs2: 'react-dom/client',
      amd: 'react-dom/client',
      root: 'ReactDOM',
    },
    'react/jsx-runtime': {
      commonjs: 'react/jsx-runtime',
      commonjs2: 'react/jsx-runtime',
      amd: 'react/jsx-runtime',
      root: ['React', 'jsxRuntime'],
    },
    'react/jsx-dev-runtime': {
      commonjs: 'react/jsx-dev-runtime',
      commonjs2: 'react/jsx-dev-runtime',
      amd: 'react/jsx-dev-runtime',
      root: ['React', 'jsxDEV'],
    },
    '@fortawesome/fontawesome-svg-core': {
      commonjs: '@fortawesome/fontawesome-svg-core',
      commonjs2: '@fortawesome/fontawesome-svg-core',
      amd: '@fortawesome/fontawesome-svg-core',
      root: ['FontAwesome', 'fontawesome-svg-core'],
    },
    '@fortawesome/react-fontawesome': {
      commonjs: '@fortawesome/react-fontawesome',
      commonjs2: '@fortawesome/react-fontawesome',
      amd: '@fortawesome/react-fontawesome',
      root: ['FontAwesome', 'react-fontawesome'],
    },
    '@fortawesome/free-solid-svg-icons': {
      commonjs: '@fortawesome/free-solid-svg-icons',
      commonjs2: '@fortawesome/free-solid-svg-icons',
      amd: '@fortawesome/free-solid-svg-icons',
      root: ['FontAwesome', 'free-solid-svg-icons'],
    },
    '@fortawesome/free-brands-svg-icons': {
      commonjs: '@fortawesome/free-brands-svg-icons',
      commonjs2: '@fortawesome/free-brands-svg-icons',
      amd: '@fortawesome/free-brands-svg-icons',
      root: ['FontAwesome', 'free-brands-svg-icons'],
    },
    '@mediapipe/selfie_segmentation': {
      commonjs: '@mediapipe/selfie_segmentation',
      commonjs2: '@mediapipe/selfie_segmentation',
      amd: '@mediapipe/selfie_segmentation',
      root: 'SelfieSegmentation',
    },
    '@yudiel/react-qr-scanner': {
      commonjs: '@yudiel/react-qr-scanner',
      commonjs2: '@yudiel/react-qr-scanner',
      amd: '@yudiel/react-qr-scanner',
      root: 'ReactQrScanner',
    },
    bootstrap: {
      commonjs: 'bootstrap',
      commonjs2: 'bootstrap',
      amd: 'bootstrap',
      root: 'bootstrap',
    },
    'universal-cookie': {
      commonjs: 'universal-cookie',
      commonjs2: 'universal-cookie',
      amd: 'universal-cookie',
      root: 'UniversalCookie',
    },
    'mediasoup-client': {
      commonjs: 'mediasoup-client',
      commonjs2: 'mediasoup-client',
      amd: 'mediasoup-client',
      root: 'mediasoupClient',
    },
    'socket.io-client': {
      commonjs: 'socket.io-client',
      commonjs2: 'socket.io-client',
      amd: 'socket.io-client',
      root: 'io',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    sideEffects: true, // Respect package.json sideEffects for tree-shaking
  },
};
