import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { stubModiaContext } from '../stubs/stubModiaContext';
import personoversiktMockData from '../../mock/data/personoversiktEnhet.json';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { usePersonregisterQuery } from '../../src/data/personregisterHooks';
import { PersonregisterData } from '../../src/api/types/personregisterTypes';
import { AktivEnhetContext } from '../../src/context/aktivEnhet/AktivEnhetContext';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('personregisterHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personregister correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();
    stubPersonregister();

    const wrapper = ({ children }: any) => (
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
    );

    const { result, waitFor } = renderHook(() => usePersonregisterQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual: PersonregisterData[] = result.current.data!;

    expect(actual[0].fnr).to.eq(personoversiktMockData[0].fnr);
  });
});
