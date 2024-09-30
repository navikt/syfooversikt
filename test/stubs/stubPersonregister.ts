import { SYFOPERSON_ROOT } from '@/apiConstants';
import { personInfoMock } from '@/mocks/data/personInfoMock';
import { mockServer } from '../setup';
import { http, HttpResponse } from 'msw';

export const stubPersonregister = () => {
  mockServer.use(
    http.post(`*${SYFOPERSON_ROOT}/person/info`, () =>
      HttpResponse.json([...personInfoMock])
    )
  );
};
