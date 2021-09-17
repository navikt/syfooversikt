import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { stubModiaContext } from '../stubs/stubModiaContext';
import personoversiktEnhetMockData from '../../mock/data/personoversiktEnhet.json';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { usePersonoversiktQuery } from '../../src/data/personoversiktHooks';
import { PersonoversiktStatus } from '../../src/api/types/personoversiktTypes';
import { AktivEnhetContext } from '../../src/context/aktivEnhet/AktivEnhetContext';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('personoversiktHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads personoversikt correctly', async () => {
    stubModiaContext();
    stubPersonoversikt();

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

    const { result, waitFor } = renderHook(() => usePersonoversiktQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual: PersonoversiktStatus[] = result.current.data!;

    expect(actual[0].fnr).to.eq(personoversiktEnhetMockData[0].fnr);
  });
});
