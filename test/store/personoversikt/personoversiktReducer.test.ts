import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import personoversiktReducer from '../../../src/store/personoversikt/personoversiktReducer';
import {
  PersonoversiktActionTypes,
  hentPersonoversiktHenter,
  hentPersonoversiktHentet,
  hentPersonoversiktFeilet,
} from '../../../src/store/personoversikt/personoversikt_actions';
import { personoversikt } from '../../data/fellesTestdata';

describe('personoversiktReducer', () => {
  describe('Henter personoversikt', () => {
    const initialState = deepFreeze({
      hentet: false,
      henter: false,
      hentingFeilet: false,
      data: [],
    });

    it(`handterer ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER}`, () => {
      const action = hentPersonoversiktHenter();
      const nesteState = personoversiktReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: true,
      });
    });

    it(`handterer ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET}`, () => {
      const data = [...personoversikt];
      const action = hentPersonoversiktHentet(data);
      const nesteState = personoversiktReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        hentet: true,
        henter: false,
        data,
      });
    });

    it(`handterer ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FEILET}`, () => {
      const action = hentPersonoversiktFeilet();
      const nesteState = personoversiktReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: false,
        hentingFeilet: true,
        data: [],
      });
    });
  });
});
