import * as express from 'express';
import * as path from 'path';
import { merge } from 'webpack-merge';
import * as Webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

import common from './webpack.common';
import mockEndepunkter from './mock/mockEndepunkter';
import * as Session from './server/session';

const devConfig: Webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    setupMiddlewares: (
      middlewares: WebpackDevServer.Middleware[],
      devServer: WebpackDevServer
    ) => {
      setupDev(devServer);
      return middlewares;
    },
  },
};

const setupDev = async (devServer: WebpackDevServer) => {
  const app = devServer.app;
  if (!app) {
    throw new Error('webpack-dev-server is not defined');
  }
  const compiler = devServer.compiler;

  await Session.setupSession(app);

  mockEndepunkter(app);
  app.use('/static', express.static(path.resolve(__dirname, 'dist')));

  app.use('*', (req: express.Request, res: express.Response) => {
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

export default merge(common, devConfig);
