import { Reducer } from 'redux';
import { PersonInfo } from '../personInfo/personInfoTypes';
import { PersonInfoActionTypes } from '../personInfo/personInfo_actions';
import { VeilederArbeidstaker } from '../veilederArbeidstaker/veilederArbeidstakerTypes';
import { veilederArbeidstakerActionTypes } from '../veilederArbeidstaker/veilederArbeidstaker_actions';
import { PersonoversiktStatus } from '../personoversikt/personoversiktTypes';
import { PersonoversiktActionTypes } from '../personoversikt/personoversikt_actions';
import {
  PersonData,
  PersonregisterState,
  PersonHendelseData,
} from './personregisterTypes';

const tilPersonDataMap = (personDataMapObject: any) => {
  return personDataMapObject.reduce((acc: { }, curr: { [fnr: string]: PersonData}) => {
    return {...acc, ...curr};
  }, { });
};

const initiellState = { };

const personregisterReducer: Reducer<PersonregisterState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case PersonInfoActionTypes.HENT_PERSON_INFO_HENTET: {
      const navnHentet = action.data;
      const personerSomSkalOppdateres: { [fnr: string]: PersonData } = navnHentet.map((personInfo: PersonInfo) => {
        return {
          [personInfo.fnr]: {
            ...state[personInfo.fnr],
            navn: personInfo.navn,
            skjermingskode: personInfo.skjermingskode,
          },
        };
      });
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return {...state, ...oppdatering };
    }
    case veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET: {
      const tildelinger = action.data;
      const personerSomSkalOppdateres = tildelinger.map((tildeling: VeilederArbeidstaker) => {
        return {
          [tildeling.fnr]: {
            ...state[tildeling.fnr],
            tildeltEnhetId: tildeling.enhet,
            tildeltVeilederIdent: tildeling.veilederIdent,
          },
        };
      });
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return {...state, ...oppdatering };
    }
    case PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET: {
      const personoversikt = action.data;
      const personerSomSkalOppdateres = personoversikt.map((person: PersonoversiktStatus) => {
        return {
          [person.fnr]: {
            ...state[person.fnr],
            tildeltEnhetId: person.enhet,
            tildeltVeilederIdent: person.veilederIdent,
            harMotebehovUbehandlet: person.motebehovUbehandlet,
            harMoteplanleggerUbehandlet: person.moteplanleggerUbehandlet,
          },
        };
      });
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return {...state, ...oppdatering };
    }
  }
  return state;
};

export default personregisterReducer;
