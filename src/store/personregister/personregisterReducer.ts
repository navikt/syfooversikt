import { Reducer } from 'redux';
import { PersonInfo } from '../personInfo/personInfoTypes';
import { PersonInfoActionTypes } from '../personInfo/personInfo_actions';
import { VeilederArbeidstaker } from '../veilederArbeidstaker/veilederArbeidstakerTypes';
import { veilederArbeidstakerActionTypes } from '../veilederArbeidstaker/veilederArbeidstaker_actions';
import { PersonoversiktStatus } from '../personoversikt/personoversiktTypes';
import { PersonoversiktActionTypes } from '../personoversikt/personoversikt_actions';
import { PersonData, PersonregisterState } from './personregisterTypes';

const tilPersonDataMap = (personDataMapObject: any) => {
  return personDataMapObject.reduce(
    (acc: {}, curr: { [fnr: string]: PersonData }) => {
      return { ...acc, ...curr };
    },
    {}
  );
};

const initiellState = {};

const hasName = (person: PersonData) => {
  return person && person.navn && person.navn.length > 0;
};

const personregisterReducer: Reducer<PersonregisterState> = (
  state = initiellState,
  action
) => {
  switch (action.type) {
    case PersonInfoActionTypes.HENT_PERSON_INFO_HENTET: {
      const navnHentet = action.data;
      const personerSomSkalOppdateres: {
        [fnr: string]: PersonData;
      } = navnHentet.map((personInfo: PersonInfo) => ({
        [personInfo.fnr]: {
          ...state[personInfo.fnr],
          skjermingskode: personInfo.skjermingskode,
        },
      }));
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return { ...state, ...oppdatering };
    }
    case veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET: {
      const tildelinger = action.data;
      const personerSomSkalOppdateres = tildelinger.map(
        (tildeling: VeilederArbeidstaker) => ({
          [tildeling.fnr]: {
            ...state[tildeling.fnr],
            tildeltEnhetId: tildeling.enhet,
            tildeltVeilederIdent: tildeling.veilederIdent,
          },
        })
      );
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return { ...state, ...oppdatering };
    }
    case PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET: {
      const personoversikt = action.data;
      const personerSomSkalOppdateres = personoversikt.map(
        (person: PersonoversiktStatus) => ({
          [person.fnr]: {
            ...state[person.fnr],
            navn: person.navn,
            tildeltEnhetId: person.enhet,
            tildeltVeilederIdent: person.veilederIdent,
            harMotebehovUbehandlet: person.motebehovUbehandlet,
            harMoteplanleggerUbehandlet: person.moteplanleggerUbehandlet,
            harOppfolgingsplanLPSBistandUbehandlet:
              person.oppfolgingsplanLPSBistandUbehandlet,
            oppfolgingstilfeller: person.oppfolgingstilfeller,
          },
        })
      );
      const oppdatering = tilPersonDataMap(personerSomSkalOppdateres);
      return { ...state, ...oppdatering };
    }
  }
  return state;
};

export default personregisterReducer;
