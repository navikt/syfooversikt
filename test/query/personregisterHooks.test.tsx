import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { personoversiktEnhetMock } from '@/mocks/data/personoversiktEnhetMock';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { useGetPersonSkjermingskodeQuery } from '@/data/personregisterHooks';
import { PersonSkjermingskode } from '@/api/types/personregisterTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('personregisterHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personregister correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();
    stubPersonregister();

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

    const { result } = renderHook(() => useGetPersonSkjermingskodeQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const actual: PersonSkjermingskode[] | undefined = result.current.data;

    expect(actual).to.not.be.undefined;
    if (actual) {
      expect(actual[0]?.fnr).to.eq(personoversiktEnhetMock[0]?.fnr);
    }
  });
});
