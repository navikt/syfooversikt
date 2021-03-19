import { Reducer } from 'redux';
import { FilterActionTypes, FilterAction } from './filter_actions';

export const FILTERS_STATE_KEY = 'Filters';

export interface FilterState {
  selectedBirthDates: string[];
  selectedVeilederIdents: string[];
  selectedCompanies: string[];
  selectedHendelseType: HendelseTypeFilters;
}

export interface HendelseTypeFilters {
  arbeidsgiverOnskerMote: boolean;
  onskerMote: boolean;
  svartMote: boolean;
  ufordeltBruker: boolean;
}

const initialHendelseFilter: HendelseTypeFilters = {
  arbeidsgiverOnskerMote: false,
  onskerMote: false,
  svartMote: false,
  ufordeltBruker: false,
};

const inititalState: FilterState = {
  selectedBirthDates: [],
  selectedVeilederIdents: [],
  selectedCompanies: [],
  selectedHendelseType: initialHendelseFilter,
};

const FilterReducer: Reducer<FilterState, FilterAction> = (
  state: FilterState = inititalState,
  action
) => {
  switch (action.type) {
    case FilterActionTypes.UPDATE_BIRTH_DATE: {
      return {
        ...state,
        selectedBirthDates: action.selectedBirthDates,
      };
    }

    case FilterActionTypes.UPDATE_VEILDERER_IDENTS: {
      return {
        ...state,
        selectedVeilederIdents: action.selectedVeilederIdents,
      };
    }
    case FilterActionTypes.UPDATE_COMPANIES: {
      return {
        ...state,
        selectedCompanies: action.selectedCompanies,
      };
    }
    case FilterActionTypes.UPDATE_HENDELSE_FILTER: {
      return {
        ...state,
        selectedHendelseType: action.filter,
      };
    }
    case FilterActionTypes.RESET_ALL_FILTERS: {
      return inititalState;
    }
  }
  return state;
};

export default FilterReducer;
