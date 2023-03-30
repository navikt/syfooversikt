import { expect } from 'chai';
import { filterVeiledereWithActiveOppgave } from '@/utils/veiledereUtils';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';

describe('veiledere utils', () => {
  describe('filterVeiledereWithActiveOppgave', () => {
    it('Returns empty list if no oppgaver', () => {
      const veiledere = [
        {
          ident: 'Z999999',
          fornavn: 'Vei',
          etternavn: 'Leder',
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
        },
        {
          ident: 'X000000',
          fornavn: 'Ingen',
          etternavn: 'Oppgaver',
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
