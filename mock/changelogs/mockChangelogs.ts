const getChangelogs = require('../../server/changelogReader');
const path = require('path');

export const mockChangelogs = (server) => {
  server.get('/syfooversikt/changelogs', (req, res) => {
    res.send(getChangelogs());
  });

  server.get(
    '/syfooversikt/changelogs/image/:changelogId/:imageName',
    (req, res) => {
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