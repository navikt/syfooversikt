const { merge } = require('webpack-merge');
const common = require('./webpack.common');
import mockEndepunkter from './mock/mockEndepunkter';

const express = require('express');
const Auth = require('./server/auth/index.js');
const path = require('path');

const setupDev = async (app: any, compiler: any) => {
  await Auth.setupAuth(app);

  mockEndepunkter(app);
  app.use('/static', express.static(path.resolve(__dirname, 'dist')));

  app.use('*', (req: any, res: any) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
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
    setupMiddlewares: (middlewares: any, devServer: any) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      setupDev(devServer.app, devServer.compiler);
      return middlewares;
    },
  },
});
