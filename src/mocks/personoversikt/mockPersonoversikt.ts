import { PERSONOVERSIKT_ROOT } from '@/apiConstants';
import { personoversiktEnhetMock } from '../data/personoversiktEnhetMock';
import {
  generatePersonoversiktEnhetFromPersons,
  MockPerson,
} from '../mockUtils';
import { http, HttpResponse } from 'msw';

const personoversiktEnhet = (generatedPersons: MockPerson[]) => [
  ...personoversiktEnhetMock,
  ...generatePersonoversiktEnhetFromPersons(generatedPersons),
];

export const mockPersonoversikt = (generatedPersons: MockPerson[]) =>
  http.get(`${PERSONOVERSIKT_ROOT}/enhet/:id`, () =>
    HttpResponse.json(personoversiktEnhet(generatedPersons))
  );
