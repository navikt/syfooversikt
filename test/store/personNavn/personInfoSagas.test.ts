import { expect } from 'chai';
import { put, call } from 'redux-saga/effects';
import { hentPersonInfoSaga } from '../../../src/store/personInfo/personInfoSagas';
import {
  HentPersonInfoForespurtAction,
  PersonInfoActionTypes,
} from '../../../src/store/personInfo/personInfo_actions';
import { post } from '../../../src/api';
import { testdata } from '../../data/fellesTestdata';

describe('hentPersonInfoSagas', () => {
  const forespurtAction: HentPersonInfoForespurtAction = {
    type: PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
    data: [{ fnr: testdata.fnr1 }],
  };
  const generator = hentPersonInfoSaga(forespurtAction);

  it(`Skal dispatche ${PersonInfoActionTypes.HENT_PERSON_INFO_HENTER}`, () => {
    const nesteAction = put({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTER,
    });
    expect(generator.next().value).to.deep.equal(nesteAction);
  });

  it('Skal dernest kalle REST-tjenesten', () => {
    const url = '/syfoperson/api/person/info';
    const nesteKall = call(post, url, forespurtAction.data);
    expect(generator.next().value).to.deep.equal(nesteKall);
  });

  it(`Skal dernest sette ${PersonInfoActionTypes.HENT_PERSON_INFO_HENTET}`, () => {
    const personInfoSvar = [
      {
        fnr: testdata.fnr1,
        skjermingskode: testdata.skjermingskode.ingen,
      },
    ];
    const nextPut = put({
      type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTET,
      data: personInfoSvar,
    });
    expect(generator.next(personInfoSvar).value).to.deep.equal(nextPut);
  });
});
