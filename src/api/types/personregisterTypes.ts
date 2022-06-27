import { OppfolgingstilfelleDTO } from './personoversiktTypes';

export type Skjermingskode = 'INGEN' | 'DISKRESJONSMERKET' | 'EGEN_ANSATT';

export interface PersonData {
  navn: string;
  harMotebehovUbehandlet: boolean;
  harDialogmotesvar: boolean;
  harOppfolgingsplanLPSBistandUbehandlet: boolean;
  skjermingskode: Skjermingskode;
  markert: boolean;
  tildeltEnhetId: string;
  tildeltVeilederIdent: string;
  dialogmotekandidat?: boolean;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
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
