import { Oppfolgingstilfelle } from './personoversiktTypes';

export type Skjermingskode = 'INGEN' | 'DISKRESJONSMERKET' | 'EGEN_ANSATT';

export interface PersonData {
  navn: string;
  harMotebehovUbehandlet: boolean;
  harMoteplanleggerUbehandlet: boolean;
  harOppfolgingsplanLPSBistandUbehandlet: boolean;
  skjermingskode: Skjermingskode;
  markert: boolean;
  tildeltEnhetId: string;
  tildeltVeilederIdent: string;
  oppfolgingstilfeller: Oppfolgingstilfelle[];
}

export interface PersonregisterState {
  [fnr: string]: PersonData;
}

export interface PersonHendelseData {
  fnr: string;
  skjermingskode: Skjermingskode;
}

export interface PersonregisterData {
  fnr: string;
  navn: string;
  skjermingskode: Skjermingskode;
}
