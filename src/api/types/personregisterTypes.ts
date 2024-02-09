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
  aktivitetskravSistVurdert: Date | null;
  aktivitetskravActive: boolean;
  aktivitetskravVurderingFrist: Date | null;
  harBehandlerdialogUbehandlet: boolean;
  harAktivitetskravVurderStansUbehandlet: boolean;
  harOppfolgingsoppgave: boolean;
  oppfolgingsoppgaveFrist: Date | null;
  behandlerBerOmBistandUbehandlet: boolean;
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
  skjermingskode: Skjermingskode;
}
