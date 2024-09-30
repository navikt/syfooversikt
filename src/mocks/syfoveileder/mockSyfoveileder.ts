import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { veiledereMock } from '../data/veiledereMock';
import { veilederMock } from '../data/veilederMock';
import { http, HttpResponse } from 'msw';

export const mockSyfoveileder = [
  http.get(`${SYFOVEILEDER_ROOT}/veiledere/self`, () =>
    HttpResponse.json(veilederMock)
  ),

  http.get(`${SYFOVEILEDER_ROOT}/veiledere`, () =>
    HttpResponse.json(veiledereMock)
  ),
];
