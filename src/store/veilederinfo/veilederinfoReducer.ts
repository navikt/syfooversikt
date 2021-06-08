import { Reducer } from 'redux';
import { VeilederinfoState } from './veilederinfoTypes';
import { VeilederinfoActionTypes } from './veilederinfo_actions';

const initiellState: VeilederinfoState = {
  hentet: false,
  henter: false,
  hentingFeilet: false,
};

const veilederinfoReducer: Reducer<VeilederinfoState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER: {
      return {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
      };
    }
    case VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET: {
      return {
        ...state,
        henter: false,
        hentet: true,
        data: action.data,
      };
    }
    case VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
      };
    }
    default: {
      return state;
    }
  }
};

export default veilederinfoReducer;
