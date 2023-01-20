import React from 'react';
import { testdata, veiledere } from '../data/fellesTestdata';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { Personrad } from '@/components/Personrad';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { formatNameCorrectly } from '@/utils/lenkeUtil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';

let queryClient: QueryClient;

const renderPersonrad = (personData: PersonData) =>
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

describe('Personrad', () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('Skal rendre riktig navn, fodselsnummer og skjermingskode', () => {
    const personData: PersonData = {
      navn: testdata.navn1,
      harMotebehovUbehandlet: false,
      harDialogmotesvar: false,
      skjermingskode: testdata.skjermingskode
        .diskresjonsmerket as Skjermingskode,
      markert: false,
      harOppfolgingsplanLPSBistandUbehandlet: false,
      tildeltEnhetId: '123',
      tildeltVeilederIdent: '234',
      aktivitetskrav: null,
      aktivitetskravUpdatedAt: null,
      aktivitetskravStoppunkt: null,
    };
    renderPersonrad(personData);

    expect(
      screen.getByRole('link', { name: formatNameCorrectly(personData.navn) })
    ).to.exist;
    expect(screen.getByText(testdata.fnr1)).to.exist;
    expect(screen.getByText('diskresjonsmerket')).to.exist;
  });
  it('Skal rendre label med dato for aktivitetskrav AVVENT', () => {
    const personData: PersonData = {
      navn: testdata.navn1,
      harMotebehovUbehandlet: false,
      harDialogmotesvar: false,
      skjermingskode: 'INGEN',
      markert: false,
      harOppfolgingsplanLPSBistandUbehandlet: false,
      tildeltEnhetId: '123',
      tildeltVeilederIdent: '234',
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravUpdatedAt: new Date('2022-12-01'),
      aktivitetskravStoppunkt: new Date('2022-12-01'),
    };
    renderPersonrad(personData);

    expect(screen.getByText('Avventer (01.12.2022)')).to.exist;
  });
});
