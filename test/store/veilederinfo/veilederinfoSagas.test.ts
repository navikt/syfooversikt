import { expect } from 'chai';
import { put, call } from 'redux-saga/effects';
import { hentVeilederinfoSaga } from '../../../src/store/veilederinfo/veilederinfoSagas';
import { get } from '../../../src/api';
import { VeilederinfoActionTypes } from '../../../src/store/veilederinfo/veilederinfo_actions';
import { veilederinfo } from '../../data/fellesTestdata';
import { VeilederinfoDTO } from '../../../src/store/veilederinfo/veilederinfoTypes';

describe('veilederinfoSagas', () => {
  const generator = hentVeilederinfoSaga();

  it(`Skal dispatche ${VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER}`, () => {
    const nesteAction = put({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER,
    });
    expect(generator.next().value).to.deep.equal(nesteAction);
  });

  it('Skal dernest kalle REST-tjenesten', () => {
    const url = '/syfoveileder/api/v2/veileder/self';
    const nesteKall = call(get, url);
    expect(generator.next().value).to.deep.equal(nesteKall);
  });

  it(`Skal dernest sette ${VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET}`, () => {
    const data: VeilederinfoDTO = veilederinfo;
    const nextPut = put({
      type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET,
      data,
    });
    expect(generator.next(data).value).to.deep.equal(nextPut);
  });
});
