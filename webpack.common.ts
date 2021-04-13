import * as webpack from 'webpack';
import * as path from 'path';
import argv from 'webpack-nano/argv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { WebpackPluginServe } from 'webpack-plugin-serve';
import StylelintPlugin from 'stylelint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

type MODES = 'development' | 'production' | 'none';
const mode = argv.mode as MODES;
const devMode = mode === 'development' ? true : false;

const extensions = {
  typescript: ['.js', '.ts', '.tsx'],
};

/* RULES */

const typescriptRule: webpack.RuleSetRule = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  },
};

const cssRule: webpack.RuleSetRule = {
  test: /\.css$/,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.config.js'),
        },
        sourceMap: true,
      },
    },
  ],
  sideEffects: true,
};

const svgRule: webpack.RuleSetRule = {
  test: /\.svg$/,
  type: 'asset',
};

const bitmapRule: webpack.RuleSetRule = {
  test: /\.(png|jpg)$/,
  type: 'asset',
  parser: { dataUrlCondition: { maxSize: 15000 } },
};

const fontRule: webpack.RuleSetRule = {
  test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, // Match .woff?v=1.1.1.
  use: {
    options: {
      type: 'asset',
      parser: { dataUrlCondition: { maxSize: 50000 } },
    },
  },
};

const rules: webpack.RuleSetRule[] = [
  typescriptRule,
  cssRule,
  svgRule,
  bitmapRule,
];

/* PLUGINS */

const forkTsCheckerPlugin = new ForkTsCheckerPlugin({
  eslint: {
    files: path.resolve(__dirname, './src/**/*.{ts,tsx,js}'),
  },
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const extractCssPlugin: any = new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css',
});

const stylelintPlugin = new StylelintPlugin({
  configFile: path.resolve(__dirname, 'stylelint.config.js'),
  files: './src/**/*.css',
});

const htmlPlugin = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, './public/index.html'),
});

const webpackServePlugin = new WebpackPluginServe({
  port: 8080,
  static: path.resolve(__dirname, './dist'),
  liveReload: true,
  waitForBuild: true,
  progress: false,
});

const caseSensitivePathsPlugin = new CaseSensitivePathsPlugin();

const commonPlugins: webpack.WebpackPluginInstance[] = [
  caseSensitivePathsPlugin,
  forkTsCheckerPlugin,
  htmlPlugin,
  stylelintPlugin,
  extractCssPlugin,
];
const developmentPlugins: webpack.WebpackPluginInstance[] = [
  webpackServePlugin,
];
const productionPlugins: webpack.WebpackPluginInstance[] = [];

const plugins: webpack.WebpackPluginInstance[] = devMode
  ? [...commonPlugins, ...developmentPlugins]
  : [...commonPlugins, ...productionPlugins];

/* OPTIMIZATIONS */

const optimizations: webpack.Configuration = {
  optimization: {
    minimize: true,
    splitChunks: { chunks: 'all' },
  },
};

export { mode, devMode, extensions, rules, plugins, optimizations };
