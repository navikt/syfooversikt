import { HttpHandler, WebSocketHandler, ws } from 'msw';
import { generatePersons } from './mockUtils';
import { mockUnleash } from '@/mocks/mockUnleash';
import { mockSyfoveileder } from '@/mocks/syfoveileder/mockSyfoveileder';
import { mockSyfoperson } from '@/mocks/syfoperson/mockSyfoperson';
import { mockPersontildeling } from '@/mocks/persontildeling/mockPersontildeling';
import {
  mockPersonoversikt,
  mockSokPerson,
} from '@/mocks/personoversikt/mockPersonoversikt';
import { mockModiacontextholder } from '@/mocks/modiacontextholder/mockModiacontextholder';
import { mockFlexjar } from '@/mocks/flexjar/mockFlexjar';
import { mockEreg } from '@/mocks/ereg/mockEreg';
import {
  mockGetMuligeTildelinger,
  mockPostTildelOppfolgingsenhet,
} from '@/mocks/mockSyfobehandlendeenhet';
import { mockUmami } from '@/mocks/umami/mockUmami';

const generatedPersons = generatePersons(50);

const handlers: Array<HttpHandler | WebSocketHandler> = [
  ws.link('ws://localhost:4000/*').addEventListener('connection', () => {
    // Silently ignore WebSocket connections to Internflatedecorator in local development
  }),
  mockFlexjar,
  mockUmami,
  mockUnleash,
  mockEreg,
  ...mockSyfoveileder,
  mockSyfoperson(generatedPersons),
  mockPersontildeling,
  mockPersonoversikt(generatedPersons),
  mockSokPerson(),
  mockGetMuligeTildelinger(),
  mockPostTildelOppfolgingsenhet(),
  ...mockModiacontextholder,
];

export default handlers;
