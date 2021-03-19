var Webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'dist/resources');
var mainPath = path.resolve(__dirname, 'src', 'index.tsx');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var autoprefixer = require('autoprefixer');
var Dotenv = require('dotenv-webpack');

var config = function () {
  var extractLess = new MiniCssExtractPlugin({
    filename: 'styles.css',
    disable: false,
  });
  return {
    // We change to normal source mapping
    devtool: 'source-map',
    entry: mainPath,
    output: {
      path: buildPath,
      filename: 'bundle-prod.js',
    },
    mode: 'production',
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        react: path.join(__dirname, 'node_modules', 'react'),
      },
    },
    module: {
      rules: [
        { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'awesome-typescript-loader',
        },
        {
          test: /\.(js|mjs|jsx)$/,
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),

            plugins: [
              [
                require.resolve('babel-plugin-named-asset-import'),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                    },
                  },
                },
              ],
            ],
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            cacheCompression: true,
            compact: true,
          },
        },
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
                plugins: function () {
                  return [autoprefixer];
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                globalVars: {
                  nodeModulesPath: '~',
                  coreModulePath: '~',
                },
              },
            },
          ],
        },
        {
          test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
          use: [
            {
              loader: 'svg-url-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      extractLess,
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
      new Dotenv(),
    ],
  };
};

module.exports = config;
