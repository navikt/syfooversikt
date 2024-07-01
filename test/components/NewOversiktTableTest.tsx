import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { personregister, testdata } from '../data/fellesTestdata';
import React from 'react';
import { testQueryClient } from '../testQueryClient';
import { NewOversiktTable } from '@/components/NewOversiktTable';
import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { formatNameCorrectly } from '@/utils/lenkeUtil';

const queryClient = testQueryClient();

const defaultPersonData: PersonData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harDialogmotesvar: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  markert: false,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltEnhetId: '123',
  tildeltVeilederIdent: '234',
  aktivitetskrav: null,
  aktivitetskravActive: false,
  aktivitetskravVurderingFrist: null,
  harBehandlerdialogUbehandlet: false,
  harAktivitetskravVurderStansUbehandlet: false,
  behandlerBerOmBistandUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  snartSluttPaSykepengene: null,
  oppfolgingsoppgave: null,
};
const personDataAktivitetskravAvventUtenFrist: PersonData = {
  ...defaultPersonData,
  aktivitetskrav: AktivitetskravStatus.AVVENT,
  aktivitetskravActive: true,
  aktivitetskravVurderingFrist: null,
};
const personDataAktivitetskravAvventMedFrist: PersonData = {
  ...personDataAktivitetskravAvventUtenFrist,
  aktivitetskravVurderingFrist: new Date('2023-04-01'),
};
const personWithOppfolgingstilfelle: PersonData = {
  ...defaultPersonData,
  latestOppfolgingstilfelle: {
    oppfolgingstilfelleStart: new Date('2023-01-01'),
    oppfolgingstilfelleEnd: new Date('2023-01-15'),
    varighetUker: 2,
    virksomhetList: [],
  },
};

const renderOversikt = (personer: PersonregisterState) =>
  render(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <NewOversiktTable
            personListe={Object.entries(personer)}
            selectedRows={[]}
            setSelectedRows={() => void 0}
            setSorting={() => void 0}
            sorting={{ orderBy: 'FNR', direction: 'ascending' }}
          />
        </AktivEnhetProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );

describe('NewOversiktTable', () => {
  it('rendrer overskrifter for navn, fodselsnummer, virksomhet og veileder', () => {
    renderOversikt(personregister);

    expect(screen.getByText('Navn')).to.exist;
    expect(screen.getByText('Fødselsnummer')).to.exist;
    expect(screen.getByText('Virksomhet')).to.exist;
    expect(screen.getByText('Veileder')).to.exist;
  });
  it('rendrer en rad per person', () => {
    renderOversikt(personregister);

    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.getByRole('link', { name: 'Navn, Et Annet' })).to.exist;
  });

  it('Skal rendre riktig navn, fodselsnummer og ikon for skjermingskode', () => {
    renderOversikt({ [testdata.fnr1]: defaultPersonData });

    expect(
      screen.getByRole('link', {
        name: formatNameCorrectly(defaultPersonData.navn),
      })
    ).to.exist;
    expect(screen.getByText(testdata.fnr1)).to.exist;
    expect(screen.getByRole('img')).to.exist;
  });

  it('Rendrer ikke ikon når person mangler skjermingskode', () => {
    renderOversikt({
      [testdata.fnr1]: { ...defaultPersonData, skjermingskode: 'INGEN' },
    });

    expect(screen.queryByRole('img')).to.not.exist;
  });

  it('Skal rendre frist-dato for aktivitetskrav AVVENT', () => {
    renderOversikt({ [testdata.fnr1]: personDataAktivitetskravAvventMedFrist });

    expect(screen.getByText('01.04.2023')).to.exist;
  });

  it('Rendrer ingen frist-dato for aktivitetskrav AVVENT når frist mangler', () => {
    renderOversikt({
      [testdata.fnr1]: personDataAktivitetskravAvventUtenFrist,
    });

    expect(screen.queryByText('01.04.2023')).to.not.exist;
  });

  it('Viser riktig utregning av varighet på sykefraværet', () => {
    renderOversikt({ [testdata.fnr1]: personWithOppfolgingstilfelle });

    expect(screen.getByText('2 uker')).to.exist;
  });
});
