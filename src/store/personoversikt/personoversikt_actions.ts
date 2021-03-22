import { PersonoversiktStatus } from './personoversiktTypes';

export enum PersonoversiktActionTypes {
  HENT_PERSONOVERSIKT_ENHET_FORESPURT = 'HENT_PERSONOVERSIKT_ENHET_FORESPURT',
  HENT_PERSONOVERSIKT_ENHET_HENTER = 'HENT_PERSONOVERSIKT_ENHET_HENTER',
  HENT_PERSONOVERSIKT_ENHET_HENTET = 'HENT_PERSONOVERSIKT_ENHET_HENTET',
  HENT_PERSONOVERSIKT_ENHET_FEILET = 'HENT_PERSONOVERSIKT_ENHET_FEILET',
}

export interface HentPersonoversiktForespurtAction {
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT;
  enhetId: string;
}

export interface HentPersonoversiktHenterAction {
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER;
}

export interface HentPersonoversiktHentetAction {
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET;
  data: PersonoversiktStatus[];
}

export interface HentPersonoversiktFeiletAction {
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FEILET;
}

export type PersonoversiktType =
  | HentPersonoversiktForespurtAction
  | HentPersonoversiktHenterAction
  | HentPersonoversiktHentetAction
  | HentPersonoversiktFeiletAction;

export const hentPersonoversiktForespurt = (
  enhetId: string
): PersonoversiktType => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT,
  enhetId,
});

export const hentPersonoversiktHenter = (): PersonoversiktType => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER,
});

export const hentPersonoversiktHentet = (
  data: PersonoversiktStatus[]
): PersonoversiktType => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET,
  data,
});

export const hentPersonoversiktFeilet = (): PersonoversiktType => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FEILET,
});
