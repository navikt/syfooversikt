import nock from 'nock';
import { FLEXJAR_ROOT } from '@/apiConstants';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubFlexjarApiOk = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath).post(`${FLEXJAR_ROOT}/feedback/azure`).reply(200);
};

export const stubFlexjarApiError = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath).post(`${FLEXJAR_ROOT}/feedback/azure`).reply(500);
};
