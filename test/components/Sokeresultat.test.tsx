import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Filterable } from '@/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { FilterContext } from '@/context/filters/FilterContext';
import { FilterState } from '@/context/filters/filterContextState';
import { testQueryClient } from '../testQueryClient';

let queryClient: QueryClient;

const renderSokeresultat = () =>
  render(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <Sokeresultat allEvents={new Filterable(personregister)} />
        </AktivEnhetProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );

describe('Sokeresultat', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    stubAktivVeileder();
  });

  it('Skal inneholde knapperad', () => {
    renderSokeresultat();
    expect(screen.getByRole('button', { name: 'Tildel veileder' })).to.exist;
    expect(screen.getByRole('button', { name: 'Søk veileder (0)' })).to.exist;
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
      selectedHendelseType: {
        arbeidsgiverOnskerMote: false,
        onskerMote: false,
        ufordeltBruker: false,
        dialogmotekandidat: false,
        dialogmotesvar: true,
        aktivitetskrav: false,
        behandlerdialog: false,
      },
    };

    render(
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
      </NotificationProvider>
    );
    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.queryByRole('link', { name: 'Navn, Et Annet' })).to.not.exist;
  });
});
