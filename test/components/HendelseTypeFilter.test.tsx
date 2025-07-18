import React from 'react';
import HendelseFilter from '@/sider/oversikt/filter/HendelseFilter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { veilederMock } from '@/mocks/syfoveileder/veilederMock';
import { testQueryClient } from '../testQueryClient';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { unleashMock } from '@/mocks/mockUnleash';
import { renderWithRouter } from '../testRenderUtils';
import { routes } from '@/routers/routes';

let queryClient: QueryClient;

const renderHendelseFilter = (path: string) => {
  renderWithRouter(
    <NotificationProvider>
      <AktivEnhetContext.Provider
        value={{
          aktivEnhet: aktivEnhetMock.aktivEnhet,
          handleAktivEnhetChanged: () => void 0,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <HendelseFilter />
        </QueryClientProvider>
      </AktivEnhetContext.Provider>
    </NotificationProvider>,
    path
  );
};

describe('HendelseTypeFilter', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );
  });
  it('Skal inneholde checkbokser med riktige labels', () => {
    queryClient.setQueryData(
      unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, 'Z101010'),
      () => unleashMock
    );

    renderHendelseFilter(routes.ENHET_OVERSIKT);

    const onskerMoteCheckbox = screen.getByRole('checkbox', {
      name: /Ber om dialogmøte/,
      checked: false,
    });
    expect(onskerMoteCheckbox).to.exist;

    const arbeidsgiverCheckbox = screen.getByRole('checkbox', {
      name: /Arbeidsgiver ber om bistand/,
      checked: false,
    });
    expect(arbeidsgiverCheckbox).to.exist;

    const dialogmotekandidatCheckbox = screen.getByRole('checkbox', {
      name: /Kandidat til dialogmøte/,
      checked: false,
    });
    expect(dialogmotekandidatCheckbox).to.exist;

    const dialogmotesvarCheckbox = screen.getByRole('checkbox', {
      name: /Svar dialogmøte/,
      checked: false,
    });
    expect(dialogmotesvarCheckbox).to.exist;

    const aktivitetskravCheckbox = screen.getByRole('checkbox', {
      name: /Aktivitetskrav/,
      checked: false,
    });
    expect(aktivitetskravCheckbox).to.exist;

    const vurderStansCheckbox = screen.getByRole('checkbox', {
      name: /Vurder stans/,
      checked: false,
    });
    expect(vurderStansCheckbox).to.exist;

    const behandlerdialogCheckbox = screen.getByRole('checkbox', {
      name: /Dialog med behandler/,
      checked: false,
    });
    expect(behandlerdialogCheckbox).to.exist;

    const oppfolgingsoppgaveCheckbox = screen.getByRole('checkbox', {
      name: /Oppfølgingsoppgave/,
      checked: false,
    });
    expect(oppfolgingsoppgaveCheckbox).to.exist;

    const arbeidsuforhetCheckbox = screen.getByRole('checkbox', {
      name: /Arbeidsuførhet/,
      checked: false,
    });
    expect(arbeidsuforhetCheckbox).to.exist;

    const friskmeldingCheckbox = screen.getByRole('checkbox', {
      name: /Friskmelding/,
      checked: false,
    });
    expect(friskmeldingCheckbox).to.exist;

    const senOppfolgingCheckbox = screen.getByRole('checkbox', {
      name: /Snart slutt/,
      checked: false,
    });
    expect(senOppfolgingCheckbox).to.exist;

    const manglendeMedvirkningCheckbox = screen.getByRole('checkbox', {
      name: /Manglende medvirkning/,
      checked: false,
    });
    expect(manglendeMedvirkningCheckbox).to.exist;
  });
  it('Viser ikke ufordelte brukere-checkboks i min oversikt', () => {
    renderHendelseFilter(routes.MIN_OVERSIKT);

    expect(
      screen.queryByRole('checkbox', {
        name: /Ufordelte brukere/,
      })
    ).to.not.exist;
  });
});
