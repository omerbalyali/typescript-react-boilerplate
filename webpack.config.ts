import * as path from 'path';
import * as webpack from 'webpack';
import * as common from './webpack.common';

const config: webpack.Configuration = {
  mode: 'development',
  watch: common.devMode,
  stats: common.devMode ? 'minimal' : 'minimal',
  devtool: common.devMode ? 'eval-cheap-module-source-map' : 'source-map',
  entry: [path.resolve(__dirname, 'src'), 'webpack-plugin-serve/client'],
  module: {
    rules: common.rules,
  },
  resolve: {
    extensions: common.extensions.javascript,
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    assetModuleFilename: '[name].[contenthash][ext][query]',
  },
  plugins: common.plugins,
  ...common.optimizations,
};

export default config;
