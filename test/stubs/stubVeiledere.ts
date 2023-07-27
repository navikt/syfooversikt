import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { veiledereMock } from '../../mock/data/veiledereMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubVeiledere = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(`${SYFOVEILEDER_ROOT}/veiledere/enhet/${aktivEnhetMock.aktivEnhet}`)
    .reply(200, () => [...veiledereMock]);
};
