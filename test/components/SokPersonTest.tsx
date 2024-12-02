import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { beforeEach, describe, expect, it } from 'vitest';
import { testQueryClient } from '../testQueryClient';
import SokPerson from '@/components/sokperson/SokPerson';
import userEvent from '@testing-library/user-event';
import { SokDTO } from '@/api/types/sokDTO';
import { parseDateString } from '@/utils/dateUtils';
import { mockServer } from '../setup';
import { mockSokPerson } from '@/mocks/personoversikt/mockPersonoversikt';

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
  });

  it('should render SokPerson with fields', () => {
    renderSokPerson();

    expect(screen.getByRole('heading', { name: 'Søk etter sykmeldt' })).to
      .exist;
    expect(
      screen.getByText(
        'Her kan du søke opp sykmeldte personer basert på initialer og fødselsdato.'
      )
    ).to.exist;
    expect(screen.getByRole('textbox', { name: 'Initialer' })).to.exist;
    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).to.exist;
    expect(screen.getByRole('button', { name: 'Søk' })).to.exist;
  });

  it('should render validation error for fodselsdato not initials', async () => {
    renderSokPerson();

    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(screen.getByText('Vennligst angi en gyldig fødselsdato')).to.exist;
    expect(screen.queryByText('Vennligst angi gyldige initialer')).to.not.exist;
  });
  it('should render validation error for initialer when blank and too many characters', async () => {
    renderSokPerson();

    const initialsInput = screen.getByRole('textbox', { name: 'Initialer' });
    fireEvent.change(initialsInput, { target: { value: ' ' } });
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    expect(screen.getByText('Vennligst angi gyldige initialer')).to.exist;
    fireEvent.change(initialsInput, { target: { value: 'ABCD' } });
    expect(screen.getByText('Vennligst angi gyldige initialer')).to.exist;
  });
  it('should send correct parameters', async () => {
    renderSokPerson();

    const initialsInput = screen.getByRole('textbox', { name: 'Initialer' });
    const birthdateInput = screen.getByRole('textbox', { name: 'Fødselsdato' });

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

    const initialsInput = screen.getByRole('textbox', { name: 'Initialer' });
    const birthdateInput = screen.getByRole('textbox', { name: 'Fødselsdato' });

    const initialsValue = 'kh';
    const birthdateValue = '101010';

    fireEvent.change(initialsInput, {
      target: { value: initialsValue },
    });

    fireEvent.change(birthdateInput, {
      target: { value: birthdateValue },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByText('Navn')).to.exist;
    expect(await screen.findByText('Fødselsnummer')).to.exist;
    expect(await screen.findByText('Heis, Korrupt')).to.exist;
    expect(await screen.findByText('Bordsen, Korrupt')).to.exist;
    expect(await screen.findByText('01999911111')).to.exist;
    expect(await screen.findByText('99999922222')).to.exist;
  });
});
