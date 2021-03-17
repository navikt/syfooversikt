import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { PersonInfoActionTypes } from '../../../src/store/personInfo/personInfo_actions';
import {
  hentPersonInfoForespurt,
  hentPersonInfoHenter,
  hentPersonInfoHentet,
  hentPersonInfoFeilet,
} from '../../../src/store/personInfo/personInfo_actions';
import { testdata } from '../../data/fellesTestdata';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('personInfo_actions', () => {
  it('hentPersonInfoForespurt() skal returnere riktig action', () => {
    const fnrListe = [{ fnr: testdata.fnr1 }];
    expect(hentPersonInfoForespurt(fnrListe)).to.deep.equal({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
      data: fnrListe,
    });
  });

  it('hentPersonInfoHenter() skal returnere riktig action', () => {
    expect(hentPersonInfoHenter()).to.deep.equal({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTER,
    });
  });

  it('hentPersonInfoHentet() skal returnere riktig action', () => {
    const personInfoSvar = [
      {
        fnr: testdata.fnr1,
        skjermingskode: testdata.skjermingskode.ingen,
      },
    ];
    expect(hentPersonInfoHentet(personInfoSvar)).to.deep.equal({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTET,
      data: personInfoSvar,
    });
  });

  it('hentPersonInfoFeilet() skal returnere riktig action', () => {
    expect(hentPersonInfoFeilet()).to.deep.equal({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_FEILET,
    });
  });
});
