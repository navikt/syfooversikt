const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import mockEndepunkter from './mock/mockEndepunkter';
const express = require('express');
const Auth = require('./server/auth/index.js');
const path = require('path');

const setupDev = async (app, compiler) => {
  await Auth.setupAuth(app);

  mockEndepunkter(app);
  app.use('/static', express.static(path.resolve(__dirname, 'dist')));

  app.use('*', (req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        res.status(404).sendFile(path.resolve(__dirname, 'public/error.html'));
        return;
      }

      res.set('Content-Type', 'text/html');
      res.send(result);
      res.end();
    });
  });
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    onAfterSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      setupDev(devServer.app, devServer.compiler);
    },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
  ],
});
