const getChangelogs = require('../../server/changelogReader');
const path = require('path');

export const mockChangelogs = (server: any) => {
  server.get('/syfooversikt/changelogs', (req: any, res: any) => {
    res.send(getChangelogs());
  });

  server.get(
    '/syfooversikt/changelogs/image/:changelogId/:imageName',
    (req: any, res: any) => {
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
