import { PERSONOVERSIKT_ROOT } from '@/apiConstants';
import { personoversiktEnhetMock } from '../data/personoversiktEnhetMock';
import {
  generatePersonoversiktEnhetFromPersons,
  MockPerson,
} from '../mockUtils';
import { http, HttpResponse } from 'msw';
import { SokDTO } from '@/api/types/sokDTO';

const personoversiktEnhet = (generatedPersons: MockPerson[]) => [
  ...personoversiktEnhetMock,
  ...generatePersonoversiktEnhetFromPersons(generatedPersons),
];

export const mockPersonoversikt = (generatedPersons: MockPerson[]) =>
  http.get(`${PERSONOVERSIKT_ROOT}/enhet/:id`, () =>
    HttpResponse.json(personoversiktEnhet(generatedPersons))
  );

export function mockSokPerson() {
  return http.post(`${PERSONOVERSIKT_ROOT}/search`, async ({ request }) => {
    const requestBody = (await request.json()) as SokDTO;
    // Lokalt viser vi resultater på likhet ved første forbokstav ELLER dato, for enkelhetens skyld
    const results = personoversiktEnhetMock.filter(
      (person) =>
        person.navn.toLowerCase().substring(0, 1) ===
          requestBody.initials.toLowerCase().substring(0, 1) ||
        person.fodselsdato.getTime() ===
          new Date(requestBody.birthdate).getTime()
    );
    return HttpResponse.json(results);
  });
}
