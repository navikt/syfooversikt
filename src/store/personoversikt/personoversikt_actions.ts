import { PersonoversiktStatus } from './personoversiktTypes';

export const enum PersonoversiktActionTypes {
  HENT_PERSONOVERSIKT_ENHET_FORESPURT = 'HENT_PERSONOVERSIKT_ENHET_FORESPURT',
  HENT_PERSONOVERSIKT_ENHET_HENTER = 'HENT_PERSONOVERSIKT_ENHET_HENTER',
  HENT_PERSONOVERSIKT_ENHET_HENTET = 'HENT_PERSONOVERSIKT_ENHET_HENTET',
  HENT_PERSONOVERSIKT_ENHET_FEILET = 'HENT_PERSONOVERSIKT_ENHET_FEILET',
}

export const hentPersonoversiktForespurt = (enhetId: string) => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FORESPURT,
  enhetId,
});

export const hentPersonoversiktHenter = () => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTER,
});

export const hentPersonoversiktHentet = (data: PersonoversiktStatus[]) => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_HENTET,
  data,
});

export const hentPersonoversiktFeilet = () => ({
  type: PersonoversiktActionTypes.HENT_PERSONOVERSIKT_ENHET_FEILET,
});
