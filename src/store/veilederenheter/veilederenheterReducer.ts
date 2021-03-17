import { Reducer } from 'redux';
import {
  Veilederenhet,
  Veilederenheter,
  VeilederenheterState,
} from './veilederenheterTypes';
import { VeilederenheterActionTypes } from './veilederenheter_actions';
import { modiacontextActionTypes } from '../modiacontext/modiacontext_actions';
import { CONTEXT_EVENT_TYPE } from '../../konstanter';

export const sorterEnhetLavesteEnhetIdForst = (
  enhetliste: Veilederenhet[]
): Veilederenhet[] => {
  return [...enhetliste].sort((e1, e2) => {
    return parseInt(e1.enhetId, 10) - parseInt(e2.enhetId, 10);
  });
};

export const getAktivEnhet = (
  veilederenheter: Veilederenheter
): Veilederenhet => {
  return veilederenheter.enhetliste.length > 0
    ? sorterEnhetLavesteEnhetIdForst(veilederenheter.enhetliste)[0]
    : initiellState.aktivEnhet;
};

const initiellState: VeilederenheterState = {
  hentet: false,
  henter: false,
  hentingFeilet: false,
  aktivEnhet: {
    enhetId: '',
    navn: '',
  },
  aktivEnhetId: '',
  data: {
    enhetliste: [],
  },
};

const veilederenheterReducer: Reducer<VeilederenheterState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER: {
      return {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
      };
    }
    case VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET: {
      return {
        ...state,
        henter: false,
        hentet: true,
        aktivEnhet: getAktivEnhet(action.data),
        data: action.data,
      };
    }
    case VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
      };
    }
    case VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET: {
      return {
        ...state,
        aktivEnhetId: action.data,
      };
    }
    case modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHET: {
      if (
        action.data.eventType.valueOf() === CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET
      ) {
        return {
          ...state,
          aktivEnhetId: action.data.verdi,
        };
      }
    }
    default: {
      return state;
    }
  }
};

export default veilederenheterReducer;
