import { expect } from 'chai';
import { hentPersonInfoHentet } from '../../../src/store/personInfo/personInfo_actions';
import personregisterReducer from '../../../src/store/personregister/personregisterReducer';
import {
  personoversikt,
  testdata,
} from '../../data/fellesTestdata';
import {
  hentPersonoversiktHentet,
  PersonoversiktActionTypes
} from '../../../src/store/personoversikt/personoversikt_actions';
import { PersonoversiktStatus } from '../../../src/store/personoversikt/personoversiktTypes';

const mapPersonToState = (person: PersonoversiktStatus) => {
  return {
    tildeltEnhetId: person.enhet,
    tildeltVeilederIdent: person.veilederIdent,
    harMotebehovUbehandlet: person.motebehovUbehandlet,
    harMoteplanleggerUbehandlet: person.moteplanleggerUbehandlet,
  };
};
const mapPersonerToState = (liste: PersonoversiktStatus[]) => {
  let state = {};
  liste.forEach((person) => {
    state = {
      ...state,
      [person.fnr]: mapPersonToState(person),
    };
  });
  return state;
};

describe('personregisterReducer', () => {
  describe('Henter persondata', () => {
    const initialState = Object.freeze({ });

    it(`handterer ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET}`, () => {
      const forsteAction = hentPersonoversiktHentet(personoversikt);
      const forsteState = personregisterReducer(initialState, forsteAction);
      expect(forsteState).to.deep.equal(mapPersonerToState(personoversikt));
    });

    it('handterer HENT_PERSON_INFO_HENTET', () => {
      const dataIForsteKall = [ {
        fnr: testdata.fnr1,
        navn: testdata.navn1,
        skjermingskode: testdata.skjermingskode.ingen,
      }, {
        fnr: testdata.fnr2,
        navn: testdata.navn2,
        skjermingskode: testdata.skjermingskode.ingen,
      } ];
      const dataIAndreKall = [ {
        fnr: testdata.fnr3,
        navn: testdata.navn3,
        skjermingskode: testdata.skjermingskode.ingen,
      } ];
      const forsteAction = hentPersonInfoHentet(dataIForsteKall);
      const andreAction = hentPersonInfoHentet(dataIAndreKall);
      const forsteState = personregisterReducer(initialState, forsteAction);
      expect(forsteState).to.deep.equal({
        [testdata.fnr1]: {
          navn: testdata.navn1,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        [testdata.fnr2]: {
          navn: testdata.navn2,
          skjermingskode: testdata.skjermingskode.ingen,
        },
      });
      const andreState = personregisterReducer(forsteState, andreAction);
      expect(andreState).to.deep.equal({
        [testdata.fnr1]: {
          navn: testdata.navn1,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        [testdata.fnr2]: {
          navn: testdata.navn2,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        [testdata.fnr3]: {
          navn: testdata.navn3,
          skjermingskode: testdata.skjermingskode.ingen,
        },
      });
    });

    it('handterer kombinasjoner', () => {
      const personoversiktAction = hentPersonoversiktHentet(personoversikt);
      const forsteState = personregisterReducer(initialState, personoversiktAction);
      const expForsteState = mapPersonerToState(personoversikt);
      expect(forsteState).to.deep.equal(expForsteState);

      const dataIAndreKall = [
        {
          fnr: testdata.fnr1,
          navn: testdata.navn1,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        {
          fnr: testdata.fnr2,
          navn: testdata.navn2,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        {
          fnr: testdata.fnr4,
          navn: testdata.navn3,
          skjermingskode: testdata.skjermingskode.ingen,
        } ];
      const hentPersonInfoAction = hentPersonInfoHentet(dataIAndreKall);

      const andreState = personregisterReducer(forsteState, hentPersonInfoAction);
      const expAndreState = {
        ...forsteState,
        [testdata.fnr1]: {
          ...forsteState[testdata.fnr1],
          navn: testdata.navn1,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        [testdata.fnr2]: {
          navn: testdata.navn2,
          skjermingskode: testdata.skjermingskode.ingen,
        },
        [testdata.fnr4]: {
          ...forsteState[testdata.fnr4],
          navn: testdata.navn3,
          skjermingskode: testdata.skjermingskode.ingen,
        },
      };
      expect(andreState).to.deep.equal(expAndreState);
    });
  });
});
