import * as React from 'react';
import { useEffect } from 'react';
import {
  filterInitialState,
  FilterState,
} from '@/context/filters/filterContextState';
import { filterReducer } from '@/context/filters/filterContextReducer';
import { FilterActions } from '@/context/filters/filterContextActions';

type FilterProviderProps = { children: React.ReactNode };

const FilterContext = React.createContext<{
  filterState: FilterState;
  dispatch: React.Dispatch<FilterActions>;
}>({
  filterState: filterInitialState,
  dispatch: () => undefined,
});

const FilterProvider = ({ children }: FilterProviderProps) => {
  const storeKey = 'filters-v3';
  const storedFilters = sessionStorage.getItem(storeKey);
  const initialState =
    storedFilters === null ? filterInitialState : JSON.parse(storedFilters);
  const parsedFilters = parseFilters(initialState);
  const [filterState, dispatch] = React.useReducer(
    filterReducer,
    parsedFilters
  );
  useEffect(() => {
    sessionStorage.setItem(storeKey, JSON.stringify(filterState));
  }, [filterState]);

  return (
    <FilterContext.Provider value={{ filterState, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

const parseFilters = (initialState: FilterState): FilterState => {
  const selectedDateTo = initialState.selectedFristFilters.selectedDateRange.to;
  const selectedDateFrom =
    initialState.selectedFristFilters.selectedDateRange.from;
  return {
    ...initialState,
    selectedFristFilters: {
      ...initialState.selectedFristFilters,
      selectedDateRange: {
        to: selectedDateTo ? new Date(selectedDateTo) : undefined,
        from: selectedDateFrom ? new Date(selectedDateFrom) : undefined,
      },
    },
  };
};

const useFilters = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export { FilterProvider, useFilters, FilterContext };
