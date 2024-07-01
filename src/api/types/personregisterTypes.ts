import {
  AktivitetskravStatus,
  ArbeidsuforhetvurderingDTO,
  OppfolgingsoppgaveDTO,
  OppfolgingstilfelleDTO,
  SnartSluttPaSykepengeneDTO,
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
  aktivitetskravActive: boolean;
  aktivitetskravVurderingFrist: Date | null;
  harBehandlerdialogUbehandlet: boolean;
  harAktivitetskravVurderStansUbehandlet: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  friskmeldingTilArbeidsformidlingFom: Date | null;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  snartSluttPaSykepengene: SnartSluttPaSykepengeneDTO | null;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO | null;
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
