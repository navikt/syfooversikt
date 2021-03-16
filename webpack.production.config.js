const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'bundle-prod.js',
    path: buildPath,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      disable: false,
    }),
  ],
});
