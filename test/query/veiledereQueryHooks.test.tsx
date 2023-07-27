import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { veiledereMock } from '../../mock/data/veiledereMock';
import { veilederInfoMock } from '../../mock/data/veilederInfoMock';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { expect } from 'chai';

describe('veiledereQueryHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads veiledere correctly', async () => {
    stubModiaContext();
    stubVeiledere();

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

    const { result, waitFor } = renderHook(() => useVeiledereQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: Veileder[] = result.current.data || [];

    expect(actual[0]).to.not.be.undefined;
    expect(actual[0]?.ident).to.eq(veiledereMock[0]?.ident);
  });

  it('loads aktiv veileder correctly', async () => {
    stubModiaContext();
    stubAktivVeileder();

    const wrapper = ({ children }: never) => (
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
    expect(actual?.ident).to.eq(veilederInfoMock.ident);
  });
});
