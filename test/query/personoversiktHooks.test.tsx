import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { stubModiaContext } from '../stubs/stubModiaContext';
import personoversiktEnhetMockData from '../../mock/data/personoversiktEnhet.json';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('personoversiktHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personoversikt correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();

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

    const { result, waitFor } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: PersonOversiktStatusDTO[] = result.current.data || [];

    expect(actual[0].fnr).to.eq(personoversiktEnhetMockData[0].fnr);
  });
});
