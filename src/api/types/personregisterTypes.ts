import {
  AktivitetskravStatus,
  OppfolgingstilfelleDTO,
} from './personoversiktTypes';

export type Skjermingskode = 'INGEN' | 'DISKRESJONSMERKET' | 'EGEN_ANSATT';
export type ReadableSkjermingskode =
  | 'ingen'
  | 'diskresjonsmerket'
  | 'egen ansatt';
export type ReadableSkjermingskodeMap = Record<
  Skjermingskode,
  ReadableSkjermingskode
>;

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
  aktivitetskrav: AktivitetskravStatus | null;
  aktivitetskravStoppunkt: Date | null;
  aktivitetskravUpdatedAt: Date | null;
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
