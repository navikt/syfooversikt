import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { veilederArbeidstakerActionTypes } from '../../../src/store/veilederArbeidstaker/veilederArbeidstaker_actions';
import {
  pushVeilederArbeidstakerForespurt,
  pushVeilederArbeidstakerPusher,
  pushVeilederArbeidstakerPushet,
  pushVeilederArbeidstakerFeilet,
} from '../../../src/store/veilederArbeidstaker/veilederArbeidstaker_actions';
import { testdata } from '../../data/fellesTestdata';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('veilederArbeidstaker_actions', () => {
  it('pushVeilederArbeidstakerForespurt() skal returnere riktig action', () => {
    const payload = [
      {
        veilederIdent: 'Z999999',
        fnr: '123456789',
        enhet: '0001',
      },
    ];
    expect(pushVeilederArbeidstakerForespurt(payload)).to.deep.equal({
      type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FORESPURT,
      data: payload,
    });
  });

  it('pushVeilederArbeidstakerPusher() skal returnere riktig action', () => {
    expect(pushVeilederArbeidstakerPusher()).to.deep.equal({
      type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHER,
    });
  });

  it('pushVeilederArbeidstakerPushet() skal returnere riktig action', () => {
    const tildelinger = [
      {
        fnr: testdata.fnr1,
        veilederIdent: '',
        enhet: '',
      },
    ];
    expect(pushVeilederArbeidstakerPushet(tildelinger)).to.deep.equal({
      type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET,
      data: tildelinger,
    });
  });

  it('pushVeilederArbeidstakerFeilet() skal returnere riktig action', () => {
    expect(pushVeilederArbeidstakerFeilet()).to.deep.equal({
      type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FEILET,
    });
  });
});
