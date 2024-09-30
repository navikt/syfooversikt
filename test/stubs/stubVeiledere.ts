import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { veiledereMock } from '@/mocks/data/veiledereMock';
import { mockServer } from '../setup';
import { http, HttpResponse } from 'msw';

export const stubVeiledere = () => {
  mockServer.use(
    http.get(
      `*${SYFOVEILEDER_ROOT}/veiledere?enhetNr=${aktivEnhetMock.aktivEnhet}`,
      () => HttpResponse.json([...veiledereMock])
    )
  );
};
