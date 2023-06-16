import express from 'express';
import { ensureAuthenticated } from '../../server/authUtils';
import { EregOrganisasjonResponseDTO } from '@/data/virksomhet/EregVirksomhetsnavn';

interface EregMockData {
  [key: string]: EregOrganisasjonResponseDTO;
}

const eregResponses: EregMockData = {
  '987654321': {
    navn: {
      navnelinje1: 'NAV Security',
    },
  },
  '987654322': {
    navn: {
      navnelinje1: 'NAV Investment',
      redigertnavn: 'NAV Investments',
    },
  },
  '987654324': {
    navn: {
      navnelinje1: 'Kompani & Co. AS',
    },
  },
  '987654328': {
    navn: {
      navnelinje1: 'Bolle Og Brus',
    },
  },
  '987654320': {
    navn: {
      navnelinje1: 'Samme Virksomhet AS',
      redigertnavn: 'Annen Virksomhet AS',
    },
  },
};

export const mockEreg = (server: express.Application) => {
  server.get(
    '/ereg/api/v1/organisasjon/:orgnr',
    ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      const eregResponse = eregResponses[req.params.orgnr as string];
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(eregResponse));
    }
  );
};
