import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/preset-create-react-app',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	staticDirs: ['../public'],
	webpackFinal: async (webpackConfig) => {
		webpackConfig.resolve = webpackConfig.resolve || {};
		webpackConfig.resolve.extensions = [
			'.ts',
			'.tsx',
			'.js',
			'.jsx',
			...(webpackConfig.resolve.extensions || []),
		];
		webpackConfig.resolve.modules = [
			path.resolve(__dirname, '../src'),
			...(webpackConfig.resolve.modules || []),
		];
		webpackConfig.resolve.plugins = [
			...(webpackConfig.resolve.plugins || []),
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, '../tsconfig.json'),
				extensions: ['.ts', '.tsx', '.js', '.jsx'],
			}),
		];

		return webpackConfig;
	},
};

export default config;
