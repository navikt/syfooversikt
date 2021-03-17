import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {
  hentVeilederenheter,
  hentVeilederenheterHenter,
  hentVeilederenheterHentet,
  hentVeilederenheterFeilet,
  VeilederenheterActionTypes,
} from '../../../src/store/veilederenheter/veilederenheter_actions';
import { enhet } from '../../data/fellesTestdata';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('veilederenheter_actions', () => {
  it('hentVeilederenheter() skal returnere riktig action', () => {
    expect(hentVeilederenheter()).to.deep.equal({
      type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FORESPURT,
    });
  });

  it('hentVeilederenheterHenter() skal returnere riktig action', () => {
    expect(hentVeilederenheterHenter()).to.deep.equal({
      type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER,
    });
  });

  it('hentVeilederenheterHentet() skal returnere riktig action', () => {
    const data = {
      enhetliste: [enhet],
    };
    expect(hentVeilederenheterHentet(data)).to.deep.equal({
      type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET,
      data,
    });
  });

  it('hentVeilederenheterFeilet() skal returnere riktig action', () => {
    expect(hentVeilederenheterFeilet()).to.deep.equal({
      type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET,
    });
  });
});
