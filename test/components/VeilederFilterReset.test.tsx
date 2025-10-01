import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VeilederFilter from '@/sider/oversikt/filter/VeilederFilter';
import { FilterContext } from '@/context/filters/FilterContext';
import { filterInitialState } from '@/context/filters/filterContextState';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { ActionType } from '@/context/filters/filterContextActions';

vi.mock('@/data/veiledereQueryHooks', () => ({
  useVeiledereQuery: () => ({
    data: [
      { ident: 'A', fornavn: 'Test', etternavn: 'Alpha' },
      { ident: 'B', fornavn: 'Test', etternavn: 'Beta' },
    ],
  }),
  useAktivVeilederQuery: () => ({ data: { ident: 'A' } }),
}));

vi.mock('@/data/personoversiktHooks', () => ({
  usePersonoversiktQuery: () => ({ data: [] }),
}));

vi.mock('@/utils/veiledereUtils', () => ({
  filterVeiledereWithActiveOppgave: (v: unknown) => v,
  sortVeiledereBySurnameAsc: (v: unknown) => v,
}));

describe('VeilederFilter reset on aktivEnhet change', () => {
  it('dispatcher tom liste for selectedVeilederIdents ved enhetsendring', () => {
    const dispatch = vi.fn();
    const filterState = {
      ...filterInitialState,
      selectedVeilederIdents: ['A', 'B'],
    };

    const { rerender } = render(
      <AktivEnhetContext.Provider
        value={{ aktivEnhet: '1234', handleAktivEnhetChanged: () => undefined }}
      >
        <FilterContext.Provider value={{ filterState, dispatch }}>
          <VeilederFilter />
        </FilterContext.Provider>
      </AktivEnhetContext.Provider>
    );

    expect(dispatch).not.toHaveBeenCalled();

    rerender(
      <AktivEnhetContext.Provider
        value={{ aktivEnhet: '5678', handleAktivEnhetChanged: () => undefined }}
      >
        <FilterContext.Provider value={{ filterState, dispatch }}>
          <VeilederFilter />
        </FilterContext.Provider>
      </AktivEnhetContext.Provider>
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.SetSelectedVeilederIdents,
      selectedVeilederIdents: [],
    });
  });
});
