import { SYFOPERSON_ROOT } from '@/apiConstants';
import { personInfoMock } from '../data/personInfoMock';
import { MockPerson } from '../mockUtils';
import { http, HttpResponse } from 'msw';

const personInfo = (generatedPersons: MockPerson[]) => [
  ...personInfoMock,
  ...generatedPersons,
];

export const mockSyfoperson = (generatedPersons: MockPerson[]) =>
  http.post(`${SYFOPERSON_ROOT}/person/info`, () =>
    HttpResponse.json(personInfo(generatedPersons))
  );
