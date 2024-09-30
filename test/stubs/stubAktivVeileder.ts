import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { veilederMock } from '@/mocks/data/veilederMock';
import { mockServer } from '../setup';
import { http, HttpResponse } from 'msw';

export const stubAktivVeileder = () => {
  mockServer.use(
    http.get(`*${SYFOVEILEDER_ROOT}/veiledere/self`, () =>
      HttpResponse.json(veilederMock)
    )
  );
};
