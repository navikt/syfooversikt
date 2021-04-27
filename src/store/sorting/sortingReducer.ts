import { Reducer } from 'redux';
import { SortingState } from './sortingTypes';
import { SortingActionTypes } from './sorting_actions';

const initialState: SortingState = {
  sortingType: 'FNR_ASC',
};

const sortingReducer: Reducer<SortingState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SortingActionTypes.SORT_BRUKERE: {
      return {
        ...state,
        sortingType: action.sortingType,
      };
    }
    default: {
      return state;
    }
  }
};

export default sortingReducer;
