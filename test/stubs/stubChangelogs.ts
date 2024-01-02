import nock from 'nock';
import { CHANGELOG_ROOT } from '@/apiConstants';
import axios from 'axios';
import { changelogsMock } from '../../mock/data/changelogsMock';
import { nockBasePath } from './nockDefaults';

export const stubChangelogs = () => {
  axios.defaults.adapter = 'http';

  nock(nockBasePath)
    .get(CHANGELOG_ROOT)
    .reply(200, () => [...changelogsMock]);
};
