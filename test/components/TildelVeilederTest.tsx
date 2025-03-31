import { beforeEach, describe, expect, it } from 'vitest';
import {
  getQueryClientWithMockdata,
  testQueryClient,
} from '../testQueryClient';
import { renderWithRouter } from '../testRenderUtils';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { routes } from '@/routers/routes';
import React from 'react';
import TildelVeileder from '@/sider/oversikt/sokeresultat/toolbar/TildelVeileder';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veiledereMock } from '@/mocks/data/veiledereMock';
import { screen } from '@testing-library/react';
import { generatePerson } from '@/mocks/mockUtils';
import userEvent from '@testing-library/user-event';

let queryClient = testQueryClient();
const aktivEnhet = aktivEnhetMock.aktivEnhet;
const selectedFnr = generatePerson().fnr;

const renderTildelVeileder = () =>
  renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <TildelVeileder
            selectedPersoner={[selectedFnr]}
            handleSelectAll={() => void 0}
          />
        </AktivEnhetContext.Provider>
      </QueryClientProvider>
    </NotificationProvider>,
    routes.ENHET_OVERSIKT
  );

describe('TildelVeileder', () => {
  beforeEach(() => {
    queryClient = getQueryClientWithMockdata();
    queryClient.setQueriesData(
      { queryKey: veiledereQueryKeys.veiledereForEnhet(aktivEnhet) },
      () => veiledereMock
    );
  });

  it('viser bare enabled veiledere i dropdown', async () => {
    renderTildelVeileder();
    const tildelButton = screen.getByRole('button', {
      name: 'Tildel veileder',
    });
    await userEvent.click(tildelButton);

    const enabledVeiledere = veiledereMock.filter(
      (veileder) => veileder.enabled
    );
    const veilederOptions = screen.getAllByRole('radio');
    expect(veilederOptions).toHaveLength(enabledVeiledere.length);
  });
});
