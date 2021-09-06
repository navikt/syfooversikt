import { expect } from 'chai';
import { PersonData } from '../../src/api/types/personregisterTypes';
import { skjermingskode } from '../../src/utils/personDataUtil';
import { testdata } from '../data/fellesTestdata';

const INGEN = '';
const EGEN_ANSATT = 'egen ansatt';

describe('personDataUtils', () => {
  describe('skjermingskode', () => {
    it('Skal returnere en string med skjermingskode med små bokstaver og mellomrom hvis koden ikke er INGEN', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        harMoteplanleggerUbehandlet: false,
        skjermingskode: testdata.skjermingskode.egenAnsatt,
        markert: false,
      } as PersonData;

      const returnertString = skjermingskode(person);

      expect(returnertString).to.equal(EGEN_ANSATT);
    });
    it('Skal returnere en tom string hvis koden er INGEN', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        harMoteplanleggerUbehandlet: false,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = skjermingskode(person);

      expect(returnertString).to.equal(INGEN);
    });
  });
});
