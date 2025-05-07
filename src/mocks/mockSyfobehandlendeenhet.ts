import { http, HttpResponse } from 'msw';
import { SYFOBEHANDLENDEENHET_ROOT } from '@/apiConstants';
import { Enhet } from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/useGetMuligeOppfolgingsenheter';
import {
  OppfolgingsenhetTildelingerRequestDTO,
  OppfolgingsenhetTildelingerResponseDTO,
} from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/usePostTildelOppfolgingsenhet';

const muligeoppfolgingsenheter: Enhet[] = [
  { enhetId: '0393', navn: 'Nav Utland' },
  { enhetId: '0106', navn: 'Nav Fredrikstad' },
  { enhetId: '0101', navn: 'Nav Halden' },
  { enhetId: '0105', navn: 'Nav Sarpsborg' },
];

export function mockGetMuligeTildelinger() {
  return http.get(
    `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/:enhetId`,
    () => HttpResponse.json(muligeoppfolgingsenheter)
  );
}

export function mockPostTildelOppfolgingsenhet() {
  return http.post<
    object,
    OppfolgingsenhetTildelingerRequestDTO,
    OppfolgingsenhetTildelingerResponseDTO
  >(
    `${SYFOBEHANDLENDEENHET_ROOT}/oppfolgingsenhet-tildelinger`,
    async ({ request }) => {
      const body = await request.json();
      const tildelinger = body.personidenter.map((personident) => ({
        personident,
        oppfolgingsenhet: body.oppfolgingsenhet,
      }));
      return HttpResponse.json({ tildelinger: tildelinger });
    }
  );
}
