import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Filterable } from '@/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';

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
    queryClient = new QueryClient();
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
    expect(screen.getByRole('link', { name: 'Et Navn' })).to.exist;
    expect(screen.getByRole('link', { name: 'Et Annet Navn' })).to.exist;
  });
});
