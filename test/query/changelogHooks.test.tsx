import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { Changelog } from '@/api/types/changelogTypes';
import { useChangelogsQuery } from '@/data/changelogHooks';
import { stubChangelogs } from '../stubs/stubChangelogs';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('changelogHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads changelogs correctly', async () => {
    stubChangelogs();

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useChangelogsQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: Changelog[] = result.current.data || [];

    expect(actual[0].date).to.eq('10-09-19');
    expect(actual[0].items.length).to.eq(2);
  });
});
