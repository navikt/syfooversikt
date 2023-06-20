import { SYFOPERSON_ROOT } from '../../src/apiConstants';

import * as mockUtils from '../mockUtils';
import express from 'express';

const personInfo = (generatedPersons: any) => [
  ...mockUtils.personInfo,
  ...generatedPersons,
];

export const mockSyfoperson = (
  server: express.Application,
  generatedPersons: any
) => {
  server.post(
    `${SYFOPERSON_ROOT}/person/info`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personInfo(generatedPersons)));
    }
  );
};
