import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { stubModiaContext } from '../stubs/stubModiaContext';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '../../src/react-query/veiledereQueryHooks';
import { Veileder } from '../../src/api/types/veiledereTypes';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { VeilederinfoDTO } from '../../src/api/types/veilederinfoTypes';
import veiledere from '../../Mock/Data/veiledere.json';
import veilederInfo from '../../Mock/Data/veilederInfo.json';
import { AktivEnhetContext } from '../../src/context/aktivEnhet/AktivEnhetContext';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('veiledereQueryHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads veiledere correctly', async () => {
    stubModiaContext();
    stubVeiledere();

    const wrapper = ({ children }: any) => (
      <AktivEnhetContext.Provider
        value={{
          aktivEnhet: '0316',
          handleAktivEnhetChanged: () => void 0,
        }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AktivEnhetContext.Provider>
    );

    const { result, waitFor } = renderHook(() => useVeiledereQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual: Veileder[] = result.current.data!;

    expect(actual[0].ident).to.eq(veiledere[0].ident);
  });

  it('loads aktiv veileder correctly', async () => {
    stubModiaContext();
    stubAktivVeileder();

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useAktivVeilederQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual: VeilederinfoDTO = result.current.data!;

    expect(actual.ident).to.eq(veilederInfo.ident);
  });
});
