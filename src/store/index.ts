import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { all, fork } from 'redux-saga/effects';
import { ModiacontextState } from './modiacontext/modiacontextTypes';
import { VeiledereState } from './veiledere/veiledereTypes';
import { VeilederenheterState } from './veilederenheter/veilederenheterTypes';
import { VeilederinfoState } from './veilederinfo/veilederinfoTypes';
import { PersonInfoState } from './personInfo/personInfoTypes';
import { PersonregisterState } from './personregister/personregisterTypes';
import { PersonoversiktStatusState } from './personoversikt/personoversiktTypes';
import modiacontextReducer from './modiacontext/modiacontextReducer';
import veiledereReducer from './veiledere/veiledereReducer';
import veilederenheterReducer from './veilederenheter/veilederenheterReducer';
import veilederinfoReducer from './veilederinfo/veilederinfoReducer';
import personInfoReducer from './personInfo/personInfoReducer';
import personoversiktReducer from './personoversikt/personoversiktReducer';
import personregisterReducer from './personregister/personregisterReducer';

import modiacontextSagas from './modiacontext/modiacontextSagas';
import veiledereSagas from './veiledere/veiledereSagas';
import veilederinfoSagas from './veilederinfo/veilederinfoSagas';
import personInfoSagas from './personInfo/personInfoSagas';
import personoversiktSagas from './personoversikt/personoversiktSagas';
import configureStore from './configureStore';
import veilederArbeidstakerSagas from './veilederArbeidstaker/veilederArbeidstakerSagas';
import changelogReducer, { ChangelogState } from './changelog/changelogReducer';
import changelogSagas from './changelog/changelogSagas';
import { createBrowserHistory } from 'history';
import filterReducer, { FilterState } from './filters/filterReducer';
import sortingReducer from './sorting/sortingReducer';
import { SortingState } from './sorting/sortingTypes';

export interface ApplicationState {
  router: any;
  changelogs: ChangelogState;
  modiacontext: ModiacontextState;
  filters: FilterState;
  veiledere: VeiledereState;
  veilederenheter: VeilederenheterState;
  veilederinfo: VeilederinfoState;
  personInfo: PersonInfoState;
  personoversikt: PersonoversiktStatusState;
  personregister: PersonregisterState;
  sorting: SortingState;
}

export const rootReducer = (): Reducer =>
  combineReducers<ApplicationState>({
    router: connectRouter(history),
    changelogs: changelogReducer,
    filters: filterReducer,
    modiacontext: modiacontextReducer,
    veiledere: veiledereReducer,
    veilederenheter: veilederenheterReducer,
    veilederinfo: veilederinfoReducer,
    personInfo: personInfoReducer,
    personoversikt: personoversiktReducer,
    personregister: personregisterReducer,
    sorting: sortingReducer,
  });

export function* rootSaga() {
  yield all([
    fork(changelogSagas),
    fork(modiacontextSagas),
    fork(personoversiktSagas),
    fork(personInfoSagas),
    fork(veilederArbeidstakerSagas),
    fork(veiledereSagas),
    fork(veilederinfoSagas),
  ]);
}

const history = createBrowserHistory();

const initialState = (window as any).initialReduxState;

const store = configureStore(history, initialState);

export { store, history };
