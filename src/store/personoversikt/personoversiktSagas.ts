import { call, put, select, takeEvery } from 'redux-saga/effects';
import { get } from '../../api';
import * as actions from './personoversikt_actions';
import { hentFodselsnummerFraPersonOversikt } from '../../components/utils/util';
import * as personInfoActions from '../personInfo/personInfo_actions';
import { PersonoversiktStatus } from './personoversiktTypes';
import { filterOnEnhet } from '../../utils/hendelseFilteringUtils';
import { ApplicationState } from '../index';
import { PersonregisterState } from '../personregister/personregisterTypes';
import { HentPersonoversiktForespurtAction } from './personoversikt_actions';

export const hentPersonregister = (
  state: ApplicationState
): PersonregisterState => {
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

export const henterPersonerMedEnhet = (state: any): boolean => {
  return (
    Object.keys(
      filterOnEnhet(state.personregister, state.veilederenheter.aktivEnhetId)
    ).length > 0
  );
};

export function* hentPersonoversikt(
  action: HentPersonoversiktForespurtAction
): any {
  const harHentetPersonerPaEnhetId = yield select(henterPersonerMedEnhet);

  if (action.enhetId !== '' && !harHentetPersonerPaEnhetId) {
    yield put(actions.hentPersonoversiktHenter());
    try {
      const path = `${process.env.REACT_APP_SYFOOVERSIKTSRVREST_ROOT}/personoversikt/enhet/${action.enhetId}`;
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
}

export default function* personoversiktSagas(): Generator {
  yield takeEvery(
    actions.PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT,
    hentPersonoversikt
  );
}
