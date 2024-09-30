import { EregOrganisasjonResponseDTO } from '@/data/virksomhet/EregVirksomhetsnavn';
import { http, HttpResponse } from 'msw';

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

export const mockEreg = http.get<{ orgnr: string }>(
  '/ereg/api/v1/organisasjon/:orgnr',
  ({ params }) => {
    const eregResponse = eregResponses[params.orgnr];
    return HttpResponse.json(eregResponse);
  }
);
