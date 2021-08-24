import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { stubModiaContext } from '../stubs/stubModiaContext';
import personoversiktMockData from '../../Mock/Data/personoversiktEnhet.json';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { usePersonoversiktQuery } from '../../src/react-query/personoversiktHooks';
import { PersonoversiktStatus } from '../../src/api/types/personoversiktTypes';
import { AktivEnhetContext } from '../../src/context/aktivEnhet/AktivEnhetContext';

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
          aktivEnhet: '0316',
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

    expect(actual[0].fnr).to.eq(personoversiktMockData[0].fnr);
  });
});
