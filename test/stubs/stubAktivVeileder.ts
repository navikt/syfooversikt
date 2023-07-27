import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { veilederInfoMock } from '../../mock/data/veilederInfoMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubAktivVeileder = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(`${SYFOVEILEDER_ROOT}/veileder/self`)
    .reply(200, {
      ...veilederInfoMock,
    });
};
