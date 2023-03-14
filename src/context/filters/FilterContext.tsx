import * as React from 'react';
import {
  filterInitialState,
  FilterState,
} from '@/context/filters/filterContextState';
import { filterReducer } from '@/context/filters/filterContextReducer';
import { FilterActions } from '@/context/filters/filterContextActions';
import { useEffect } from 'react';

type FilterProviderProps = { children: React.ReactNode };

const FilterContext = React.createContext<{
  filterState: FilterState;
  dispatch: React.Dispatch<FilterActions>;
}>({
  filterState: filterInitialState,
  dispatch: () => undefined,
});

const FilterProvider = ({ children }: FilterProviderProps) => {
  const storeKey = 'filters';
  const storedFilters = sessionStorage.getItem(storeKey);
  const initialState =
    storedFilters === null ? filterInitialState : JSON.parse(storedFilters);
  const [filterState, dispatch] = React.useReducer(filterReducer, initialState);
  useEffect(() => {
    sessionStorage.setItem(storeKey, JSON.stringify(filterState));
  }, [filterState]);

  return (
    <FilterContext.Provider value={{ filterState, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

const useFilters = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export { FilterProvider, useFilters, FilterContext };
