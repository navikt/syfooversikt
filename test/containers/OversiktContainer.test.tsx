import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NotificationContext } from '@/context/notification/NotificationContext';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { FetchVeiledereFailed } from '@/context/notification/Notifications';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { enhetOversiktRoutePath } from '@/routers/AppRouter';
import { testQueryClient } from '../testQueryClient';

describe('OversiktContainer', () => {
  const queryClient = testQueryClient();

  it('Skal vise notifikasjon ved feilende apikall', async () => {
    stubPersonoversikt();
    stubPersonregister();
    stubAktivVeileder();
    stubModiaContext();
    stubVeiledere();

    render(
      <MemoryRouter initialEntries={[enhetOversiktRoutePath]}>
        <Routes>
          <Route
            path={enhetOversiktRoutePath}
            element={
              <NotificationContext.Provider
                value={{
                  notifications: [FetchVeiledereFailed],
                  displayNotification: () => void 0,
                  clearNotification: () => void 0,
                }}
              >
                <AktivEnhetContext.Provider
                  value={{
                    aktivEnhet: aktivEnhetMock.aktivEnhet,
                    handleAktivEnhetChanged: () => void 0,
                  }}
                >
                  <QueryClientProvider client={queryClient}>
                    <OversiktContainer
                      tabType={OverviewTabType.ENHET_OVERVIEW}
                    />
                  </QueryClientProvider>
                </AktivEnhetContext.Provider>
              </NotificationContext.Provider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(FetchVeiledereFailed.message)).to.exist;
  });
});
