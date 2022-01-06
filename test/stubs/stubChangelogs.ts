import nock from 'nock';
import { CHANGELOG_ROOT } from '@/utils/apiUrlUtil';
import axios from 'axios';
import changelogsMockData from '../../mock/data/changelogs.json';
import { nockBasePath } from './nockDefaults';

export const stubChangelogs = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(CHANGELOG_ROOT)
    .reply(200, () => [...changelogsMockData]);
};
