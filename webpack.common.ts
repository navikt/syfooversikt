const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const extensions = ['.tsx', '.jsx', '.js', '.ts', '.json'];
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

const dependencies = require('./package.json').dependencies;
const dependenciesShared = {
  ...dependencies['react'],
  ...dependencies['react-dom'],
};

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/static',
    // publicPath: '/static',
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
    new ModuleFederationPlugin({
      name: 'syfooversikt',
      filename: 'remoteEntry.js',
      remotes: {
        AppExposedApp:
          'AppExposedApp@https://finnfastlege.dev.intern.nav.no/static/remoteEntry.js',
      },
      exposes: {},
      // 'shared': dependenciesShared,
      shared: {
        ...dependencies,
      },
    }),
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
