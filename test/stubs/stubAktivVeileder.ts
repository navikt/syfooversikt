import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '@/apiConstants';
import { veilederMock } from '../../mock/data/veilederMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubAktivVeileder = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath)
    .get(`${SYFOVEILEDER_ROOT}/veiledere/self`)
    .reply(200, {
      ...veilederMock,
    });
};
