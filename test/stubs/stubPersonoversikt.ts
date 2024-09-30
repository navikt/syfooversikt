import { PERSONOVERSIKT_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { personoversiktEnhetMock } from '@/mocks/data/personoversiktEnhetMock';
import { mockServer } from '../setup';
import { http, HttpResponse } from 'msw';

export const stubPersonoversikt = () => {
  mockServer.use(
    http.get(`*${PERSONOVERSIKT_ROOT}/enhet/${aktivEnhetMock.aktivEnhet}`, () =>
      HttpResponse.json([...personoversiktEnhetMock])
    )
  );
};
