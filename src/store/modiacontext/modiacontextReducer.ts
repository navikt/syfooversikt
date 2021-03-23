import { Reducer } from 'redux';
import { ModiacontextState } from './modiacontextTypes';
import { modiacontextActionTypes } from './modiacontext_actions';

const initiellState: ModiacontextState = {
  henterEnhet: false,
  hentetEnhet: false,
  hentingEnhetFeilet: false,
  data: {},
};

const modiacontextReducer: Reducer<ModiacontextState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case modiacontextActionTypes.HENT_AKTIVENHET_FEILET: {
      return {
        ...state,
        henterEnhet: false,
        hentingEnhetFeilet: true,
      };
    }
    case modiacontextActionTypes.HENT_AKTIVENHET_HENTER: {
      return {
        ...state,
        henterEnhet: true,
        hentetEnhet: false,
        hentingEnhetFeilet: false,
      };
    }
    case modiacontextActionTypes.HENT_AKTIVENHET_HENTET: {
      return {
        ...state,
        henterEnhet: false,
        hentetEnhet: true,
        hentingEnhetFeilet: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default modiacontextReducer;
