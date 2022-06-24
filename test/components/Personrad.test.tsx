import React from 'react';
import { testdata, veiledere } from '../data/fellesTestdata';
import { Skjermingskode } from '@/api/types/personregisterTypes';
import { Personrad } from '@/components/Personrad';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { formaterNavn } from '@/utils/lenkeUtil';
import { QueryClient, QueryClientProvider } from 'react-query';

const personData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harDialogmotesvar: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  markert: false,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltEnhetId: '123',
  tildeltVeilederIdent: '234',
};

let queryClient: QueryClient;

describe('Personrad', () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('Skal rendre riktig navn, fodselsnummer og skjermingskode', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Personrad
          index={1}
          fnr={testdata.fnr1}
          veilederName={`${veiledere[0]?.etternavn}, ${veiledere[0]?.fornavn}`}
          personData={personData}
          checkboxHandler={() => void 0}
          kryssAv={false}
        />
      </QueryClientProvider>
    );
    expect(screen.getByRole('link', { name: formaterNavn(personData.navn) })).to
      .exist;
    expect(screen.getByText(testdata.fnr1)).to.exist;
    expect(screen.getByText('diskresjonsmerket')).to.exist;
  });
});
