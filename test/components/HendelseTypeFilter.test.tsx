import React from 'react';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { veilederMock } from '../../mock/syfoveileder/veilederMock';
import { testQueryClient } from '../testQueryClient';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { unleashMock } from '../../mock/mockUnleash';
import { TabTypeContext } from '@/context/tab/TabTypeContext';
import { OverviewTabType } from '@/konstanter';

let queryClient: QueryClient;

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

    render(
      <NotificationProvider>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <HendelseTypeFilter />
          </QueryClientProvider>
        </AktivEnhetContext.Provider>
      </NotificationProvider>
    );

    const onskerMoteCheckbox = screen.getByRole('checkbox', {
      name: /Ber om dialogmøte/,
      checked: false,
    });
    expect(onskerMoteCheckbox).to.exist;

    const ufordelteCheckbox = screen.getByRole('checkbox', {
      name: /Ufordelte brukere/,
      checked: false,
    });
    expect(ufordelteCheckbox).to.exist;

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

    const behandlerdialogCheckbox = screen.getByRole('checkbox', {
      name: /Dialog med behandler/,
      checked: false,
    });
    expect(behandlerdialogCheckbox).to.exist;

    const vurderStansCheckbox = screen.getByRole('checkbox', {
      name: /Vurder stans/,
      checked: false,
    });
    expect(vurderStansCheckbox).to.exist;

    const huskelappCheckbox = screen.getByRole('checkbox', {
      name: /Vurdert for oppfølging/,
      checked: false,
    });
    expect(huskelappCheckbox).to.exist;
  });
  it('Skal ikke inneholde checkbokser bak toggle når toggles disabled', () => {
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );

    render(
      <NotificationProvider>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <HendelseTypeFilter />
          </QueryClientProvider>
        </AktivEnhetContext.Provider>
      </NotificationProvider>
    );

    expect(
      screen.queryByRole('checkbox', {
        name: /Vurder stans/,
      })
    ).to.not.exist;
    expect(
      screen.queryByRole('checkbox', {
        name: /Huskelapp/,
      })
    ).to.not.exist;
  });
  it('Viser ikke ufordelte brukere-checkboks i min oversikt', () => {
    render(
      <NotificationProvider>
        <TabTypeContext.Provider
          value={{
            tabType: OverviewTabType.MY_OVERVIEW,
            setTabType: () => void 0,
          }}
        >
          <AktivEnhetContext.Provider
            value={{
              aktivEnhet: aktivEnhetMock.aktivEnhet,
              handleAktivEnhetChanged: () => void 0,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <HendelseTypeFilter />
            </QueryClientProvider>
          </AktivEnhetContext.Provider>
        </TabTypeContext.Provider>
      </NotificationProvider>
    );

    expect(
      screen.queryByRole('checkbox', {
        name: /Ufordelte brukere/,
      })
    ).to.not.exist;
  });
});
