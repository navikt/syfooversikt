import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { beforeEach, describe, expect, it } from 'vitest';
import { testQueryClient } from '../testQueryClient';
import SokPerson from '@/sider/sokperson/SokPerson';
import userEvent from '@testing-library/user-event';
import { SokDTO } from '@/api/types/sokDTO';
import { parseDateString } from '@/utils/dateUtils';
import { mockServer } from '../setup';
import { mockSokPerson } from '@/mocks/personoversikt/mockPersonoversikt';
import { mockEreg } from '@/mocks/ereg/mockEreg';

let queryClient: QueryClient;

const renderSokPerson = () =>
  render(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <SokPerson />
        </AktivEnhetProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );

describe('SokPerson', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    mockServer.use(mockSokPerson());
    mockServer.use(mockEreg);
  });

  it('should render SokPerson with fields', () => {
    renderSokPerson();

    expect(screen.getByRole('heading', { name: 'Søk etter sykmeldt' })).to
      .exist;
    expect(
      screen.getByText(
        'Her kan du søke for å finne brukere med aktivt sykefravær.'
      )
    ).to.exist;
    expect(
      screen.getByRole('textbox', {
        name:
          'Initialer (valgfri) Hvordan fyller jeg inn initialer? Hvordan fyller jeg inn initialer?',
      })
    ).to.exist;
    expect(
      screen.getByRole('textbox', {
        name:
          'Fødselsdato (obligatorisk) Hvordan fyller jeg inn fødselsdato? Hvordan fyller jeg inn fødselsdato?',
      })
    ).to.exist;
    expect(screen.getByRole('button', { name: 'Søk' })).to.exist;
  });

  it('should render validation error for fodselsdato not initials', async () => {
    renderSokPerson();

    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(screen.getByText('Vennligst angi en gyldig fødselsdato')).to.exist;
    expect(screen.queryByText('Vennligst angi to til fire initialer')).to.not
      .exist;
  });
  it('should render validation error for initialer when blank and too many characters', async () => {
    renderSokPerson();

    const initialsInput = screen.getByRole('textbox', { name: /^Initialer/ });
    fireEvent.change(initialsInput, { target: { value: ' ' } });
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    expect(screen.getByText('Vennligst angi to til fire initialer')).to.exist;
    fireEvent.change(initialsInput, { target: { value: 'ABCDE' } });
    expect(screen.getByText('Vennligst angi to til fire initialer')).to.exist;
  });
  it('should render validation error for fodselsdato when not correct amount of digits', async () => {
    renderSokPerson();

    const fodselsdatoInput = screen.getByRole('textbox', {
      name: /^Fødselsdato/,
    });
    const fodselsdatoErrorMessage = 'Vennligst angi en gyldig fødselsdato';

    fireEvent.change(fodselsdatoInput, { target: { value: ' ' } });
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    expect(screen.getByText(fodselsdatoErrorMessage)).to.exist;
    fireEvent.change(fodselsdatoInput, { target: { value: '1909199900' } });
    expect(screen.getByText(fodselsdatoErrorMessage)).to.exist;
    fireEvent.change(fodselsdatoInput, { target: { value: '19-09-199900' } });
    expect(screen.getByText(fodselsdatoErrorMessage)).to.exist;
    fireEvent.change(fodselsdatoInput, { target: { value: '19-09-199' } });
    expect(screen.getByText(fodselsdatoErrorMessage)).to.exist;
  });
  it('should send correct parameters', async () => {
    renderSokPerson();

    const initialsInput = screen.getByRole('textbox', { name: /^Initialer/ });
    const birthdateInput = screen.getByRole('textbox', {
      name: /^Fødselsdato/,
    });

    const initialsValue = 'kk';
    const birthdateValue = '101010';

    fireEvent.change(initialsInput, {
      target: { value: initialsValue },
    });

    fireEvent.change(birthdateInput, {
      target: { value: birthdateValue },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    await waitFor(() => {
      const sokMutation = queryClient.getMutationCache().getAll()[0];
      const birthdate = parseDateString(birthdateValue);
      if (birthdate) {
        const expectedSokDTO: SokDTO = {
          initials: initialsValue,
          birthdate: birthdate,
        };
        if (!sokMutation) {
          throw new Error('Mutation not found');
        }
        expect(sokMutation.state.variables).to.deep.equal(expectedSokDTO);
      } else {
        throw new Error('Invalid birthdate');
      }
    });
  });

  it('should show correct results', async () => {
    renderSokPerson();

    const initialsInput = screen.getByRole('textbox', { name: /^Initialer/ });
    const birthdateInput = screen.getByRole('textbox', {
      name: /^Fødselsdato/,
    });

    const initialsValue = 'kh';
    const birthdateValue = '101010';

    fireEvent.change(initialsInput, {
      target: { value: initialsValue },
    });

    fireEvent.change(birthdateInput, {
      target: { value: birthdateValue },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByRole('columnheader', { name: 'Navn' })).to.exist;
    expect(await screen.findByRole('columnheader', { name: 'Fødselsnummer' }))
      .to.exist;
    expect(await screen.findByRole('columnheader', { name: 'Virksomhet' })).to
      .exist;
    expect(await screen.findByRole('link', { name: 'Heis, Korrupt' })).to.exist;
    expect(await screen.findByRole('link', { name: 'Bordsen, Korrupt' })).to
      .exist;
    expect(await screen.findByRole('cell', { name: '01999911111' })).to.exist;
    expect(await screen.findByRole('cell', { name: '99999922222' })).to.exist;
    expect(await screen.findByRole('cell', { name: 'NAV Security' })).to.exist;
    expect(await screen.findByRole('cell', { name: 'Bolle Og Brus' })).to.exist;
  });
});
