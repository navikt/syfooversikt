import { MODIACONTEXTHOLDER_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { mockServer } from '../setup';
import { http, HttpResponse } from 'msw';

export const stubModiaContext = () => {
  mockServer.use(
    http.get(`*${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`, () =>
      HttpResponse.json(aktivEnhetMock)
    )
  );
};
