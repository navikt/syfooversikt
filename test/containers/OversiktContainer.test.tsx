import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import {
  FetchVeiledereFailed,
  Notification,
} from '@/context/notification/Notifications';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { enhetOversiktRoutePath } from '@/routers/AppRouter';
import { getQueryClientWithMockdata } from '../testQueryClient';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { unleashMock } from '@/mocks/mockUnleash';
import { StoreKey } from '@/hooks/useLocalStorageState';
import { addWeeks } from '@/utils/dateUtils';

let queryClient: QueryClient;

function renderOversikten(notifications: Notification[] = []) {
  return render(
    <MemoryRouter initialEntries={[enhetOversiktRoutePath]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path={enhetOversiktRoutePath}
            element={
              <NotificationContext.Provider
                value={{
                  notifications: notifications,
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
                  <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
                </AktivEnhetContext.Provider>
              </NotificationContext.Provider>
            }
          ></Route>
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('OversiktContainer', () => {
  beforeEach(() => {
    queryClient = getQueryClientWithMockdata();
    localStorage.setItem(StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE, '');
  });

  afterEach(() => {
    localStorage.setItem(StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE, '');
  });

  it('Skal vise notifikasjon ved feilende apikall', async () => {
    stubPersonoversikt();
    stubPersonregister();
    stubAktivVeileder();
    stubModiaContext();
    stubVeiledere();

    renderOversikten([FetchVeiledereFailed]);

    expect(screen.getByText(FetchVeiledereFailed.message)).to.exist;
  });

  describe('Flexjar', () => {
    it('shows flexjar when toggle and no previous answer', () => {
      renderOversikten();

      expect(screen.getByRole('button', { name: 'Vi ønsker å lære av deg' })).to
        .exist;
    });

    it('does not show flexjar when previous answer within 3 weeks', () => {
      localStorage.setItem(
        StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
        new Date().toString()
      );
      renderOversikten();

      expect(screen.getByRole('button', { name: 'Vi ønsker å lære av deg' })).to
        .exist;
    });

    it('shows flexjar when previous answer more than 3 weeks ago', () => {
      localStorage.setItem(
        StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
        addWeeks(new Date(), -4).toString()
      );
      renderOversikten();

      expect(screen.getByRole('button', { name: 'Vi ønsker å lære av deg' })).to
        .exist;
    });

    it('does not show flexjar when toggle off', () => {
      queryClient.setQueryData(
        unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, ''),
        () => [
          {
            ...unleashMock,
            isFlexjarArenaEnabled: false,
          },
        ]
      );

      renderOversikten();

      expect(screen.queryByRole('button', { name: 'Vi ønsker å lære av deg' }))
        .to.not.exist;
    });
  });
});
