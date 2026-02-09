import { http, HttpResponse } from 'msw';

export const mockUmami = http.post('https://umami.nav.no/api/send', () => {
  return HttpResponse.text('mocked umami');
});
