import {
  getQueryClientWithMockdata,
  testQueryClient,
} from '../testQueryClient';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { renderWithRouter } from '../testRenderUtils';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { routes } from '@/routers/routes';
import { beforeEach, describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veiledereMock } from '@/mocks/data/veiledereMock';
import React from 'react';
import TildelOppfolgingsenhetModal from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetModal';
import { stubTildelOppfolgingsenhet } from '../stubs/stubTildelOppfolgingsenhet';
import { personoversiktEnhetMock } from '@/mocks/data/personoversiktEnhetMock';
import userEvent from '@testing-library/user-event';

let queryClient = testQueryClient();
const aktivEnhet = aktivEnhetMock.aktivEnhet;
const selectedFnr = personoversiktEnhetMock[0]?.fnr || '';
const modalRef = React.createRef<HTMLDialogElement>();

const renderTildelOppfolgingsenhetModal = () =>
  renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <TildelOppfolgingsenhetModal
            ref={modalRef}
            selectedPersoner={[selectedFnr]}
            setSelectedPersoner={() => void 0}
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

  it('Skal vise modal', async () => {
    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    const modal = await screen.findByRole('dialog', { hidden: true });
    expect(await screen.findByText('Velg ny oppfølgingsenhet')).to.exist;

    expect(
      within(modal).getByRole('heading', {
        name: 'Endre oppfølgingsenhet',
        hidden: true,
      })
    ).to.exist;
    expect(
      within(modal).getByText(
        'Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk.'
      )
    ).to.exist;
  });

  it('Skal vise oppsummering når man har valgt enhet å flytte til', async () => {
    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    expect(await screen.findByText('Velg ny oppfølgingsenhet')).to.exist;

    const option = screen.getByRole('option', {
      name: 'Nav Fredrikstad - 0106',
      hidden: true,
    });
    await userEvent.click(option);

    expect(
      screen.getByText(
        'Du tildeler nå følgende personer til Nav Fredrikstad (0106):'
      )
    ).to.exist;
    expect(screen.getByText('Korrupt Heis (01999911111). Virksomhet:')).to
      .exist;
    expect(screen.getByText('NAV Security, Annen Virksomhet AS')).to.exist;
  });

  it('Sender riktig verdier når man tildeler oppfølgingsenhet', async () => {
    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    expect(await screen.findByText('Velg ny oppfølgingsenhet')).to.exist;

    const option = screen.getByRole('option', {
      name: 'Nav Fredrikstad - 0106',
      hidden: true,
    });
    await userEvent.click(option);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Endre oppfølgingsenhet',
        hidden: true,
      })
    );

    const tildelMutation = queryClient.getMutationCache().getAll()[0];
    expect(tildelMutation?.state.variables).to.deep.equal({
      personidenter: [selectedFnr],
      oppfolgingsenhet: '0106',
    });
  });
});
