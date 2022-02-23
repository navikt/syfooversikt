import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { stubModiaContext } from '../stubs/stubModiaContext';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import { Veileder } from '@/api/types/veiledereTypes';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { VeilederinfoDTO } from '@/api/types/veilederinfoTypes';
import veiledere from '../../mock/data/veiledere.json';
import veilederInfo from '../../mock/data/veilederInfo.json';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('veiledereQueryHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads veiledere correctly', async () => {
    stubModiaContext();
    stubVeiledere();

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

    const { result, waitFor } = renderHook(() => useVeiledereQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: Veileder[] = result.current.data || [];

    expect(actual[0].ident).to.eq(veiledere[0].ident);
  });

  it('loads aktiv veileder correctly', async () => {
    stubModiaContext();
    stubAktivVeileder();

    const wrapper = ({ children }) => (
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NotificationProvider>
    );

    const { result, waitFor } = renderHook(() => useAktivVeilederQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: VeilederinfoDTO | undefined = result.current.data;

    expect(actual).to.not.be.undefined;
    expect(actual?.ident).to.eq(veilederInfo.ident);
  });
});
