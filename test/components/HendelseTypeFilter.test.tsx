import React from 'react';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = testQueryClient();

describe('HendelseTypeFilter', () => {
  it('Skal inneholde checkbokser med riktige labels', () => {
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );
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
      name: /Ønsker møte/,
      checked: false,
    });
    expect(onskerMoteCheckbox).to.exist;

    const ufordelteCheckbox = screen.getByRole('checkbox', {
      name: /Ufordelte brukere/,
      checked: false,
    });
    expect(ufordelteCheckbox).to.exist;

    const arbeidsgiverCheckbox = screen.getByRole('checkbox', {
      name: /Arbeidsgiver ønsker bistand/,
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
  });
});
