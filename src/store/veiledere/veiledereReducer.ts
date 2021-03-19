import { Reducer } from 'redux';
import { VeiledereState } from './veiledereTypes';
import { VeiledereActionTypes } from './veiledere_actions';

const initiellState: VeiledereState = {};

const veiledereReducer: Reducer<VeiledereState> = (
  state = initiellState,
  action
) => {
  const enhet: any = {};
  switch (action.type) {
    case VeiledereActionTypes.HENT_VEILEDERE_HENTER: {
      enhet[action.enhetId] = {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
      };
      return { ...state, ...enhet };
    }
    case VeiledereActionTypes.HENT_VEILEDERE_HENTET: {
      enhet[action.enhetId] = {
        ...state,
        henter: false,
        hentet: true,
        data: action.data,
      };
      return { ...state, ...enhet };
    }
    case VeiledereActionTypes.HENT_VEILEDERE_FEILET: {
      enhet[action.enhetId] = {
        ...state,
        henter: false,
        hentingFeilet: true,
      };
      return { ...state, ...enhet };
    }
    default: {
      return state;
    }
  }
};

export default veiledereReducer;
