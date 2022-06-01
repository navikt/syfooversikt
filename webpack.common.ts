import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const extensions = ['.tsx', '.jsx', '.js', '.ts', '.json'];

const commonConfig: Configuration = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static',
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions,
      }),
    ],
    extensions,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
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
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: './.env',
      safe: false,
    }),
  ],
};

export default commonConfig;
