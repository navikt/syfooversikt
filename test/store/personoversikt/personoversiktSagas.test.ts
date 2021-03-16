import { expect } from 'chai';
import { put, call, select } from 'redux-saga/effects';
import { get } from '../../../src/api';
import { personoversikt } from '../../data/fellesTestdata';
import {
  henterPersonerMedEnhet,
  hentPersonoversikt,
} from '../../../src/store/personoversikt/personoversiktSagas';
import {
  HentPersonoversiktForespurtAction,
  PersonoversiktActionTypes,
} from '../../../src/store/personoversikt/personoversikt_actions';

describe('personoversiktSagas', () => {
  const action: HentPersonoversiktForespurtAction = {
    type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT,
    enhetId: '0101',
  };
  const generator = hentPersonoversikt(action);

  it(`Henter personer på enhetid`, () => {
    const nesteSelect = select(henterPersonerMedEnhet);
    expect(generator.next().value).to.deep.equal(nesteSelect);
  });

  it(`Skal dispatche ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER}`, () => {
    const nesteAction = put({
      type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER,
    });
    expect(generator.next().value).to.deep.equal(nesteAction);
  });

  it('Skal dernest kalle REST-tjenesten', () => {
    const url = `/api/v1/personoversikt/enhet/${action.enhetId}`;
    const nesteKall = call(get, url);
    expect(generator.next().value).to.deep.equal(nesteKall);
  });

  it(`Skal dernest sette ${PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET}`, () => {
    const data = [...personoversikt];
    const nextPut = put({
      type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET,
      data,
    });
    expect(generator.next(data).value).to.deep.equal(nextPut);
  });
});
