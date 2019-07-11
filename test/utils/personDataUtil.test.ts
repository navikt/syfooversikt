import { expect } from 'chai';
import { PersonData } from '../../src/store/personregister/personregisterTypes';
import {
  hendelsestype,
  hendelsestypeString,
  skjermingskode,
} from '../../src/utils/personDataUtil';
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

  describe('hendelsestype', () => {
    it('Skal returnere en string både møtebehov og møte hvis personen har begge deler', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: true,
        harMoteplanleggerUbehandlet: true,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = hendelsestype(person);

      expect(returnertString).to.equal(hendelsestypeString.motebehovMote);
    });
    it('Skal returnere en string med møtebehov hvis personen bare har møtebehov', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: true,
        harMoteplanleggerUbehandlet: false,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = hendelsestype(person);

      expect(returnertString).to.equal(hendelsestypeString.motebehov);
    });
    it('Skal returnere en string med møte hvis personen bare har møte', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        harMoteplanleggerUbehandlet: true,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = hendelsestype(person);

      expect(returnertString).to.equal(hendelsestypeString.mote);
    });
    it('Skal returnere en tom string hvis personen har ingen hendelser', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        harMoteplanleggerUbehandlet: false,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = hendelsestype(person);

      expect(returnertString).to.equal(hendelsestypeString.ingen);
    });
  });
});
