import { PERSONTILDELING_ROOT } from '@/apiConstants';
import { http, HttpResponse } from 'msw';

export const mockPersontildeling = http.post(
  `${PERSONTILDELING_ROOT}/registrer`,
  () => HttpResponse.text('OK')
);
