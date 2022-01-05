import { expect } from 'chai';
import { PersonHendelseData } from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { Fodselsnummer } from '@/api/types/personInfoTypes';
import { hentFodselsnummerFraPersonHendelseListe } from '@/components/utils/util';

describe('utils', () => {
  describe('hentFodselsnummerFraPersonHendelseListe', () => {
    it('Skal returnere en liste med Fodselsnummer fra en liste med personhendelser', () => {
      const svarListe: PersonHendelseData[] = [
        {
          fnr: testdata.fnr1,
          skjermingskode: testdata.skjermingskode.ingen,
        } as PersonHendelseData,
        {
          fnr: testdata.fnr2,
          skjermingskode: testdata.skjermingskode.egenAnsatt,
        } as PersonHendelseData,
      ];

      const forventetListe: Fodselsnummer[] = [
        {
          fnr: testdata.fnr1,
        },
        {
          fnr: testdata.fnr2,
        },
      ];

      const returnertListe = hentFodselsnummerFraPersonHendelseListe(svarListe);

      expect(returnertListe).to.deep.equal(forventetListe);
    });
  });
});
