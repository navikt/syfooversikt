import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationContext } from '@/context/notification/NotificationContext';
import OversiktContainer from '@/sider/oversikt/OversiktContainer';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { FilterProvider } from '@/context/filters/FilterContext';
import {
  FetchVeiledereFailed,
  Notification,
} from '@/context/notification/Notifications';
import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getQueryClientWithMockdata } from '../testQueryClient';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { unleashMock } from '@/mocks/mockUnleash';
import { StoreKey } from '@/hooks/useLocalStorageState';
import { addWeeks } from '@/utils/dateUtils';
import { renderWithRouter } from '../testRenderUtils';
import { routes } from '@/routers/routes';
import { veilederMock } from '@/mocks/syfoveileder/veilederMock';
import userEvent from '@testing-library/user-event';

let queryClient: QueryClient;

function renderOversikten(notifications: Notification[] = []) {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
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
            <OversiktContainer />
          </AktivEnhetContext.Provider>
        </NotificationContext.Provider>
      </FilterProvider>
    </QueryClientProvider>,
    routes.ENHET_OVERSIKT
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
        unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, veilederMock.ident),
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

  describe('Ufordelte brukere filter', () => {
    it('shows ufordelte brukere filter', () => {
      renderOversikten();

      expect(screen.getByRole('checkbox', { name: /Ufordelte brukere/ })).to
        .exist;
    });
  });

  describe('VeilederFilter', () => {
    it('should display the correct options', async () => {
      renderOversikten();

      const combobox = screen.getByRole('combobox', {
        name: 'Veiledere',
      });
      expect(combobox).to.exist;

      expect(screen.getByRole('option', { name: 'E_Z101010, F_Z101010' })).to
        .exist;
      expect(screen.getByRole('option', { name: 'Eder, Veil' })).to.exist;
      expect(screen.getByRole('option', { name: 'Bakeri, Støren' })).to.exist;
      expect(screen.getByRole('option', { name: 'Mulder, Fox' })).to.exist;
    });

    it('should display the correct sykmeldte when filtering', async () => {
      renderOversikten();

      const combobox = screen.getByRole('combobox', {
        name: 'Veiledere',
      });

      await userEvent.click(combobox);
      const formOption = await screen.findByRole('option', {
        name: 'Mulder, Fox',
      });
      await userEvent.click(formOption);
      await screen.findByRole('button', { name: 'Mulder, Fox slett' });

      const table = await screen.findByRole('table');
      expect(table).to.exist;
      const allRows = within(table).getAllByRole('row');
      const dataRowsCount = allRows.length - 1; // Exclude header row

      expect(dataRowsCount).to.equal(3);
      expect(within(table).getByText('Heisen, Gulv')).to.exist;
      expect(within(table).getByText('Sengestad, Stol')).to.exist;
      expect(within(table).getByText('Plantesen, Bord')).to.exist;
    });
  });
});
