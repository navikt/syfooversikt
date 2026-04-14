import * as path from 'path';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './public',
    port: 8080,
    setupMiddlewares: (middlewares, devServer) => {
      const compiler = devServer.compiler;

      middlewares.push({
        name: 'spa-fallback',
        middleware: (req, res) => {
          const filename = path.join(compiler.outputPath, 'index.html');
          compiler.outputFileSystem?.readFile(filename, (err, result) => {
            if (err) {
              res
                .status(404)
                .sendFile(path.resolve(__dirname, 'public/error.html'));
              return;
            }

            res.set('Content-Type', 'text/html');
            res.send(result);
            res.end();
          });
        },
      });

      return middlewares;
    },
  },
};

export default merge(common, devConfig);
