import { combineReducers, Dispatch, Action, AnyAction } from 'redux';
import { connectRouter } from 'connected-react-router';
import { all, fork } from 'redux-saga/effects';
import { ModiacontextState } from './modiacontext/modiacontextTypes';
import { VeiledereState } from './veiledere/veiledereTypes';
import { VeilederenheterState } from './veilederenheter/veilederenheterTypes';
import { VeilederinfoState } from './veilederinfo/veilederinfoTypes';
import { PersonInfoState } from './personInfo/personInfoTypes';
import { PersonregisterState } from './personregister/personregisterTypes';
import { EnhetNavnState } from './enhetNavn/enhetNavnTypes';
import { PersonoversiktStatusState } from './personoversikt/personoversiktTypes';
import modiacontextReducer from './modiacontext/modiacontextReducer';
import veiledereReducer from './veiledere/veiledereReducer';
import veilederenheterReducer from './veilederenheter/veilederenheterReducer';
import veilederinfoReducer from './veilederinfo/veilederinfoReducer';
import personInfoReducer from './personInfo/personInfoReducer';
import personoversiktReducer from './personoversikt/personoversiktReducer';
import enhetNavnReducer from './enhetNavn/enhetNavnReducer';
import personregisterReducer from './personregister/personregisterReducer';

import modiacontextSagas from './modiacontext/modiacontextSagas';
import veiledereSagas from './veiledere/veiledereSagas';
import veilederenheterSagas from './veilederenheter/veilederenheterSagas';
import veilederinfoSagas from './veilederinfo/veilederinfoSagas';
import personInfoSagas from './personInfo/personInfoSagas';
import personoversiktSagas from './personoversikt/personoversiktSagas';
import configureStore from './configureStore';
import veilederArbeidstakerSagas from './veilederArbeidstaker/veilederArbeidstakerSagas';
import enhetNavnSagas from './enhetNavn/enhetNavnSagas';
import changelogReducer, { ChangelogState } from './changelog/changelogReducer';
import changelogSagas from './changelog/changelogSagas';
import { createBrowserHistory } from 'history';

export interface ApplicationState {
  router: any;
  modiacontext: ModiacontextState;
  veiledere: VeiledereState;
  veilederenheter: VeilederenheterState;
  veilederinfo: VeilederinfoState;
  personInfo: PersonInfoState;
  personoversikt: PersonoversiktStatusState;
  personregister: PersonregisterState;
  enhetNavn: EnhetNavnState;
  changelogs: ChangelogState;
}

export interface ConnectedReduxProps<A extends Action = AnyAction> {
  dispatch: Dispatch<A>;
}

export const rootReducer = () => combineReducers<ApplicationState>({
  router: connectRouter(history),
  modiacontext: modiacontextReducer,
  veiledere: veiledereReducer,
  veilederenheter: veilederenheterReducer,
  veilederinfo: veilederinfoReducer,
  personInfo: personInfoReducer,
  personoversikt: personoversiktReducer,
  personregister: personregisterReducer,
  enhetNavn: enhetNavnReducer,
  changelogs: changelogReducer,
});

export function* rootSaga() {
  yield all([
    fork(modiacontextSagas),
    fork(veiledereSagas),
    fork(veilederenheterSagas),
    fork(veilederinfoSagas),
    fork(personInfoSagas),
    fork(personoversiktSagas),
    fork(veilederArbeidstakerSagas),
    fork(enhetNavnSagas),
    fork(changelogSagas),
  ]);
}

const history = createBrowserHistory();

const initialState = (window as any).initialReduxState;

const store = configureStore(history, initialState);

export { store, history };
