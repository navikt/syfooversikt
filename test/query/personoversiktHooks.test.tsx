import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { personoversiktEnhetMock } from '../../mock/data/personoversiktEnhetMock';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('personoversiktHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personoversikt correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();

    const wrapper = ({ children }: never) => (
      <NotificationProvider>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AktivEnhetContext.Provider>
      </NotificationProvider>
    );

    const { result, waitFor } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: PersonOversiktStatusDTO[] = result.current.data || [];

    expect(actual[0]).to.not.be.undefined;
    expect(actual[0]?.fnr).to.eq(personoversiktEnhetMock[0]?.fnr);
  });

  it('contains only personer with ubehandlet oppgave', async () => {
    stubModiaContext();
    stubPersonoversikt();

    const wrapper = ({ children }: never) => (
      <NotificationProvider>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AktivEnhetContext.Provider>
      </NotificationProvider>
    );

    const { result, waitFor } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const persons: PersonOversiktStatusDTO[] = result.current.data || [];

    expect(persons.length).to.be.lessThan(personoversiktEnhetMock.length);

    const allPersonsUbehandlet = persons.every((person) => {
      return (
        person.aktivitetskravActive ||
        person.huskelappActive ||
        person.behandlerdialogUbehandlet ||
        person.aktivitetskravVurderStansUbehandlet ||
        person.dialogmotekandidat ||
        person.oppfolgingsplanLPSBistandUbehandlet ||
        person.motebehovUbehandlet ||
        person.dialogmotesvarUbehandlet
      );
    });
    expect(allPersonsUbehandlet).to.be.true;
  });
});
