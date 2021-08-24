import * as React from 'react';
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

function FilterProvider({ children }: FilterProviderProps) {
  const [filterState, dispatch] = React.useReducer(
    filterReducer,
    filterInitialState
  );
  return (
    <FilterContext.Provider value={{ filterState, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

const useFilters = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a CountProvider');
  }
  return context;
};

export { FilterProvider, useFilters };
