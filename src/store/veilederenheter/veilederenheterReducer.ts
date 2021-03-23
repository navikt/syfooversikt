import { Reducer } from 'redux';
import { VeilederenheterState } from './veilederenheterTypes';
import { VeilederenheterActionTypes } from './veilederenheter_actions';

const initiellState: VeilederenheterState = {
  aktivEnhetId: '',
};

const veilederenheterReducer: Reducer<VeilederenheterState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET: {
      return {
        ...state,
        aktivEnhetId: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default veilederenheterReducer;
