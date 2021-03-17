import { PersonInfo, Fodselsnummer } from './personInfoTypes';

export const enum PersonInfoActionTypes {
  HENT_PERSON_INFO_FORESPURT = 'HENT_PERSON_INFO_FORESPURT',
  HENT_PERSON_INFO_HENTER = 'HENT_PERSON_INFO_HENTER',
  HENT_PERSON_INFO_FEILET = 'HENT_PERSON_INFO_FEILET',
  HENT_PERSON_INFO_HENTET = 'HENT_PERSON_INFO_HENTET',
}

export const hentPersonInfoForespurt = (data: Fodselsnummer[]) => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
  data,
});

export const hentPersonInfoHenter = () => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTER,
});

export const hentPersonInfoHentet = (data: PersonInfo[]) => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTET,
  data,
});

export const hentPersonInfoFeilet = () => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FEILET,
});
