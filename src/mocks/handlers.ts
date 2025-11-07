import { HttpHandler } from 'msw';
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

const generatedPersons = generatePersons(50);

const handlers: HttpHandler[] = [
  mockFlexjar,
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
