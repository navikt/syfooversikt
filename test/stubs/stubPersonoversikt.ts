import nock from 'nock';
import { PERSONOVERSIKT_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { personoversiktEnhetMock } from '../../mock/data/personoversiktEnhetMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubPersonoversikt = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath)
    .get(`${PERSONOVERSIKT_ROOT}/enhet/${aktivEnhetMock.aktivEnhet}`)
    .reply(200, () => [...personoversiktEnhetMock]);
};
