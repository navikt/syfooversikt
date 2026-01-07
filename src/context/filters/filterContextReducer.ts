import {
  filterInitialState,
  FilterState,
} from '@/context/filters/filterContextState';
import {
  ActionType,
  FilterActions,
} from '@/context/filters/filterContextActions';

export const filterReducer = (
  state: FilterState,
  action: FilterActions
): FilterState => {
  switch (action.type) {
    case ActionType.SetTekstFilter: {
      return {
        ...state,
        tekstFilter: action.tekstFilter,
      };
    }
    case ActionType.SetFilterUfordelteBrukere: {
      return {
        ...state,
        isUfordelteBrukereFilter: action.isUfordelteBrukereFilter,
      };
    }
    case ActionType.SetSelectedBirthDates: {
      return {
        ...state,
        selectedBirthDates: action.selectedBirthDates,
      };
    }
    case ActionType.SetSelectedHendelseType: {
      return {
        ...state,
        selectedHendelseType: action.selectedHendelseType,
      };
    }
    case ActionType.SetSelectedOptions: {
      return {
        ...state,
        selectedOptions: action.selectedOptions,
      };
    }
    case ActionType.SetSelectedCompanies: {
      return {
        ...state,
        selectedCompanies: action.selectedCompanies,
      };
    }
    case ActionType.SetSelectedDatoFilter: {
      return {
        ...state,
        selectedFristFilters: action.selectedDatoFilters,
      };
    }
    case ActionType.SetSelectedAgeFilter: {
      return {
        ...state,
        selectedAgeFilters: action.selectedAgeFilters,
      };
    }
    case ActionType.SetSelectedVeilederIdents: {
      return {
        ...state,
        selectedVeilederIdents: action.selectedVeilederIdents,
      };
    }
    case ActionType.ResetFilters: {
      return {
        ...filterInitialState,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};
