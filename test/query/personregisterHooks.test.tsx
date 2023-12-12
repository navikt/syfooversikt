import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { personoversiktEnhetMock } from '../../mock/data/personoversiktEnhetMock';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('personregisterHooks tests', () => {
  const queryClient = new QueryClient();

  xit('loads personregister correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();
    stubPersonregister();

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

    const { result, waitFor } = renderHook(() => usePersonregisterQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: PersonregisterData[] | undefined = result.current.data;

    expect(actual).to.not.be.undefined;
    if (actual) {
      expect(actual[0]?.fnr).to.eq(personoversiktEnhetMock[0]?.fnr);
    }
  });
});
