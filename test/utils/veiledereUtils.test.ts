import { describe, expect, it } from 'vitest';
import { filterVeiledereWithActiveOppgave } from '@/utils/veiledereUtils';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { VeilederDTO } from '@/api/types/veiledereTypes';

describe('veiledere utils', () => {
  describe('filterVeiledereWithActiveOppgave', () => {
    it('Returns empty list if no oppgaver', () => {
      const veiledere: VeilederDTO[] = [
        {
          ident: 'Z999999',
          fornavn: 'Vei',
          etternavn: 'Leder',
          epost: 'vei.leder@veileder.no',
          telefonnummer: undefined,
        },
      ];
      const personOversiktStatus = [] as PersonOversiktStatusDTO[];

      const veiledereWithOppgaver = filterVeiledereWithActiveOppgave(
        veiledere,
        personOversiktStatus
      );

      expect(veiledereWithOppgaver.length).to.equal(0);
    });

    it('Returns list of veiledere with tildelte personer', () => {
      const tildeltVeileder = 'Z999999';
      const veiledere = [
        {
          ident: tildeltVeileder,
          fornavn: 'Vei',
          etternavn: 'Leder',
          epost: 'vei.leder@veileder.no',
          telefonnummer: undefined,
        },
        {
          ident: 'X000000',
          fornavn: 'Ingen',
          etternavn: 'Oppgaver',
          epost: 'ingen.oppgaver@veileder.no',
          telefonnummer: undefined,
        },
      ];
      const personOversiktStatus = [
        {
          veilederIdent: tildeltVeileder,
        },
      ] as PersonOversiktStatusDTO[];

      const veiledereWithOppgaver = filterVeiledereWithActiveOppgave(
        veiledere,
        personOversiktStatus
      );

      expect(veiledereWithOppgaver.length).to.equal(1);
      expect(veiledereWithOppgaver[0]?.ident).to.equal(tildeltVeileder);
    });
  });
});
