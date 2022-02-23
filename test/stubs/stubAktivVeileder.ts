import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '@/utils/apiUrlUtil';
import veilederInfoMockData from '../../mock/data/veilederInfo.json';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubAktivVeileder = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(`${SYFOVEILEDER_ROOT}/v2/veileder/self`)
    .reply(200, {
      ...veilederInfoMockData,
    });
};
