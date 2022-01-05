import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Filterable } from '@/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';

let queryClient: QueryClient;
let component: RenderResult;

describe('Sokeresultat', () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    stubAktivVeileder();
    component = render(
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <AktivEnhetProvider>
            <Sokeresultat allEvents={new Filterable(personregister)} />
          </AktivEnhetProvider>
        </QueryClientProvider>
      </NotificationProvider>
    );
  });

  it('Skal inneholde knapperad', () => {
    expect(component.getByRole('button', { name: 'Tildel veileder' })).to.exist;
    expect(component.getByRole('button', { name: 'Søk veileder (0)' })).to
      .exist;
    const velgAlleCheckbox = component.getByRole('checkbox', {
      name: 'Velg alle',
      checked: false,
    });
    expect(velgAlleCheckbox).to.exist;
  });

  it('Skal inneholde liste av personer', () => {
    expect(component.getByRole('link', { name: 'Et Navn' })).to.exist;
    expect(component.getByRole('link', { name: 'Et Annet Navn' })).to.exist;
  });
});
