import React from 'react';
import Sokeresultat from '@/sider/oversikt/sokeresultat/Sokeresultat';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Filterable } from '@/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FilterContext } from '@/context/filters/FilterContext';
import { FilterState } from '@/context/filters/filterContextState';
import { testQueryClient } from '../testQueryClient';
import { renderWithRouter } from '../testRenderUtils';
import { routes } from '@/routers/routes';

let queryClient: QueryClient;

const renderSokeresultat = () =>
  renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <Sokeresultat allEvents={new Filterable(personregister)} />
        </AktivEnhetProvider>
      </QueryClientProvider>
    </NotificationProvider>,
    routes.ENHET_OVERSIKT
  );

describe('Sokeresultat', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    stubAktivVeileder();
  });

  it('Skal inneholde knapperad', () => {
    renderSokeresultat();
    expect(screen.getByRole('button', { name: 'Tildel veileder' })).to.exist;
    const velgAlleCheckbox = screen.getByRole('checkbox', {
      name: 'Velg alle',
      checked: false,
    });
    expect(velgAlleCheckbox).to.exist;
  });

  it('Skal inneholde liste av personer', () => {
    renderSokeresultat();
    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.getByRole('link', { name: 'Navn, Et Annet' })).to.exist;
  });

  it('Filters søkeresultat by motedatasvar', () => {
    const filterSetMotedatasvar: FilterState = {
      tekstFilter: '',
      selectedVeilederIdents: [],
      selectedOptions: [],
      selectedCompanies: [],
      selectedBirthDates: [],
      selectedFristFilters: [],
      selectedAgeFilters: [],
      selectedHendelseType: {
        arbeidsgiverOnskerMote: false,
        onskerMote: false,
        dialogmotekandidat: false,
        dialogmotesvar: true,
        behandlerdialog: false,
        oppfolgingsoppgave: false,
        behandlerBerOmBistand: false,
        isAktivArbeidsuforhetvurdering: false,
        harFriskmeldingTilArbeidsformidling: false,
        isSenOppfolgingChecked: false,
        isAktivitetskravChecked: false,
        isAktivitetskravVurderStansChecked: false,
        isManglendeMedvirkningChecked: false,
      },
      isUfordelteBrukereFilter: false,
    };

    renderWithRouter(
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <FilterContext.Provider
            value={{
              filterState: filterSetMotedatasvar,
              dispatch: () => undefined,
            }}
          >
            <AktivEnhetProvider>
              <Sokeresultat allEvents={new Filterable(personregister)} />
            </AktivEnhetProvider>
          </FilterContext.Provider>
        </QueryClientProvider>
      </NotificationProvider>,
      routes.ENHET_OVERSIKT
    );
    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.queryByRole('link', { name: 'Navn, Et Annet' })).to.not.exist;
  });
});
