import { merge } from 'webpack-merge';
import common from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';

const productionConfig: WebpackConfiguration = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
};

export default merge(common, productionConfig);
