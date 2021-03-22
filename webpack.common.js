const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  resolve: {
    extensions: ['.tsx', '.jsx', '.js', '.ts', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/resources'),
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
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env',
      safe: false,
    }),
  ],
};
