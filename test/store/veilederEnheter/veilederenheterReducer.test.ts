import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import veilederenheterReducer from '../../../src/store/veilederenheter/veilederenheterReducer';
import {
  VeilederenheterActionTypes,
  hentVeilederenheterHenter,
  hentVeilederenheterHentet,
  hentVeilederenheterFeilet,
} from '../../../src/store/veilederenheter/veilederenheter_actions';
import { enhet } from '../../data/fellesTestdata';
import {
  modiacontextActionTypes,
  modiaContextPushet,
} from '../../../src/store/modiacontext/modiacontext_actions';
import { CONTEXT_EVENT_TYPE } from '../../../src/konstanter';

describe('veilederenheterReducer', () => {
  describe('Henter veilederenhet', () => {
    const initData = { enhetliste: [] };
    const initAktivEnhet = { enhetId: '', navn: '' };
    const initialState = deepFreeze({
      hentet: false,
      henter: false,
      hentingFeilet: false,
      aktivEnhet: initAktivEnhet,
      aktivEnhetId: initAktivEnhet.enhetId,
      data: initData,
    });

    it(`handterer ${VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER}`, () => {
      const action = hentVeilederenheterHenter();
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: true,
      });
    });

    it(`handterer ${VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET} med tom liste`, () => {
      const data = {
        enhetliste: [],
      };
      const action = hentVeilederenheterHentet(data);
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        hentet: true,
        henter: false,
        data,
      });
    });

    it(`handterer ${VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET} med liste med 1 enhet`, () => {
      const data = {
        enhetliste: [enhet],
      };
      const action = hentVeilederenheterHentet(data);
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        hentet: true,
        henter: false,
        aktivEnhet: enhet,
        data,
      });
    });

    it(`handterer ${VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET} med liste med 2 enheter med lavest enhetId som aktiv enhet`, () => {
      const enhetLavestId = {
        ...enhet,
        enhetId: '0101',
      };
      const enhetHoyestId = {
        ...enhet,
        enhetId: '0201',
      };
      const data = {
        enhetliste: [enhetHoyestId, enhetLavestId],
      };
      const action = hentVeilederenheterHentet(data);
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        hentet: true,
        henter: false,
        aktivEnhet: enhetLavestId,
        data,
      });
    });

    it(`handterer ${VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET}`, () => {
      const action = hentVeilederenheterFeilet();
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        henter: false,
        hentingFeilet: true,
        data: initData,
      });
    });

    it(`handterer ${modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHET}`, () => {
      const context = {
        verdi: enhet.enhetId,
        eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET,
      };
      const action = modiaContextPushet(context);
      const nesteState = veilederenheterReducer(initialState, action);
      expect(nesteState).to.deep.equal({
        ...initialState,
        aktivEnhetId: context.verdi,
      });
    });
  });
});
