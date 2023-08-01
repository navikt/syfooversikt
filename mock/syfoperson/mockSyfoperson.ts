import { SYFOPERSON_ROOT } from '../../src/apiConstants';
import express from 'express';
import { personInfoMock } from '../data/personInfoMock';
import { MockPerson } from '../mockUtils';

const personInfo = (generatedPersons: MockPerson[]) => [
  ...personInfoMock,
  ...generatedPersons,
];

export const mockSyfoperson = (
  server: express.Application,
  generatedPersons: MockPerson[]
) => {
  server.post(
    `${SYFOPERSON_ROOT}/person/info`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personInfo(generatedPersons)));
    }
  );
};
