import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {
  VeilederinfoActionTypes,
  hentVeilederinfo,
  henterVeilederinfo,
  veilederinfoHentet,
  hentVeilederinfoFeilet,
} from '../../../src/store/veilederinfo/veilederinfo_actions';
import { veilederinfo } from '../../data/fellesTestdata';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('veilederinfo_actions', () => {
  it('hentVeilederinfo() skal returnere riktig action', () => {
    expect(hentVeilederinfo()).to.deep.equal({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT,
    });
  });

  it('henterVeilederinfo() skal returnere riktig action', () => {
    expect(henterVeilederinfo()).to.deep.equal({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER,
    });
  });

  it('veilederinfoHentet() skal returnere riktig action', () => {
    const data = veilederinfo;
    expect(veilederinfoHentet(data)).to.deep.equal({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET,
      data,
    });
  });

  it('hentVeilederinfoFeilet() skal returnere riktig action', () => {
    expect(hentVeilederinfoFeilet()).to.deep.equal({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET,
    });
  });
});
