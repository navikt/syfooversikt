import { describe, expect, it } from 'vitest';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import { testdata } from '../data/fellesTestdata';

const INGEN = 'Ingen';
const EGEN_ANSATT = 'Egen ansatt';

describe('personDataUtils', () => {
  describe('getReadableSkjermingskode', () => {
    it('returns string with lowercase letters and underscore removed', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        skjermingskode: testdata.skjermingskode.egenAnsatt,
      } as PersonData;

      const returnertString = getReadableSkjermingskode(person.skjermingskode);

      expect(returnertString).to.equal(EGEN_ANSATT);
    });
    it('returns lowercase "ingen" if kode is "INGEN"', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        skjermingskode: testdata.skjermingskode.ingen,
      } as PersonData;

      const returnertString = getReadableSkjermingskode(person.skjermingskode);

      expect(returnertString).to.equal(INGEN);
    });
  });
});
