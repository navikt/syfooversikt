import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import veilederinfoReducer from '../../../src/store/veilederinfo/veilederinfoReducer';
import {
  VeilederinfoActionTypes,
  henterVeilederinfo,
  veilederinfoHentet,
  hentVeilederinfoFeilet,
} from '../../../src/store/veilederinfo/veilederinfo_actions';
import { veilederinfo } from '../../data/fellesTestdata';

describe('veilederinfoReducer', () => {
  describe('Henter veilederinfo', () => {
    const initData = { navn: '', ident: '' };
    const initialState = deepFreeze({
      hentet: false,
      henter: false,
      hentingFeilet: false,
      data: initData,
    });

    it(`handterer ${VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER}`, () => {
      const action = henterVeilederinfo();
      const nesteState = veilederinfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: true,
      });
    });

    it(`handterer ${VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET}`, () => {
      const data = veilederinfo;
      const action = veilederinfoHentet(data);
      const nesteState = veilederinfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        hentet: true,
        henter: false,
        data,
      });
    });

    it(`handterer ${VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET}`, () => {
      const action = hentVeilederinfoFeilet();
      const nesteState = veilederinfoReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: false,
        hentingFeilet: true,
        data: initData,
      });
    });
  });
});
