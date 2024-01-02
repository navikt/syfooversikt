import nock from 'nock';
import { MODIACONTEXTHOLDER_ROOT } from '@/apiConstants';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubModiaContext = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath)
    .get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`)
    .reply(200, {
      ...aktivEnhetMock,
    });
};
