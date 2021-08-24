import nock from 'nock';
import { CHANGELOG_ROOT } from '../../src/utils/apiUrlUtil';
import axios from 'axios';
import changelogsMockData from '../../Mock/Data/changelogs.json';

export const stubChangelogs = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock('http://localhost:80')
    .get(CHANGELOG_ROOT)
    .reply(200, () => [...changelogsMockData]);
};
