import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { stubModiaContext } from '../stubs/stubModiaContext';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { veiledereMock } from '@/mocks/data/veiledereMock';
import { veilederMock } from '@/mocks/data/veilederMock';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('veiledereQueryHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads veiledere correctly', async () => {
    stubModiaContext();
    stubVeiledere();

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

    const { result } = renderHook(() => useVeiledereQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const actual: VeilederDTO[] = result.current.data || [];

    expect(actual[0]).to.not.be.undefined;
    expect(actual[0]?.ident).to.eq(veiledereMock[0]?.ident);
  });

  it('loads aktiv veileder correctly', async () => {
    stubModiaContext();
    stubAktivVeileder();

    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NotificationProvider>
    );

    const { result } = renderHook(() => useAktivVeilederQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const actual: VeilederDTO | undefined = result.current.data;

    expect(actual).to.not.be.undefined;
    expect(actual?.ident).to.eq(veilederMock.ident);
  });
});
