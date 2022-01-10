import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { MemoryRouter, Route } from 'react-router-dom';
import { NotificationContext } from '@/context/notification/NotificationContext';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { stubVeiledere } from '../stubs/stubVeiledere';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import { FetchVeiledereFailed } from '@/context/notification/Notifications';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';

describe('OversiktContainer', () => {
  const queryClient = new QueryClient();

  it('Skal vise notifikasjon ved feilende apikall', async () => {
    stubPersonoversikt();
    stubPersonregister();
    stubAktivVeileder();
    stubModiaContext();
    stubVeiledere();

    render(
      <MemoryRouter initialEntries={['/enhet']}>
        <Route path="/enhet">
          <NotificationContext.Provider
            value={{
              notifications: [FetchVeiledereFailed],
              displayNotification: () => void 0,
              clearNotification: () => void 0,
            }}
          >
            <AktivEnhetContext.Provider
              value={{
                aktivEnhet: aktivEnhetMockData.aktivEnhet,
                handleAktivEnhetChanged: () => void 0,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
              </QueryClientProvider>
            </AktivEnhetContext.Provider>
          </NotificationContext.Provider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByText(FetchVeiledereFailed.message)).to.exist;
  });
});
