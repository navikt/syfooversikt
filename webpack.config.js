const path = require('path');
var mainPath = path.resolve(__dirname, 'src', 'index.tsx');
var autoprefixer = require('autoprefixer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
var Dotenv = require('dotenv-webpack');

module.exports = {
    entry: mainPath,
    output: {
        filename: 'bundle.js',
        publicPath: 'http://localhost:9090/assets/',
        path: path.resolve(__dirname, 'build'),
    },
    mode: 'development',
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
                loader: 'awesome-typescript-loader'
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
                    // Don't waste time on Gzipping the cache
                    cacheCompression: false,
                },
            },
          {
            test: /\.less$/,
            use: [{
              loader: 'style-loader',
            }, {
              loader: 'css-loader',
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return [autoprefixer];
                },
              },
            }, {
              loader: 'less-loader',
              options: {
                globalVars: {
                  nodeModulesPath: '~',
                  coreModulePath: '~',
                },
              },
            }],
          },
            {
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                use: [{
                    loader: 'svg-url-loader',
                }],
            },
        ]
    },
    devServer: {
        disableHostCheck: true,
        stats: 'errors-only'
    },
    plugins: [
        new Dotenv(),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: './src',
            tsconfig: './tsconfig.json',
            tslint: './tslint.json',
        }),
    ]
};
