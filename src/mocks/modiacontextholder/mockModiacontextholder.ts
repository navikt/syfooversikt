import { MODIACONTEXTHOLDER_ROOT } from '@/apiConstants';
import { http, HttpResponse } from 'msw';

const saksbehandler = {
  ident: 'Z999999',
  navn: 'Vetle Veileder',
  fornavn: 'Vetle',
  etternavn: 'Veileder',
  enheter: [
    {
      enhetId: '0315',
      navn: 'NAV Grünerløkka',
    },
    {
      enhetId: '0316',
      navn: 'NAV Gamle Oslo',
    },
  ],
};

const aktivBruker = {
  aktivBruker: null,
  aktivEnhet: null,
};

const aktivEnhet = {
  aktivBruker: null,
  aktivEnhet: '0316',
};

export const mockModiacontextholder = [
  http.get(`${MODIACONTEXTHOLDER_ROOT}/decorator`, () =>
    HttpResponse.json(saksbehandler)
  ),

  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`, () =>
    HttpResponse.json(aktivBruker)
  ),

  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`, () =>
    HttpResponse.json(aktivEnhet)
  ),

  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/v2/aktivenhet`, () =>
    HttpResponse.json(aktivEnhet)
  ),

  http.post(
    `${MODIACONTEXTHOLDER_ROOT}/context`,
    () => new HttpResponse(null, { status: 204 })
  ),
];
