import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Changelog } from '@/api/types/changelogTypes';
import { useChangelogsQuery } from '@/data/changelogHooks';
import { stubChangelogs } from '../stubs/stubChangelogs';
import { expect } from 'chai';

describe('changelogHooks tests', () => {
  const queryClient = new QueryClient();

  it('loads changelogs correctly', async () => {
    stubChangelogs();

    const wrapper = ({ children }: never) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useChangelogsQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    const actual: Changelog[] = result.current.data || [];

    expect(actual[0]).to.not.be.undefined;
    expect(actual[0]?.date).to.eq('10-09-19');
    expect(actual[0]?.items.length).to.eq(2);
  });
});
