import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { stubModiaContext } from '../stubs/stubModiaContext';
import personoversiktMockData from '../../mock/data/personoversiktEnhet.json';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('personregisterHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personregister correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();
    stubPersonregister();

    const wrapper = ({ children }) => (
      <NotificationProvider>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMockData.aktivEnhet,
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
    expect(actual?.[0].fnr).to.eq(personoversiktMockData[0].fnr);
  });
});
