import { http, HttpHandler, HttpResponse } from 'msw';
import { generatePersons } from './mockUtils';
import { mockUnleash } from '@/mocks/mockUnleash';
import { mockSyfoveileder } from '@/mocks/syfoveileder/mockSyfoveileder';
import { mockSyfoperson } from '@/mocks/syfoperson/mockSyfoperson';
import { mockPersontildeling } from '@/mocks/persontildeling/mockPersontildeling';
import { mockPersonoversikt } from '@/mocks/personoversikt/mockPersonoversikt';
import { mockModiacontextholder } from '@/mocks/modiacontextholder/mockModiacontextholder';
import { mockFlexjar } from '@/mocks/flexjar/mockFlexjar';
import { mockEreg } from '@/mocks/ereg/mockEreg';

const generatedPersons = generatePersons(50);

const handlers: HttpHandler[] = [
  http.post('https://amplitude.nav.no/collect', () =>
    HttpResponse.text('mocked amplitude')
  ),
  mockFlexjar,
  mockUnleash,
  mockEreg,
  ...mockSyfoveileder,
  mockSyfoperson(generatedPersons),
  mockPersontildeling,
  mockPersonoversikt(generatedPersons),
  ...mockModiacontextholder,
];

export default handlers;
