import { http, HttpResponse } from 'msw';
import { FLEXJAR_ROOT } from '@/apiConstants';

export const mockFlexjar = http.post(
  `${FLEXJAR_ROOT}/feedback/azure`,
  () => new HttpResponse(null, { status: 200 })
);
