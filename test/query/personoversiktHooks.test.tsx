import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { personoversiktEnhetMock } from '../../mock/data/personoversiktEnhetMock';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('personoversiktHooks tests', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: ReactNode }) => (
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

  it('loads personoversikt correctly', async () => {
    stubModiaContext();

    stubPersonoversikt();

    const { result } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const actual: PersonOversiktStatusDTO[] = result.current.data || [];

    expect(actual[0]).to.not.be.undefined;
    expect(actual[0]?.fnr).to.eq(personoversiktEnhetMock[0]?.fnr);
  });

  it('contains only personer with ubehandlet oppgave', async () => {
    stubModiaContext();
    stubPersonoversikt();

    const { result } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const persons: PersonOversiktStatusDTO[] = result.current.data || [];

    expect(persons.length).to.be.lessThan(personoversiktEnhetMock.length);

    const allPersonsUbehandlet = persons.every((person) => {
      return (
        person.aktivitetskravActive ||
        person.oppfolgingsoppgave ||
        person.behandlerdialogUbehandlet ||
        person.aktivitetskravVurderStansUbehandlet ||
        person.dialogmotekandidat ||
        person.oppfolgingsplanLPSBistandUbehandlet ||
        person.motebehovUbehandlet ||
        person.dialogmotesvarUbehandlet ||
        person.behandlerBerOmBistandUbehandlet ||
        person.arbeidsuforhetvurdering !== null ||
        person.friskmeldingTilArbeidsformidlingFom ||
        person.snartSluttPaSykepengene
      );
    });
    expect(allPersonsUbehandlet).to.be.true;
  });
});
