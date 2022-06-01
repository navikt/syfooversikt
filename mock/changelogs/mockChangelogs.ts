import express from 'express';
import path from 'path';
import { getChangelogs } from '../../server/changelogReader';

export const mockChangelogs = (server: express.Application) => {
  server.get(
    '/syfooversikt/changelogs',
    (req: express.Request, res: express.Response) => {
      res.send(getChangelogs());
    }
  );

  server.get(
    '/syfooversikt/changelogs/image/:changelogId/:imageName',
    (req: any, res: express.Response) => {
      res.sendFile(
        path.join(
          __dirname,
          '../../changelogs',
          req.params.changelogId,
          req.params.imageName
        )
      );
    }
  );
};
