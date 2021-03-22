import { expect } from 'chai';
import personInfoReducer from '../../../src/store/personInfo/personInfoReducer';
import {
  hentPersonInfoFeilet,
  hentPersonInfoHenter,
  hentPersonInfoHentet,
  PersonInfoActionTypes,
} from '../../../src/store/personInfo/personInfo_actions';
import { testdata } from '../../data/fellesTestdata';

describe('personInfoReducer', () => {
  describe('Henter info paa personer', () => {
    const initialState = {
      hentet: false,
      henter: false,
      hentingFeilet: false,
      data: [],
    };

    it(`handterer ${PersonInfoActionTypes.HENT_PERSON_INFO_HENTER}`, () => {
      const action = hentPersonInfoHenter();
      const nesteState = personInfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        hentet: false,
        henter: true,
        hentingFeilet: false,
        data: [],
      });
    });

    it(`handterer ${PersonInfoActionTypes.HENT_PERSON_INFO_HENTET}`, () => {
      const personInfoSvar = [
        {
          fnr: testdata.fnr1,
          skjermingskode: testdata.skjermingskode.ingen,
        },
      ];
      const action = hentPersonInfoHentet(personInfoSvar);
      const nesteState = personInfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        hentet: true,
        henter: false,
        hentingFeilet: false,
        data: personInfoSvar,
      });
    });

    it(`handterer ${PersonInfoActionTypes.HENT_PERSON_INFO_FEILET}`, () => {
      const action = hentPersonInfoFeilet();
      const nesteState = personInfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        hentet: false,
        henter: false,
        hentingFeilet: true,
        data: [],
      });
    });
  });
});
