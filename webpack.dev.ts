import * as express from 'express';
import * as path from 'path';
import { merge } from 'webpack-merge';
import * as Webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

import common from './webpack.common';

const devConfig: Webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './public',
    port: 8080,
    setupMiddlewares: (
      middlewares: WebpackDevServer.Middleware[],
      devServer: WebpackDevServer
    ) => {
      const compiler = devServer.compiler;

      middlewares.push({
        name: 'spa-fallback',
        middleware: (req: express.Request, res: express.Response) => {
          const filename = path.join(compiler.outputPath, 'index.html');
          compiler.outputFileSystem?.readFile(
            filename,
            (err: any, result: any) => {
              if (err) {
                res
                  .status(404)
                  .sendFile(path.resolve(__dirname, 'public/error.html'));
                return;
              }

              res.set('Content-Type', 'text/html');
              res.send(result);
              res.end();
            }
          );
        },
      });

      return middlewares;
    },
  },
};

export default merge(common, devConfig);
