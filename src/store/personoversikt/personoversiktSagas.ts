import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './personoversikt_actions';
import { hentFodselsnummerFraPersonOversikt } from '../../components/utils/util';
import * as personInfoActions from '../personInfo/personInfo_actions';
import { PersonoversiktStatus } from './personoversiktTypes';
import { filterOnEnhet } from '../../utils/hendelseFilteringUtils';

export function* hentPersonoversikt(enhetId: string) {
  yield put(actions.hentPersonoversiktHenter());
  try {
    const path = `${process.env.REACT_APP_SYFOOVERSIKTSRVREST_ROOT}/personoversikt/enhet/${enhetId}`;
    const data = yield call(get, path);
    if (data.length > 0) {
      yield put(actions.hentPersonoversiktHentet(data));
      yield call(hentNavnForPersonerUtenNavn, data);
    } else {
      yield put(actions.hentPersonoversiktHentet([]));
    }
  } catch (e) {
    yield put(actions.hentPersonoversiktFeilet());
  }
}

export const hentPersonregister = (state: any) => {
  return state.personregister || [];
};

export function* hentNavnForPersonerUtenNavn(
  data: PersonoversiktStatus[]
): any {
  const fnrListe = hentFodselsnummerFraPersonOversikt(data);

  const personRegisterData = yield select(hentPersonregister);

  const filtrertListe = fnrListe.filter((fnrObjekt) => {
    return (
      !personRegisterData[fnrObjekt.fnr] ||
      (personRegisterData[fnrObjekt.fnr] &&
        personRegisterData[fnrObjekt.fnr].skjermingskode === undefined) ||
      (personRegisterData[fnrObjekt.fnr] &&
        personRegisterData[fnrObjekt.fnr].navn === '')
    );
  });

  yield put(personInfoActions.hentPersonInfoForespurt(filtrertListe));
}

const hentetAktivEnhetId = (state: any): string => {
  return state.veilederenheter.aktivEnhetId || '';
};

const henterPersonerMedEnhet = (state: any): boolean => {
  return (
    Object.keys(
      filterOnEnhet(state.personregister, state.veilederenheter.aktivEnhetId)
    ).length > 0
  );
};

export function* hentPersonoversiktHvisEnhetHentet(): any {
  const enhetId = yield select(hentetAktivEnhetId);
  const harHentetPersonerPaEnhetId = yield select(henterPersonerMedEnhet);
  if (enhetId !== '' && !harHentetPersonerPaEnhetId) {
    yield hentPersonoversikt(enhetId);
  }
}

function* watchHentPersonoversikt() {
  yield takeEvery(
    actions.PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT,
    hentPersonoversiktHvisEnhetHentet
  );
}

export default function* personoversiktSagas() {
  yield all([fork(watchHentPersonoversikt)]);
}
