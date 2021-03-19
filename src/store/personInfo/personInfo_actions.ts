import { Fodselsnummer, PersonInfo } from './personInfoTypes';

export enum PersonInfoActionTypes {
  HENT_PERSON_INFO_FORESPURT = 'HENT_PERSON_INFO_FORESPURT',
  HENT_PERSON_INFO_HENTER = 'HENT_PERSON_INFO_HENTER',
  HENT_PERSON_INFO_FEILET = 'HENT_PERSON_INFO_FEILET',
  HENT_PERSON_INFO_HENTET = 'HENT_PERSON_INFO_HENTET',
}

export interface HentPersonInfoForespurtAction {
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT;
  data: Fodselsnummer[];
}

export interface HentPersonInfoHenterAction {
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTER;
}

export interface HentPersonInfoHentetAction {
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTET;
  data: PersonInfo[];
}

export interface HentPersonInfoFeiletAction {
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FEILET;
}

export type PersoninfoAction =
  | HentPersonInfoForespurtAction
  | HentPersonInfoHenterAction
  | HentPersonInfoHentetAction
  | HentPersonInfoFeiletAction;

export const hentPersonInfoForespurt = (
  data: Fodselsnummer[]
): PersoninfoAction => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
  data,
});

export const hentPersonInfoHenter = (): PersoninfoAction => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTER,
});

export const hentPersonInfoHentet = (data: PersonInfo[]): PersoninfoAction => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_HENTET,
  data,
});

export const hentPersonInfoFeilet = (): PersoninfoAction => ({
  type: PersonInfoActionTypes.HENT_PERSON_INFO_FEILET,
});
