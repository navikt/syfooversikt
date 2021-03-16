import { Reducer } from 'redux';
import { VeiledereState } from './veiledereTypes';
import { VeiledereAction, VeiledereActionTypes } from './veiledere_actions';

const initiellState: VeiledereState = {};

const veiledereReducer: Reducer<VeiledereState, VeiledereAction> = (
  state = initiellState,
  action: VeiledereAction
) => {
  switch (action.type) {
    case VeiledereActionTypes.HENT_VEILEDERE_HENTER: {
      return {
        ...state,
        [action.enhetId]: { henter: true, hentet: false, hentingFeilet: false },
      };
    }
    case VeiledereActionTypes.HENT_VEILEDERE_HENTET: {
      return {
        ...state,
        [action.enhetId]: {
          henter: false,
          hentet: true,
          hentingFeilet: false,
          data: action.data,
        },
      };
    }
    case VeiledereActionTypes.HENT_VEILEDERE_FEILET: {
      return {
        ...state,
        [action.enhetId]: { henter: false, hentet: false, hentingFeilet: true },
      };
    }
    default: {
      return state;
    }
  }
};

export default veiledereReducer;
