import { expect } from 'chai';
import {
  PushVeilederArbeidstakerForespurtAction,
  veilederArbeidstakerActionTypes,
} from '../../../src/store/veilederArbeidstaker/veilederArbeidstaker_actions';
import { call, put } from 'redux-saga/effects';
import { pushBrukerArbeidstakerSaga } from '../../../src/store/veilederArbeidstaker/veilederArbeidstakerSagas';
import { post } from '../../../src/api';

describe('veilederArbeidstakerSagas', () => {
  describe('fordel liste av brukere til en veileder', () => {
    const payload = [
      {
        veilederIdent: 'Z999999',
        fnr: '123456789',
        enhet: '0001',
      },
    ];
    const forespurtAction: PushVeilederArbeidstakerForespurtAction = {
      type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FORESPURT,
      data: payload,
    };
    const generator = pushBrukerArbeidstakerSaga(forespurtAction);
    const url = '/api/v2/persontildeling/registrer';

    it(`dispatch ${veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHER}`, () => {
      const nesteAction = put({
        type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHER,
      });
      expect(generator.next().value).to.deep.equal(nesteAction);
    });

    it(`kall ${url}`, () => {
      const nesteKall = call(post, url, {
        tilknytninger: forespurtAction.data,
      });
      expect(generator.next().value).to.deep.equal(nesteKall);
    });

    it(`dispatch ${veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET}`, () => {
      const nesteAction = put({
        type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET,
        data: payload,
      });
      expect(generator.next().value).to.deep.equal(nesteAction);
    });
  });
});
